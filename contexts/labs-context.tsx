'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type CardStatus = 'draft' | 'queued' | 'in-progress' | 'done' | 'dismissed';
export type CardKind = 'client' | 'idea';

export interface LabsCard {
  id: string;
  kind: CardKind;
  title: string;
  subtitle: string;
  description: string; // markdown content for the modal brief
  sandboxPath: string; // path to iframe src, e.g. /sandbox/card-id/index.html
  status: CardStatus;
  createdAt: string; // ISO date string
  tags: string[];
  source?: string; // 'manual' | 'revan-nightly'
}

// Client work is static for now — only ideas come from the API
const CLIENT_CARDS: LabsCard[] = [
  {
    id: 'client-001',
    kind: 'client',
    title: 'Client Portal v1',
    subtitle: 'Acme Corp — Dashboard Redesign',
    description: `# Client Portal v1\n\n## Project\nAcme Corp dashboard redesign — Phase 1.\n\n## Scope\n- Responsive layout overhaul\n- New data visualization components\n- Dark mode support\n\n## Status\nIn active development. Preview shows current build.\n\n## Notes\nDesign approved by client on March 15th.`,
    sandboxPath: '/sandbox/client-001/index.html',
    status: 'draft',
    createdAt: '2026-03-20T09:00:00Z',
    tags: ['client', 'dashboard', 'ui'],
    source: 'manual',
  },
];

interface LabsContextValue {
  cards: LabsCard[];
  acceptIdea: (id: string) => void;
  dismissIdea: (id: string) => void;
  restoreIdea: (id: string) => void;
  getQueue: () => LabsCard[];
  loading: boolean;
}

const LabsContext = createContext<LabsContextValue>({
  cards: CLIENT_CARDS,
  acceptIdea: () => {},
  dismissIdea: () => {},
  restoreIdea: () => {},
  getQueue: () => [],
  loading: false,
});

export function LabsProvider({ children }: { children: ReactNode }) {
  const [ideas, setIdeas] = useState<LabsCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Load ideas from API on mount
  useEffect(() => {
    fetch('/api/labs/ideas')
      .then(r => r.json())
      .then((data: LabsCard[]) => {
        setIdeas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const patchStatus = useCallback(async (id: string, status: CardStatus) => {
    await fetch('/api/labs/ideas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(console.error);
  }, []);

  const acceptIdea = useCallback((id: string) => {
    setIdeas(prev => prev.map(c => c.id === id ? { ...c, status: 'queued' } : c));
    patchStatus(id, 'queued');
  }, [patchStatus]);

  const dismissIdea = useCallback((id: string) => {
    setIdeas(prev => prev.map(c => c.id === id ? { ...c, status: 'dismissed' } : c));
    patchStatus(id, 'dismissed');
  }, [patchStatus]);

  const restoreIdea = useCallback((id: string) => {
    setIdeas(prev => prev.map(c =>
      c.id === id && c.status === 'dismissed' ? { ...c, status: 'draft' } : c
    ));
    patchStatus(id, 'draft');
  }, [patchStatus]);

  const getQueue = useCallback(() => {
    return [...CLIENT_CARDS, ...ideas].filter(c => c.status === 'queued');
  }, [ideas]);

  return (
    <LabsContext.Provider value={{
      cards: [...CLIENT_CARDS, ...ideas],
      acceptIdea,
      dismissIdea,
      restoreIdea,
      getQueue,
      loading,
    }}>
      {children}
    </LabsContext.Provider>
  );
}

export function useLabs() {
  return useContext(LabsContext);
}
