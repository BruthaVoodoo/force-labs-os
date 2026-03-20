'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface AgentData {
  id: string;
  name: string;
  model: string;
  provider: string;
  contextWindow: number;
  status: 'active' | 'idle' | 'sleeping' | 'error';
  tokenCount: number;
}

interface AgentsContextValue {
  agents: AgentData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

const AgentsContext = createContext<AgentsContextValue>({
  agents: [],
  loading: true,
  error: null,
  lastUpdated: null,
  refresh: () => {},
});

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const mapped: AgentData[] = (data.agents ?? []).map((agent: any) => {
        const session = agent.sessions?.[0] ?? {};
        return {
          id: agent.agentId,
          name: agent.name,
          model: session.model ?? 'Unknown',
          provider: session.provider ?? 'Unknown',
          contextWindow: session.contextWindow ?? 0,
          status: session.status ?? 'sleeping',
          tokenCount: session.tokenCount ?? 0,
        };
      });

      setAgents(mapped);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  return (
    <AgentsContext.Provider value={{ agents, loading, error, lastUpdated, refresh: fetchAgents }}>
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgents() {
  return useContext(AgentsContext);
}
