import { Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpeakingTimerProps {
  formatted: string;
  isRunning: boolean;
}

export default function SpeakingTimer({ formatted, isRunning }: SpeakingTimerProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10">
      <Timer className={`w-3.5 h-3.5 ${isRunning ? 'text-purple-400' : 'text-slate-600 dark:text-gray-400'}`} />
      <span className={`text-sm font-mono font-medium ${isRunning ? 'text-purple-300' : 'text-slate-600 dark:text-gray-400'}`}>
        {formatted}
      </span>
      {isRunning && (
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-red-500"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
}
