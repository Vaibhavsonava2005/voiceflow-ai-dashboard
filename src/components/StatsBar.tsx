import { Hash, Type, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsBarProps {
  wordCount: number;
  charCount: number;
  duration: string;
}

export default function StatsBar({ wordCount, charCount, duration }: StatsBarProps) {
  const stats = [
    { icon: Hash, label: 'Words', value: wordCount.toLocaleString() },
    { icon: Type, label: 'Characters', value: charCount.toLocaleString() },
    { icon: Clock, label: 'Duration', value: duration },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <stat.icon className="w-4 h-4 text-purple-400" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">{stat.label}</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{stat.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
