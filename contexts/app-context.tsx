'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ModuleId = 'ops' | 'brain' | 'labs';
export type ModuleColor = 'yellow' | 'blue' | 'emerald';

export interface Notification {
  id: string;
  moduleId: ModuleId;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: Date;
}

interface AppState {
  // Navigation
  activeModule: ModuleId;
  activeTabs: Record<ModuleId, string[]>;
  activeTab: Record<ModuleId, string>;

  // Notifications / badges
  notifications: Notification[];
  badgeCounts: Record<ModuleId, number>;
}

interface AppContextValue extends AppState {
  // Navigation actions
  setActiveModule: (module: ModuleId) => void;
  setActiveTab: (tab: string) => void;
  setActiveTabs: (tabs: string[]) => void;
  openTab: (moduleId: ModuleId, tabName: string) => void; // Opens a tab on any module and navigates there

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotification: (id: string) => void;
  clearModuleNotifications: (moduleId: ModuleId) => void;
}

const DEFAULT_TABS: Record<ModuleId, string[]> = {
  ops:   ['Mission Control'],
  brain: ['Daily Briefs'],
  labs:  ['The Lab'],
};

const DEFAULT_ACTIVE_TAB: Record<ModuleId, string> = {
  ops:   'Mission Control',
  brain: 'Daily Briefs',
  labs:  'The Lab',
};

const AppContext = createContext<AppContextValue>({
  activeModule: 'ops',
  activeTabs: DEFAULT_TABS,
  activeTab: DEFAULT_ACTIVE_TAB,
  notifications: [],
  badgeCounts: { ops: 0, brain: 0, labs: 0 },
  setActiveModule: () => {},
  setActiveTab: () => {},
  setActiveTabs: () => {},
  openTab: () => {},
  addNotification: () => {},
  clearNotification: () => {},
  clearModuleNotifications: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModuleState] = useState<ModuleId>('ops');
  const [activeTabs, setActiveTabsState] = useState<Record<ModuleId, string[]>>(DEFAULT_TABS);
  const [activeTab, setActiveTabState] = useState<Record<ModuleId, string>>(DEFAULT_ACTIVE_TAB);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const badgeCounts = Object.keys(notifications.reduce((acc, n) => {
    acc[n.moduleId] = (acc[n.moduleId] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>)).reduce((acc, key) => {
    acc[key as ModuleId] = notifications.filter(n => n.moduleId === key).length;
    return acc;
  }, { ops: 0, brain: 0, labs: 0 } as Record<ModuleId, number>);

  const setActiveModule = useCallback((module: ModuleId) => {
    setActiveModuleState(module);
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(prev => ({ ...prev, [activeModule]: tab }));
  }, [activeModule]);

  const setActiveTabs = useCallback((tabs: string[]) => {
    setActiveTabsState(prev => ({ ...prev, [activeModule]: tabs }));
  }, [activeModule]);

  const openTab = useCallback((moduleId: ModuleId, tabName: string) => {
    setActiveTabsState(prev => {
      const existing = prev[moduleId];
      if (!existing.includes(tabName)) {
        return { ...prev, [moduleId]: [...existing, tabName] };
      }
      return prev;
    });
    setActiveTabState(prev => ({ ...prev, [moduleId]: tabName }));
    setActiveModuleState(moduleId);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setNotifications(prev => [...prev, { ...notification, id, timestamp: new Date() }]);
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearModuleNotifications = useCallback((moduleId: ModuleId) => {
    setNotifications(prev => prev.filter(n => n.moduleId !== moduleId));
  }, []);

  return (
    <AppContext.Provider value={{
      activeModule,
      activeTabs,
      activeTab,
      notifications,
      badgeCounts,
      setActiveModule,
      setActiveTab,
      setActiveTabs,
      openTab,
      addNotification,
      clearNotification,
      clearModuleNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

// Convenience: returns the module color for a given moduleId
export function MODULE_COLOR(moduleId: ModuleId): ModuleColor {
  switch (moduleId) {
    case 'ops':   return 'yellow';
    case 'brain': return 'blue';
    case 'labs':  return 'emerald';
  }
}
