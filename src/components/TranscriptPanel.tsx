import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranscript } from '../context/TranscriptContext';

export default function TranscriptPanel() {
  const { currentTranscript, interimText } = useTranscript();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom smoothly
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentTranscript, interimText]);

  return (
    <div className="h-full font-sans text-[1.05rem] leading-[1.8] tracking-wide">
      <div className="whitespace-pre-wrap text-[var(--text-primary)]">
        {currentTranscript}
      </div>
      
      <AnimatePresence>
        {interimText && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="inline text-[var(--text-secondary)] italic mt-2"
          >
            {interimText}
            <span className="inline-flex ml-1">
              <span className="animate-bounce mx-0.5">.</span>
              <span className="animate-bounce mx-0.5" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce mx-0.5" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
