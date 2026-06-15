import { motion, AnimatePresence } from 'framer-motion';
import { Clock, FileText, Trash2 } from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';

export default function TranscriptHistory() {
  const { history, clearHistory } = useTranscript();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--text-secondary)]">
        <Clock className="w-10 h-10 mb-4 opacity-20" />
        <p className="text-sm font-medium">No history yet</p>
        <p className="text-xs mt-1">Completed sessions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {history.length} {history.length === 1 ? 'Session' : 'Sessions'}
        </span>
        <button
          onClick={clearHistory}
          className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 px-2 py-1 rounded bg-red-500/10"
          title="Clear all history"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[rgba(255,255,255,0.15)] transition-all cursor-pointer group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] font-medium">
                  <FileText className="w-3 h-3" />
                  {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              <p className="text-sm text-[var(--text-primary)] line-clamp-3 leading-relaxed mb-3">
                {entry.text}
              </p>
              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {entry.wordCount} words
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {Math.floor(entry.duration / 60)}:{String(entry.duration % 60).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
