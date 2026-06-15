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
    <div className="min-h-screen bg-[#0f0a1a]">
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
            <GlassCard className="p-5 lg:col-span-1" hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail className="w-3 h-3 text-gray-500" />
                    <p className="text-sm text-gray-400 truncate">{user?.email || 'No email'}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <p className="text-xs text-emerald-400 font-medium">Session Active</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Stats */}
            <GlassCard className="p-5 lg:col-span-2" hover>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
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
            <div className="lg:col-span-2 space-y-4">
              <GlassCard className="p-6" glow>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mic className="w-5 h-5 text-purple-400" />
                    Live Transcript
                  </h3>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={handleCopy}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Copy transcript"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={handleDownload}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Download as TXT"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={handleClear}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Clear transcript"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <TranscriptPanel />

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  {!isListening ? (
                    <motion.button
                      onClick={handleStartListening}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Mic className="w-5 h-5" />
                      Start Listening
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleStopListening}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-500/25"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <MicOff className="w-5 h-5" />
                      Stop Listening
                      {/* Pulse animation */}
                      <motion.div
                        className="w-2 h-2 rounded-full bg-white"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
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
