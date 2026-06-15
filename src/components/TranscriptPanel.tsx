import { motion } from 'framer-motion';
import { useTranscript } from '../context/TranscriptContext';

export default function TranscriptPanel() {
  const { currentTranscript, interimText } = useTranscript();

  const hasContent = currentTranscript.trim() || interimText.trim();

  return (
    <div className="relative min-h-[200px] max-h-[400px] overflow-y-auto rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 scroll-smooth">
      {!hasContent ? (
        <motion.div
          className="flex flex-col items-center justify-center h-[180px] text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <p className="text-sm font-medium">No transcript yet</p>
          <p className="text-xs text-gray-600 mt-1">Click "Start Listening" to begin</p>
        </motion.div>
      ) : (
        <div className="space-y-1">
          {/* Final transcript */}
          {currentTranscript && (
            <motion.span
              className="text-gray-200 leading-relaxed text-[15px]"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
            >
              {currentTranscript}
            </motion.span>
          )}

          {/* Interim text - shown as lighter/italic */}
          {interimText && (
            <motion.span
              className="text-purple-400/70 italic text-[15px] ml-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {interimText}
            </motion.span>
          )}

          {/* Typing cursor */}
          {interimText && (
            <motion.span
              className="inline-block w-0.5 h-5 bg-purple-400 ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>
      )}
    </div>
  );
}
