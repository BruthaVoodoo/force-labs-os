'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCrons, type CronJob } from '@/contexts/crons-context';
import { CheckCircle, AlertCircle, Clock, Ban, Calendar, Timer, RotateCcw, Zap } from 'lucide-react';
import { CronDrawer } from '@/components/ui/cron-drawer';

function formatRelativeTime(ms: number | null): string {
  if (!ms) return '—';
  const diff = Date.now() - ms;
  const abs = Math.abs(diff);
  const future = diff < 0;
  if (abs < 60000)     return future ? 'in <1m'   : '<1m ago';
  if (abs < 3600000)   return future ? `in ${Math.round(abs / 60000)}m`  : `${Math.round(abs / 60000)}m ago`;
  if (abs < 86400000)  return future ? `in ${Math.round(abs / 3600000)}h`  : `${Math.round(abs / 3600000)}h ago`;
  return future ? `in ${Math.round(abs / 86400000)}d` : `${Math.round(abs / 86400000)}d ago`;
}

function formatDuration(ms: number | null): string {
  if (!ms) return '—';
  if (ms < 1000)  return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function StatusIcon({ status }: { status: CronJob['status'] }) {
  switch (status) {
    case 'ok':       return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'error':    return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'running':  return <Zap         className="w-4 h-4 text-yellow-500 animate-pulse" />;
    case 'disabled': return <Ban         className="w-4 h-4 text-slate-400" />;
  }
}

function StatusLabel({ status }: { status: CronJob['status'] }) {
  const map = { ok: 'OK', error: 'Error', running: 'Running', disabled: 'Disabled' };
  return <span>{map[status]}</span>;
}

function StatusColors(status: CronJob['status']): string {
  switch (status) {
    case 'ok':       return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';
    case 'error':    return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/40';
    case 'running':  return 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/40';
    case 'disabled': return 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/40';
  }
}

type ModuleColor = 'yellow' | 'blue' | 'emerald';

const HEADER_STYLES: Record<ModuleColor, string> = {
  yellow:  'bg-yellow-400/30 dark:bg-yellow-500/20 backdrop-blur-md border-b border-yellow-300/40 dark:border-yellow-600/30',
  blue:    'bg-blue-400/30   dark:bg-blue-500/20   backdrop-blur-md border-b border-blue-300/40   dark:border-blue-600/30',
  emerald: 'bg-emerald-400/30 dark:bg-emerald-500/20 backdrop-blur-md border-b border-emerald-300/40 dark:border-emerald-600/30',
};

interface CronJobsSectionProps {
  moduleColor?: ModuleColor;
}

export function CronJobsSection({ moduleColor = 'yellow' }: CronJobsSectionProps) {
  const { jobs, loading } = useCrons();
  const [selectedJob, setSelectedJob] = useState<CronJob | null>(null);

  return (
    <>
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      {/* Subheader */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          Cron Jobs
        </h2>
        <div className="h-px bg-gradient-to-r from-blue-400/60 via-slate-200 to-transparent dark:from-blue-500/40 dark:via-slate-700 dark:to-transparent" />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm py-4">
          <RotateCcw className="w-4 h-4 animate-spin" />
          Loading cron jobs...
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <p className="text-slate-400 dark:text-slate-500 text-sm py-4">No cron jobs configured</p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="glass-card overflow-hidden w-full">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className={HEADER_STYLES[moduleColor]}>
                {['Name','Schedule','Last Run','Status','Next Run'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold uppercase tracking-wider text-white/90 px-5 py-3 first:pl-5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedJob(job)}
                  className={`cursor-pointer transition-colors duration-150 ${
                    index < jobs.length - 1
                      ? 'border-b border-slate-100 dark:border-slate-800/60'
                      : ''
                  } ${
                    job.status === 'error'
                      ? 'bg-red-50/60 dark:bg-red-950/20 backdrop-blur-sm hover:bg-red-100/60 dark:hover:bg-red-950/30 border-b border-red-200/40 dark:border-red-900/30'
                      : 'hover:bg-white/40 dark:hover:bg-slate-800/30'
                  }`}
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {job.name}
                    </p>
                    {job.lastDurationMs !== null && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Timer className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-400">{formatDuration(job.lastDurationMs)}</span>
                      </div>
                    )}
                  </td>

                  {/* Schedule */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate">
                        {job.schedule}
                      </span>
                    </div>
                    {job.tz && (
                      <span className="text-xs text-slate-400 ml-5">
                        {job.tz.split('/')[1] || job.tz}
                      </span>
                    )}
                  </td>

                  {/* Last Run */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {formatRelativeTime(job.lastRunAt)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${StatusColors(job.status)}`}>
                      <StatusIcon status={job.status} />
                      <StatusLabel status={job.status} />
                    </div>
                  </td>

                  {/* Next Run */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {job.enabled ? formatRelativeTime(job.nextRunAt) : '—'}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>

    <CronDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </>
  );
}
