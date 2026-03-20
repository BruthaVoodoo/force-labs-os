// WebSocket client for OpenClaw Gateway
export interface GatewayMessage {
  type: 'req' | 'res' | 'event';
  id?: string;
  method?: string;
  params?: Record<string, any>;
  ok?: boolean;
  payload?: any;
  event?: string;
  seq?: number;
}

export class GatewayWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private eventHandlers: Map<string, (data: any) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageId = 0;

  constructor(url: string = 'wss://openclaws-mac-mini.tailcc5cde.ts.net:18789') {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('✅ Connected to OpenClaw gateway');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: GatewayMessage = JSON.parse(event.data);
            
            // Handle response messages
            if (message.type === 'res' && message.id) {
              const handler = this.messageHandlers.get(message.id);
              if (handler) {
                handler(message.payload);
                this.messageHandlers.delete(message.id);
              }
            }

            // Handle event messages
            if (message.type === 'event' && message.event) {
              const handler = this.eventHandlers.get(message.event);
              if (handler) {
                handler(message.payload);
              }
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔴 Disconnected from OpenClaw gateway');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => this.connect().catch(console.error), this.reconnectDelay);
    }
  }

  request<T = any>(method: string, params: Record<string, any> = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const id = `msg-${++this.messageId}`;
      const timeout = setTimeout(() => {
        this.messageHandlers.delete(id);
        reject(new Error(`Request ${method} timed out`));
      }, 10000);

      this.messageHandlers.set(id, (payload) => {
        clearTimeout(timeout);
        resolve(payload as T);
      });

      const message: GatewayMessage = {
        type: 'req',
        id,
        method,
        params,
      };

      this.ws!.send(JSON.stringify(message));
    });
  }

  subscribe(eventName: string, handler: (data: any) => void) {
    this.eventHandlers.set(eventName, handler);
    return () => this.eventHandlers.delete(eventName);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
let gatewayClient: GatewayWebSocket | null = null;

export function getGatewayClient(): GatewayWebSocket {
  if (!gatewayClient) {
    gatewayClient = new GatewayWebSocket();
  }
  return gatewayClient;
}
