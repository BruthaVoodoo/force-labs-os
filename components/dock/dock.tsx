'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleIcon } from '@/components/icons/module-icon';
import { useApp } from '@/contexts/app-context';
import type { ModuleId } from '@/contexts/app-context';

interface DockProps {
  activeModule: 'ops' | 'brain' | 'labs';
  onModuleSelect: (module: 'ops' | 'brain' | 'labs') => void;
}

const MODULES = [
  {
    id: 'ops',
    label: 'Operations',
    description: 'Agent control & monitoring',
    color: 'from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700',
  },
  {
    id: 'brain',
    label: 'Brain',
    description: 'Knowledge & learning',
    color: 'from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700',
  },
  {
    id: 'labs',
    label: 'Labs',
    description: 'Experimental features',
    color: 'from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700',
  },
];

export function Dock({ activeModule, onModuleSelect }: DockProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const { badgeCounts, clearModuleNotifications } = useApp();

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleModuleSelect(moduleId: ModuleId) {
    clearModuleNotifications(moduleId);
    onModuleSelect(moduleId);
  }

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-end justify-center pb-6 pointer-events-none">
      {/* Dock background blur effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 dark:from-slate-950/40 to-transparent pointer-events-none" />

      {/* Dock container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-40 pointer-events-auto"
      >
        <div className="glass-effect rounded-2xl px-2 pt-3 pb-2 flex gap-4">
          {MODULES.map((module) => (
            <div key={module.id} className="relative flex flex-col items-center">
              <motion.button
                onClick={() => handleModuleSelect(module.id as ModuleId)}
                onHoverStart={() => setHoveredModule(module.id)}
                onHoverEnd={() => setHoveredModule(null)}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                  activeModule === module.id
                    ? `bg-gradient-to-br ${module.color}`
                    : 'bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-slate-700/50'
                }`}
              >
                {/* Icon */}
                <div className={`transition-transform duration-200 ${
                  hoveredModule === module.id ? 'scale-110' : 'scale-100'
                }`}>
                  <ModuleIcon 
                    module={module.id as 'ops' | 'brain' | 'labs'} 
                    className="w-8 h-8"
                  />
                </div>

                {/* Badge dot */}
                <AnimatePresence>
                  {badgeCounts[module.id as ModuleId] > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"
                      aria-label={`${badgeCounts[module.id as ModuleId]} notification${badgeCounts[module.id as ModuleId] !== 1 ? 's' : ''}`}
                    />
                  )}
                </AnimatePresence>

                {/* Label and description tooltip on hover */}
                {hoveredModule === module.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full mb-2 px-2 py-1.5 bg-slate-900 dark:bg-slate-950 text-white text-xs rounded-md whitespace-nowrap shadow-lg"
                  >
                    <p className="font-semibold text-xs">{module.label}</p>
                    <p className="text-slate-300 text-xs">{module.description}</p>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-l-transparent border-r-transparent border-t-slate-900 dark:border-t-slate-950" />
                  </motion.div>
                )}
              </motion.button>

              {/* Active indicator bar - positioned outside button */}
              <motion.div
                animate={{ opacity: activeModule === module.id ? 1 : 0, scale: activeModule === module.id ? 1 : 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`mt-2 w-6 h-1.5 bg-gradient-to-r ${module.color} rounded-full ${
                  activeModule === module.id ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
