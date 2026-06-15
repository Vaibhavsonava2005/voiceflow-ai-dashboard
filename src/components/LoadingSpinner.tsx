import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
}

export default function LoadingSpinner({ fullScreen = false, size = 48 }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="rounded-full border-4 border-purple-500/20 border-t-purple-500"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        className="text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0a1a]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
