'use client';

import { useState, useEffect } from 'react';

export interface AgentData {
  id: string;
  name: string;
  model: string;
  provider?: string;
  contextWindow?: number;
  status: 'active' | 'idle' | 'error' | 'sleeping';
  tokenCount: number;
  uptime?: string;
  lastActivity?: string;
}

interface SessionListResponse {
  agents?: Array<{
    agentId: string;
    name?: string;
    sessions?: Array<{
      key: string;
      status?: string;
      model?: string;
      provider?: string;
      contextWindow?: number;
      tokenCount?: number;
    }>;
  }>;
}

export function useAgents() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAgents = async () => {
      try {
        // Call our Next.js API route instead of WebSocket
        const response = await fetch('/api/agents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch agents: ${response.statusText}`);
        }

        const data: SessionListResponse = await response.json();

        if (isMounted && data.agents) {
          const mappedAgents: AgentData[] = data.agents.map((agent) => {
            const session = agent.sessions?.[0];
            return {
              id: agent.agentId,
              name: agent.name || agent.agentId.charAt(0).toUpperCase() + agent.agentId.slice(1),
              model: session?.model || 'Claude Haiku 4.5',
              provider: session?.provider,
              contextWindow: session?.contextWindow,
              status:
                session?.status === 'active'
                  ? 'active'
                  : session?.status === 'idle'
                    ? 'idle'
                    : 'sleeping',
              tokenCount: session?.tokenCount || 0,
            };
          });

          setAgents(mappedAgents);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching agents:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch agents');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAgents();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchAgents, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { agents, loading, error };
}
