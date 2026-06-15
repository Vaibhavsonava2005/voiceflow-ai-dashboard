import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({ children, className = '', hover = false, glow = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-3xl 
        bg-slate-900/[0.03] dark:bg-white/[0.03] 
        backdrop-blur-2xl 
        border border-slate-900/[0.08] dark:border-white/[0.08] 
        shadow-2xl
        ${glow ? 'shadow-purple-500/10' : ''}
        ${hover ? 'transition-all duration-300 hover:bg-slate-900/[0.06] dark:hover:bg-white/[0.06] hover:border-purple-500/30 hover:shadow-purple-500/20' : ''}
        ${className}
      `}
      {...props}
    >
      {glow && (
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-600/20 via-transparent to-violet-600/20 -z-10 blur-md" />
      )}
      {children}
    </motion.div>
  );
}
