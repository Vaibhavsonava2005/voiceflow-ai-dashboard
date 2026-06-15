import { motion, AnimatePresence } from 'framer-motion';
import { Clock, FileText, Trash2 } from 'lucide-react';
import { useTranscript } from '../context/TranscriptContext';

export default function TranscriptHistory() {
  const { history, clearHistory } = useTranscript();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mb-2 text-gray-600" />
        <p className="text-sm font-medium">No history yet</p>
        <p className="text-xs text-gray-600 mt-1">Completed sessions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          Session History ({history.length})
        </h3>
        <motion.button
          onClick={clearHistory}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </motion.button>
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
            >
              <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {entry.text}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span>{entry.timestamp.toLocaleTimeString()}</span>
                <span>•</span>
                <span>{entry.wordCount} words</span>
                <span>•</span>
                <span>{Math.floor(entry.duration / 60)}:{String(entry.duration % 60).padStart(2, '0')}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
