'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabSelect: (tab: string) => void;
  onReorder: (tabs: string[]) => void;
  moduleColor?: 'yellow' | 'blue' | 'emerald';
}

const getColorClasses = (color?: string) => {
  switch (color) {
    case 'yellow':
      return {
        text: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        gradient: 'from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-400',
      };
    case 'blue':
      return {
        text: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        gradient: 'from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400',
      };
    case 'emerald':
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        gradient: 'from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-400',
      };
    default:
      return {
        text: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        gradient: 'from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400',
      };
  }
};

export function TabBar({
  tabs,
  activeTab,
  onTabSelect,
  onReorder,
  moduleColor = 'blue',
}: TabBarProps) {
  const [mounted, setMounted] = useState(false);
  const [localTabs, setLocalTabs] = useState(tabs);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalTabs(tabs);
  }, [tabs]);

  const handleReorder = (newTabs: string[]) => {
    setLocalTabs(newTabs);
    onReorder(newTabs);
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Reorder.Group axis="x" values={localTabs} onReorder={handleReorder} as="div" className="flex gap-2">
        <AnimatePresence>
          {localTabs.map((tab) => (
            <Reorder.Item key={tab} value={tab} as="div">
              <motion.button
                onClick={() => onTabSelect(tab)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-grab active:cursor-grabbing transition-colors duration-150 ${
                  activeTab === tab
                    ? `${getColorClasses(moduleColor).text} ${getColorClasses(moduleColor).bg} shadow-sm`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {tab}
                {/* Underline slides via layoutId — single animated element, always consistent */}
                {activeTab === tab && (
                  <motion.div
                    layoutId={`tab-underline-${moduleColor}`}
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getColorClasses(moduleColor).gradient} rounded-full`}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </motion.button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
