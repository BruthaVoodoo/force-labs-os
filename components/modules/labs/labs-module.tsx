'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useLabs, type LabsCard } from '@/contexts/labs-context';
import { ModuleIcon } from '@/components/icons/module-icon';
import {
  Eye,
  Lightbulb,
  Briefcase,
  X,
  Check,
  Trash2,
  RotateCcw,
} from 'lucide-react';

export function LabsModule() {
  const { cards, acceptIdea, dismissIdea, restoreIdea } = useLabs();
  const [selectedCard, setSelectedCard] = useState<LabsCard | null>(null);
  const [showDismissed, setShowDismissed] = useState(false);

  const clientCards = cards.filter(c => c.kind === 'client');
  const activeIdeas = cards.filter(c => c.kind === 'idea' && c.status !== 'dismissed');
  const dismissedIdeas = cards.filter(c => c.kind === 'idea' && c.status === 'dismissed');

  const getStatusColor = (status: LabsCard['status']) => {
    switch (status) {
      case 'draft':       return 'bg-slate-400/20 text-slate-600 dark:text-slate-300 border-slate-300/30 dark:border-slate-600/30';
      case 'queued':      return 'bg-blue-400/20 text-blue-600 dark:text-blue-300 border-blue-300/30 dark:border-blue-600/30';
      case 'in-progress': return 'bg-yellow-400/20 text-yellow-600 dark:text-yellow-300 border-yellow-300/30 dark:border-yellow-600/30';
      case 'done':        return 'bg-emerald-400/20 text-emerald-600 dark:text-emerald-300 border-emerald-300/30 dark:border-emerald-600/30';
      case 'dismissed':   return 'bg-slate-300/10 text-slate-500 dark:text-slate-500 border-slate-300/20 dark:border-slate-700/20';
      default:            return 'bg-slate-400/20 text-slate-600 dark:text-slate-300 border-slate-300/30 dark:border-slate-600/30';
    }
  };

  const getStatusLabel = (status: LabsCard['status']) => {
    switch (status) {
      case 'draft':       return 'Draft';
      case 'queued':      return 'Queued for overnight';
      case 'in-progress': return 'In Progress';
      case 'done':        return 'Done';
      case 'dismissed':   return 'Dismissed';
      default:            return status;
    }
  };

  const getKindIcon = (kind: LabsCard['kind']) => {
    return kind === 'client' ? (
      <Briefcase className="w-4 h-4" />
    ) : (
      <Lightbulb className="w-4 h-4" />
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3">
          <ModuleIcon module="labs" color="emerald" className="w-8 h-8" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            The Lab
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-1 ml-11">
          Feature sandbox and self-improvement pipeline
        </p>
        <hr className="mt-4 border-slate-200 dark:border-slate-700/60" />
      </motion.div>

      {/* Client Work Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Client Work</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientCards.map((card, index) => (
            <CardItem
              key={card.id}
              card={card}
              index={index}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              getKindIcon={getKindIcon}
              onSelect={setSelectedCard}
            />
          ))}
        </div>
      </motion.div>

      {/* Revan's Ideas Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revan's Ideas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeIdeas.map((card, index) => (
            <CardItem
              key={card.id}
              card={card}
              index={index}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              getKindIcon={getKindIcon}
              onSelect={setSelectedCard}
            />
          ))}
        </div>

        {/* Show Dismissed toggle */}
        {dismissedIdeas.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/60">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDismissed(!showDismissed)}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              {showDismissed ? '✕ Hide dismissed' : `+ Show dismissed (${dismissedIdeas.length})`}
            </motion.button>

            {showDismissed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {dismissedIdeas.map((card, index) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    index={index}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    getKindIcon={getKindIcon}
                    onSelect={setSelectedCard}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            onAccept={() => {
              if (selectedCard.kind === 'idea') acceptIdea(selectedCard.id);
              setSelectedCard(null);
            }}
            onDismiss={() => {
              if (selectedCard.kind === 'idea') dismissIdea(selectedCard.id);
              setSelectedCard(null);
            }}
            onRestore={() => {
              if (selectedCard.kind === 'idea') restoreIdea(selectedCard.id);
              setSelectedCard(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface CardItemProps {
  card: LabsCard;
  index: number;
  getStatusColor: (status: LabsCard['status']) => string;
  getStatusLabel: (status: LabsCard['status']) => string;
  getKindIcon: (kind: LabsCard['kind']) => React.ReactNode;
  onSelect: (card: LabsCard) => void;
}

function CardItem({
  card,
  index,
  getStatusColor,
  getStatusLabel,
  getKindIcon,
  onSelect,
}: CardItemProps) {
  const isDismissed = card.status === 'dismissed';

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onSelect(card)}
      className={`
        text-left p-5 rounded-xl border transition-all duration-200
        backdrop-blur-md
        ${
          isDismissed
            ? 'bg-slate-500/5 dark:bg-slate-800/10 border-slate-200/20 dark:border-slate-700/20 opacity-60 hover:opacity-80'
            : 'bg-white/60 dark:bg-slate-800/40 border-white/20 dark:border-slate-700/40 hover:bg-white/80 dark:hover:bg-slate-800/60'
        }
      `}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-slate-500 dark:text-slate-400 mt-1">
            {getKindIcon(card.kind)}
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">
              {card.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {card.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span
          className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
            ${getStatusColor(card.status)}
          `}
        >
          {getStatusLabel(card.status)}
        </span>
      </div>

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {card.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-xs bg-slate-100/50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer with action button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/30 dark:border-slate-700/30">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {card.kind === 'client' ? 'Client' : 'Idea'}
        </span>
        <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
      </div>
    </motion.button>
  );
}

interface CardModalProps {
  card: LabsCard;
  onClose: () => void;
  onAccept: () => void;
  onDismiss: () => void;
  onRestore: () => void;
}

function CardModal({ card, onClose, onAccept, onDismiss, onRestore }: CardModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[85vw] max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {card.kind === 'client' ? (
              <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Lightbulb className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {card.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{card.subtitle}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Markdown — 40% */}
          <div className="w-[40%] overflow-y-auto p-6 border-r border-slate-200 dark:border-slate-800">
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
                {card.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* Right: iframe — 60% */}
          <div className="w-[60%] overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-slate-400 dark:text-slate-600 text-sm">Loading preview...</div>
              </div>
            )}
            <iframe
              src={card.sandboxPath}
              title={card.title}
              className="w-full h-full border-none"
              sandbox="allow-same-origin allow-scripts"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex gap-2">
            {card.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {card.kind === 'idea' ? (
            <div className="flex gap-3">
              {card.status === 'dismissed' ? (
                /* Dismissed — show Restore only */
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRestore}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30 dark:hover:bg-blue-600/30 transition-colors font-medium text-sm border border-blue-200 dark:border-blue-800/50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore Idea
                </motion.button>
              ) : (
                /* Active — show Dismiss + Accept */
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDismiss}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Dismiss
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAccept}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30 dark:hover:bg-emerald-600/30 transition-colors font-medium text-sm border border-emerald-200 dark:border-emerald-800/50"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </motion.button>
                </>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium text-sm"
            >
              <X className="w-4 h-4" />
              Close
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
