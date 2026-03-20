'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Timer, CheckCircle, AlertCircle, Ban, Zap, RotateCcw, Server, Bot, ArrowRight } from 'lucide-react';
import type { CronJob } from '@/contexts/crons-context';

interface CronDrawerProps {
  job: CronJob | null;
  onClose: () => void;
}

function formatDate(ms: number | null): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(ms: number | null): string {
  if (!ms) return '—';
  if (ms < 1000)  return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function StatusBadge({ status }: { status: CronJob['status'] }) {
  const config = {
    ok:       { icon: <CheckCircle className="w-4 h-4" />, label: 'OK',       cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40' },
    error:    { icon: <AlertCircle className="w-4 h-4" />, label: 'Error',    cls: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40' },
    running:  { icon: <Zap         className="w-4 h-4 animate-pulse" />, label: 'Running', cls: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800/40' },
    disabled: { icon: <Ban         className="w-4 h-4" />, label: 'Disabled', cls: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/40' },
  }[status];
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.cls}`}>
      {config.icon} {config.label}
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/10 dark:border-slate-700/30 last:border-0">
      <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <div className="text-sm text-slate-800 dark:text-slate-200">{value}</div>
      </div>
    </div>
  );
}

export function CronDrawer({ job, onClose }: CronDrawerProps) {
  return (
    <AnimatePresence>
      {job && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md
                       bg-white/60 dark:bg-slate-900/60
                       backdrop-blur-xl
                       border-l border-white/40 dark:border-slate-700/40
                       flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/20 dark:border-slate-700/30">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {job.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{job.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                           hover:bg-white/40 dark:hover:bg-slate-700/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status */}
            <div className="px-6 py-4 border-b border-white/20 dark:border-slate-700/30">
              <StatusBadge status={job.status} />
              {job.consecutiveErrors > 0 && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                  {job.consecutiveErrors} consecutive error{job.consecutiveErrors > 1 ? 's' : ''}
                </p>
              )}
              {/* Error message */}
              {job.lastError && (
                <div className="mt-3 p-3 rounded-lg bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-0.5 uppercase tracking-wide">Last Error</p>
                      <p className="text-sm text-red-700 dark:text-red-300 font-mono break-words">{job.lastError}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Schedule"
                value={
                  <div>
                    <p>{job.schedule}</p>
                    {job.scheduleRaw && (
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{job.scheduleRaw}</p>
                    )}
                    {job.tz && (
                      <p className="text-xs text-slate-400 mt-0.5">{job.tz}</p>
                    )}
                  </div>
                }
              />

              <DetailRow
                icon={<RotateCcw className="w-4 h-4" />}
                label="Last Run"
                value={
                  <div>
                    <p>{formatDate(job.lastRunAt)}</p>
                    {job.lastDurationMs !== null && (
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Timer className="w-3 h-3" /> Completed in {formatDuration(job.lastDurationMs)}
                      </p>
                    )}
                    {job.lastRunStatus && (
                      <p className={`text-xs mt-0.5 font-medium ${
                        job.lastRunStatus === 'ok' ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        Result: {job.lastRunStatus.toUpperCase()}
                      </p>
                    )}
                  </div>
                }
              />

              <DetailRow
                icon={<Clock className="w-4 h-4" />}
                label="Next Run"
                value={job.enabled ? formatDate(job.nextRunAt) : 'Disabled — will not run'}
              />

              <DetailRow
                icon={<Bot className="w-4 h-4" />}
                label="Agent"
                value={job.agentId ?? '—'}
              />

              <DetailRow
                icon={<Server className="w-4 h-4" />}
                label="Session Target"
                value={job.sessionTarget ?? '—'}
              />

              <DetailRow
                icon={<ArrowRight className="w-4 h-4" />}
                label="Payload Type"
                value={job.payloadKind ?? '—'}
              />

              <DetailRow
                icon={<CheckCircle className="w-4 h-4" />}
                label="Delivery"
                value={
                  <span className={
                    job.lastDeliveryStatus === 'delivered' ? 'text-emerald-500' :
                    job.lastDeliveryStatus === 'not-delivered' ? 'text-slate-400' :
                    'text-slate-400'
                  }>
                    {job.lastDeliveryStatus ?? '—'}
                  </span>
                }
              />

              <DetailRow
                icon={<Zap className="w-4 h-4" />}
                label="Enabled"
                value={
                  <span className={job.enabled ? 'text-emerald-500' : 'text-slate-400'}>
                    {job.enabled ? 'Yes' : 'No'}
                  </span>
                }
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
