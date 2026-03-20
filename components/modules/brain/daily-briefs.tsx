'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ModuleIcon } from '@/components/icons/module-icon';

interface Brief {
  id: string;
  date: string;
  title: string;
  content: string;
}

const DUMMY_BRIEFS: Brief[] = [
  {
    id: 'brief-1',
    date: 'March 20, 2026',
    title: 'All systems nominal',
    content: `# Daily Brief — March 20, 2026

## Executive Summary
All systems nominal. Three agents active, two in idle state. No critical incidents in the last 24 hours.

## Security
- Credential rotation completed at 07:50 EDT
- All three rotated credentials verified and active
- Git history cleanup pending (scheduled this week)

## Agent Activity
- **Revan** (main): Active, processing Force Labs build session
- **Bastila** (isolated): Idle since 09:00 EDT

## Upcoming
- Force Labs Brain module development begins today
- Daily brief cron job to be configured
- Memory optimizer scheduled for nightly run

## Notes
No anomalies detected. Mission continues on schedule.`,
  },
  {
    id: 'brief-2',
    date: 'March 19, 2026',
    title: 'Cron delivery standardized',
    content: `# Daily Brief — March 19, 2026

## Executive Summary
Cron delivery pattern standardized across all scheduled jobs. Memory optimizer updated with new safety gates.

## Completed
- scripts/cron-deliver-telegram.sh utility created
- Memory optimizer gates tuned (skip if delta < 10 tokens)
- Security review cron updated with delivery pattern

## Agent Activity
- **Revan** (main): Productive session, multiple system improvements
- **Bastila** (isolated): Not active today

## Notes
Cron delivery pattern is now the standard for all future jobs.`,
  },
  {
    id: 'brief-3',
    date: 'March 18, 2026',
    title: 'Memory optimizer gates added',
    content: `# Daily Brief — March 18, 2026

## Executive Summary
Memory optimizer safety gates added. QMD memory backend confirmed operational.

## Completed
- Memory optimizer updated with 3-gate safety system
- QMD BM25 + vector hybrid search confirmed working
- Daily memory audit cron configured

## Notes
System memory now has dual redundancy (QMD + SQLite).`,
  },
];

export function DailyBriefs() {
  const [selectedBrief, setSelectedBrief] = useState<Brief>(DUMMY_BRIEFS[0]);

  return (
    <motion.div
      className="flex flex-col gap-6 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3">
          <ModuleIcon module="brain" color="blue" className="w-8 h-8" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Daily Briefs
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-1 ml-11">
          Intelligence reports and situational awareness
        </p>
        <hr className="mt-4 border-slate-200 dark:border-slate-700/60" />
      </motion.div>

      {/* Two-panel layout: Sidebar + Content */}
      <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar - Brief list */}
        <motion.div
          className="w-72 flex-shrink-0 overflow-y-auto pr-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="space-y-3">
            {DUMMY_BRIEFS.map((brief, index) => (
              <motion.button
                key={brief.id}
                onClick={() => setSelectedBrief(brief)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`
                  w-full text-left p-4 rounded-lg transition-all duration-200
                  backdrop-blur-md border
                  ${
                    selectedBrief.id === brief.id
                      ? 'bg-blue-500/10 dark:bg-blue-500/10 border-l-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'glass-card hover:bg-white/80 dark:hover:bg-slate-700/60'
                  }
                `}
              >
                <div className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                  {brief.date}
                </div>
                <div className={`text-xs line-clamp-2 ${
                  selectedBrief.id === brief.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {brief.title}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right Content Area - Markdown renderer */}
        <motion.div
          className="flex-1 min-w-0 overflow-y-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          key={selectedBrief.id}
        >
          <div className="glass-card p-6 h-fit">
            <div className="prose dark:prose-invert max-w-none text-slate-900 dark:text-slate-100">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-6 first:mt-0" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 mt-4" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-2" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm font-mono text-slate-800 dark:text-slate-200" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="border-slate-200 dark:border-slate-700/60 my-4" {...props} />
                  ),
                }}
              >
                {selectedBrief.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
