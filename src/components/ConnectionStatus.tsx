import { motion } from 'framer-motion';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import type { ConnectionStatus as ConnectionStatusType } from '../hooks/useDeepgram';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

const statusConfig = {
  idle: { label: 'Ready', color: 'text-gray-400', bg: 'bg-gray-400', icon: WifiOff },
  connecting: { label: 'Connecting...', color: 'text-yellow-400', bg: 'bg-yellow-400', icon: Loader2 },
  connected: { label: 'Connected', color: 'text-emerald-400', bg: 'bg-emerald-400', icon: Wifi },
  disconnected: { label: 'Disconnected', color: 'text-gray-400', bg: 'bg-gray-400', icon: WifiOff },
  error: { label: 'Error', color: 'text-red-400', bg: 'bg-red-400', icon: WifiOff },
};

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      key={status}
    >
      <motion.div
        className={`w-2 h-2 rounded-full ${config.bg}`}
        animate={status === 'connected' ? { scale: [1, 1.3, 1] } : status === 'connecting' ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <Icon className={`w-3.5 h-3.5 ${config.color} ${status === 'connecting' ? 'animate-spin' : ''}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </motion.div>
  );
}
