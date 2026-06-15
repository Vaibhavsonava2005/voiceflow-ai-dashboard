import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mic, MicOff, Copy, Download, Trash2, User, Mail, Shield,
  Activity, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranscript } from '../context/TranscriptContext';
import { useDeepgram } from '../hooks/useDeepgram';
import { useTimer } from '../hooks/useTimer';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import TranscriptPanel from '../components/TranscriptPanel';
import TranscriptHistory from '../components/TranscriptHistory';
import ConnectionStatus from '../components/ConnectionStatus';
import SpeakingTimer from '../components/SpeakingTimer';
import StatsBar from '../components/StatsBar';

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentTranscript, wordCount, saveToHistory, clearCurrent } = useTranscript();
  const { isListening, connectionStatus, startListening, stopListening, error } = useDeepgram();
  const timer = useTimer();

  const charCount = currentTranscript.trim().length;

  // Sync timer with listening state
  useEffect(() => {
    if (isListening) {
      timer.start();
    } else {
      timer.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleStartListening = useCallback(async () => {
    timer.reset();
    await startListening();
  }, [startListening, timer]);

  const handleStopListening = useCallback(() => {
    stopListening();
    if (currentTranscript.trim()) {
      saveToHistory(timer.seconds);
    }
    timer.stop();
  }, [stopListening, currentTranscript, saveToHistory, timer]);

  const handleCopy = useCallback(() => {
    if (!currentTranscript.trim()) {
      toast.error('Nothing to copy');
      return;
    }
    navigator.clipboard.writeText(currentTranscript.trim());
    toast.success('Transcript copied to clipboard!');
  }, [currentTranscript]);

  const handleDownload = useCallback(() => {
    if (!currentTranscript.trim()) {
      toast.error('Nothing to download');
      return;
    }
    const blob = new Blob([currentTranscript.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voiceflow-transcript-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript downloaded!');
  }, [currentTranscript]);

  const handleClear = useCallback(() => {
    clearCurrent();
    timer.reset();
    toast.success('Transcript cleared');
  }, [clearCurrent, timer]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0a1a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Top row: User info + status */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* User card */}
            <GlassCard className="p-6 lg:col-span-1" hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                  <User className="w-6 h-6 text-slate-900 dark:text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail className="w-3 h-3 text-gray-500" />
                    <p className="text-sm text-slate-600 dark:text-gray-400 truncate">{user?.email || 'No email'}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <p className="text-xs text-emerald-400 font-medium">Session Active</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Stats */}
            <GlassCard className="p-6 lg:col-span-2 flex flex-col justify-center" hover>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Live Statistics
                  </h3>
                  <StatsBar
                    wordCount={wordCount}
                    charCount={charCount}
                    duration={timer.formatted}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ConnectionStatus status={connectionStatus} />
                  <SpeakingTimer formatted={timer.formatted} isRunning={timer.isRunning} />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Error display */}
          {error && (
            <motion.div
              className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {/* Main content */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transcript area */}
            <div className="lg:col-span-2 space-y-4 flex flex-col">
              <GlassCard className="p-8 flex-1 flex flex-col min-h-[500px]" glow>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                    <Mic className="w-6 h-6 text-purple-500" />
                    Live Transcript
                  </h3>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={handleCopy}
                      className="p-2 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:bg-slate-900/10 dark:bg-white/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Copy transcript"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={handleDownload}
                      className="p-2 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:bg-slate-900/10 dark:bg-white/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Download as TXT"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={handleClear}
                      className="p-2 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Clear transcript"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden min-h-[300px]">
                  <TranscriptPanel />
                </div>

                {/* Controls */}
                <div className="flex justify-center mt-8">
                  {!isListening ? (
                    <motion.button
                      onClick={handleStartListening}
                      className="group relative flex items-center gap-4 px-12 py-6 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-black transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] text-2xl tracking-wide overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Sweep effect */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                        <Mic className="w-7 h-7 text-white" />
                      </div>
                      <span className="relative z-10">START LISTENING</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleStopListening}
                      className="group relative flex items-center gap-4 px-12 py-6 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-black transition-all shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:shadow-[0_0_60px_rgba(225,29,72,0.6)] text-2xl tracking-wide overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                        <MicOff className="w-7 h-7 text-white" />
                      </div>
                      <span className="relative z-10">STOP LISTENING</span>
                      
                      {/* Pulse animation */}
                      <motion.div
                        className="absolute right-6 w-3 h-3 rounded-full bg-white"
                        animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.button>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar: History */}
            <div className="lg:col-span-1">
              <GlassCard className="p-5" hover>
                <TranscriptHistory />
              </GlassCard>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
