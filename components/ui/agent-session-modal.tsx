'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, User, Hash, Cpu, Radio, Coins, Wrench, RefreshCw } from 'lucide-react';
import type { AgentData } from '@/contexts/agents-context';

interface SessionMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  hasToolCalls: boolean;
  usage: { totalTokens?: number } | null;
  timestamp: string | null;
}

interface SessionData {
  sessionKey: string;
  model: string | null;
  channel: string | null;
  updatedAt: number | null;
  compactionCount: number;
  messages: SessionMessage[];
}

interface AgentSessionModalProps {
  agent: AgentData | null;
  onClose: () => void;
}

function formatTime(ts: string | number | null): string {
  if (!ts) return '—';
  const d = new Date(typeof ts === 'string' ? ts : ts);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function AgentSessionModal({ agent, onClose }: AgentSessionModalProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!agent) return;
    setLoading(true);
    setError(null);
    setSession(null);

    fetch(`/api/agents/session?agentId=${agent.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setSession(data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [agent]);

  // Scroll to bottom when messages load
  useEffect(() => {
    if (session?.messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session]);

  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed inset-4 md:inset-12 lg:inset-20 z-50 flex flex-col
                       bg-white/60 dark:bg-slate-900/65
                       backdrop-blur-xl
                       border border-white/40 dark:border-slate-700/40
                       rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 dark:border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
                }`} />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {agent.name}
                </h2>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  Session
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
                           hover:bg-white/40 dark:hover:bg-slate-700/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session meta strip */}
            {session && (
              <div className="flex flex-wrap items-center gap-6 px-6 py-3 border-b border-white/20 dark:border-slate-700/30 bg-white/20 dark:bg-slate-800/20">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{session.sessionKey}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">{session.model ?? 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">{session.channel ?? 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-slate-600 dark:text-slate-300">{agent.tokenCount.toLocaleString()} tokens</span>
                </div>
                {session.compactionCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500">{session.compactionCount} compaction{session.compactionCount > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <RefreshCw className="w-5 h-5 text-slate-400 animate-spin mr-2" />
                  <span className="text-slate-400 text-sm">Loading session history...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-16 text-red-400 text-sm">{error}</div>
              )}

              {!loading && !error && session?.messages.length === 0 && (
                <div className="text-center py-16 text-slate-400 text-sm">No messages in this session yet</div>
              )}

              {!loading && session?.messages.map((msg, i) => (
                <motion.div
                  key={msg.id ?? i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.4) }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-blue-100 dark:bg-blue-900/40'
                      : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-blue-500" />
                      : <Bot className="w-3.5 h-3.5 text-yellow-500" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300 rounded-tr-sm'
                      : 'bg-white/60 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/30 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                  }`}>
                    {msg.hasToolCalls && !msg.text && (
                      <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 italic text-xs">
                        <Wrench className="w-3 h-3" /> Tool calls executed
                      </span>
                    )}
                    {msg.hasToolCalls && msg.text && (
                      <div className="mb-1.5 flex items-center gap-1 text-xs text-slate-400">
                        <Wrench className="w-3 h-3" /> includes tool calls
                      </div>
                    )}
                    {msg.text && (
                      <p className="whitespace-pre-wrap leading-relaxed line-clamp-6">{msg.text}</p>
                    )}
                    {msg.timestamp && (
                      <p className="text-xs text-slate-400 mt-1">{formatTime(msg.timestamp)}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
