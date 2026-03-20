'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: string;
  scheduleRaw: string | null;
  tz: string | null;
  status: 'ok' | 'error' | 'running' | 'disabled';
  lastRunAt: number | null;
  nextRunAt: number | null;
  lastDurationMs: number | null;
  lastRunStatus: string | null;
  consecutiveErrors: number;
  lastDeliveryStatus: string | null;
  lastError: string | null;
  payloadKind: string | null;
  sessionTarget: string | null;
  agentId: string | null;
}

interface CronsContextValue {
  jobs: CronJob[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const CronsContext = createContext<CronsContextValue>({
  jobs: [],
  loading: true,
  error: null,
  refresh: () => {},
});

export function CronsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/crons');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cron jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [fetchJobs]);

  return (
    <CronsContext.Provider value={{ jobs, loading, error, refresh: fetchJobs }}>
      {children}
    </CronsContext.Provider>
  );
}

export function useCrons() {
  return useContext(CronsContext);
}
