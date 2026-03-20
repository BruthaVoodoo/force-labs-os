'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error' | 'sleeping';
  lastActivity: string;
  uptime: string;
  tasksCompleted: number;
  cpuUsage: number;
  memoryUsage: number;
  model?: string;
}

const MOCK_AGENTS: Agent[] = [
  {
    id: 'revan',
    name: 'Revan',
    status: 'active',
    lastActivity: 'Processing memory search',
    uptime: '6h 42m',
    tasksCompleted: 47,
    cpuUsage: 12,
    memoryUsage: 256,
    model: 'Claude Haiku 4.5',
  },
  {
    id: 'bastila',
    name: 'Bastila',
    status: 'idle',
    lastActivity: 'Waiting for task',
    uptime: '3h 15m',
    tasksCompleted: 12,
    cpuUsage: 2,
    memoryUsage: 128,
    model: 'Claude Haiku 4.5',
  },
];

export function AgentStatus() {
  const [agents] = useState<Agent[]>(MOCK_AGENTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // In a real app, this would poll the agent status from an API
  }, []);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'from-emerald-400 to-emerald-600';
      case 'idle':
        return 'from-blue-400 to-blue-600';
      case 'error':
        return 'from-red-400 to-red-600';
      case 'sleeping':
        return 'from-slate-400 to-slate-600';
      default:
        return 'from-slate-400 to-slate-600';
    }
  };

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return '🟢 Active';
      case 'idle':
        return '🔵 Idle';
      case 'error':
        return '🔴 Error';
      case 'sleeping':
        return '⚫ Sleeping';
      default:
        return 'Unknown';
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Agent Status
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Real-time monitoring of active agents
        </p>
      </motion.div>

      {/* Agents Grid */}
      <motion.div
        className="flex-1 overflow-y-auto grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pr-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="neuro-surface rounded-2xl p-5 hover:shadow-neuro-lg dark:hover:shadow-neuro-dark-lg transition-shadow duration-300 group cursor-pointer"
          >
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {agent.id.charAt(0).toUpperCase() + agent.id.slice(1)}
                </p>
              </div>
              {/* Status indicator */}
              <motion.div
                className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${
                  agent.status === 'active' 
                    ? 'from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700'
                    : getStatusColor(agent.status)
                } shadow-lg`}
                animate={{
                  scale: agent.status === 'active' ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: agent.status === 'active' ? Infinity : 0,
                }}
              >
                <div className="absolute inset-0 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {agent.status === 'active' ? '▶' : '■'}
                </div>
                {agent.status === 'active' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-yellow-300 dark:border-yellow-400"
                    animate={{ scale: [1, 1.2], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </div>

            {/* Status Badge */}
            <div className="mb-4 inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
              {getStatusLabel(agent.status)}
            </div>

            {/* Activity */}
            <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/30">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                Last Activity
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
                {agent.lastActivity}
              </p>
            </div>

            {/* Model Info */}
            {agent.model && (
              <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {agent.model}
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Uptime */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/30">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                  Uptime
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {agent.uptime}
                </p>
              </div>

              {/* Tasks Completed */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/30">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                  Tasks
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {agent.tasksCompleted}
                </p>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="space-y-2">
              {/* CPU */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    CPU
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    {agent.cpuUsage}%
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.cpuUsage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Memory */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Memory
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    {agent.memoryUsage}MB
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((agent.memoryUsage / 512) * 100, 100)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
