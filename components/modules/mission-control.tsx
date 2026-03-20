'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAgents, type AgentData } from '@/contexts/agents-context';
import { Activity, Clock, AlertCircle, MoonStar, Play, Square } from 'lucide-react';
import { CronJobsSection } from './cron-jobs-section';
import { ModuleIcon } from '@/components/icons/module-icon';
import { AgentSessionModal } from '@/components/ui/agent-session-modal';

interface MissionControlProps {
  moduleId?: 'ops' | 'brain' | 'labs';
  moduleColor?: 'yellow' | 'blue' | 'emerald';
}

export function MissionControl({ moduleId = 'ops', moduleColor = 'yellow' }: MissionControlProps) {
  const { agents, loading, error } = useAgents();
  const [mounted, setMounted] = useState(false);

  // Only show active or idle agents — sleeping agents fall off the board
  const visibleAgents = agents.filter(a => a.status === 'active' || a.status === 'idle');
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = (status: AgentData['status']) => {
    switch (status) {
      case 'active':
        return 'from-yellow-400 to-yellow-600';
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

  const getStatusIcon = (status: AgentData['status']) => {
    switch (status) {
      case 'active':   return <Activity  className="w-3 h-3 text-emerald-500" />;
      case 'idle':     return <Clock     className="w-3 h-3 text-blue-400" />;
      case 'error':    return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'sleeping': return <MoonStar  className="w-3 h-3 text-slate-400" />;
      default:         return <Clock     className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: AgentData['status']) => {
    switch (status) {
      case 'active':   return 'Active';
      case 'idle':     return 'Idle';
      case 'error':    return 'Error';
      case 'sleeping': return 'Sleeping';
      default:         return 'Unknown';
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3">
          <ModuleIcon module={moduleId} color={moduleColor} className="w-8 h-8" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Mission Control
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-1 ml-11">
          Real-time command and control center for all agents
        </p>
      </motion.div>

      {/* Loading state */}
      {loading && mounted && (
        <motion.div
          className="flex items-center justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-yellow-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Connecting to gateway...</p>
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {error && mounted && (
        <motion.div
          className="flex items-center justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center p-6 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 max-w-md">
            <p className="text-red-700 dark:text-red-400 font-semibold mb-2">Connection Error</p>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-3">
              Make sure OpenClaw gateway is running and accessible
            </p>
          </div>
        </motion.div>
      )}

      {/* Active Agents section */}
      {!loading && !error && mounted && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Subheader */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
              Active Agents
            </h2>
            <div className="h-px bg-gradient-to-r from-yellow-400/60 via-slate-200 to-transparent dark:from-yellow-500/40 dark:via-slate-700 dark:to-transparent" />
          </div>

          {/* Empty state — all agents sleeping */}
          {visibleAgents.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                No active agents — all agents are sleeping
              </p>
            </div>
          )}

          {/* Agent cards grid */}
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 25%))' }}>
          {visibleAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => setSelectedAgent(agent)}
            className="glass-card p-6 self-start transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/40 cursor-pointer"
          >
            {/* Header with name and status */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {agent.name}
                </h2>
              </div>
              {/* Status indicator */}
              <div
                className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${getStatusColor(agent.status)} shadow-lg`}
              >
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  {agent.status === 'active'
                    ? <Play  className="w-3.5 h-3.5 text-white fill-white" />
                    : <Square className="w-3 h-3 text-white fill-white" />}
                </div>
                {agent.status === 'active' && (
                  <span className="absolute inset-0 rounded-full border-2 border-yellow-300 dark:border-yellow-400 animate-ping" />
                )}
              </div>
            </div>

            {/* Status badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
              {getStatusIcon(agent.status)}
              {getStatusLabel(agent.status)}
            </div>

            {/* Model Info with Token Count */}
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mb-1">
                    Model
                  </p>
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                    {agent.model}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mb-1">
                    Tokens
                  </p>
                  <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                    {agent.tokenCount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Provider and Context Window */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-yellow-200 dark:border-yellow-900/50">
                <div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    Provider
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {agent.provider || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    Context Window
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {agent.contextWindow
                      ? agent.contextWindow >= 1000000
                        ? `${(agent.contextWindow / 1000000).toFixed(1)}M`
                        : `${(agent.contextWindow / 1000).toFixed(0)}K`
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          ))}
          </div>
        </motion.div>
      )}

      {/* Cron Jobs section */}
      {mounted && <CronJobsSection moduleColor={moduleColor} />}

      {/* Agent session modal */}
      <AgentSessionModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />

      {/* Empty state */}
      {!loading && !error && agents.length === 0 && mounted && (
        <motion.div
          className="flex items-center justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No agents available</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
              Check that the gateway is running
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
