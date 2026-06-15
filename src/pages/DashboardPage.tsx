import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mic, MicOff, Copy, Download, Trash2, Activity, AlertCircle, Clock, FileText, Wifi, History
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranscript } from '../context/TranscriptContext';
import { useDeepgram } from '../hooks/useDeepgram';
import { useTimer } from '../hooks/useTimer';
import Navbar from '../components/Navbar';
import TranscriptPanel from '../components/TranscriptPanel';
import TranscriptHistory from '../components/TranscriptHistory';

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentTranscript, wordCount, saveToHistory, clearCurrent } = useTranscript();
  const { isListening, connectionStatus, startListening, stopListening, error } = useDeepgram();
  const timer = useTimer();

  const charCount = currentTranscript.trim().length;

  useEffect(() => {
    if (isListening) {
      timer.start();
    } else {
      timer.stop();
    }
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Dashboard Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Overview</h1>
              <p className="text-[var(--text-secondary)] mt-1">Live speech transcription and analytics session.</p>
            </div>
            
            <div className="flex items-center gap-4">
              {!isListening ? (
                <button
                  onClick={handleStartListening}
                  className="btn-primary px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                  <Mic className="w-5 h-5" />
                  Start Session
                </button>
              ) : (
                <button
                  onClick={handleStopListening}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
                >
                  <MicOff className="w-5 h-5" />
                  Stop Session
                </button>
              )}
            </div>
          </motion.div>

          {/* Error display */}
          {error && (
            <motion.div variants={itemVariants} className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Statistics Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="saas-card p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Words</span>
              </div>
              <div className="text-3xl font-bold text-[var(--text-primary)]">{wordCount}</div>
            </div>
            
            <div className="saas-card p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Characters</span>
              </div>
              <div className="text-3xl font-bold text-[var(--text-primary)]">{charCount}</div>
            </div>
            
            <div className="saas-card p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <div className="text-3xl font-bold text-[var(--text-primary)] font-mono">{timer.formatted}</div>
            </div>
            
            <div className="saas-card p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-[var(--text-secondary)] mb-2">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                  connectionStatus === 'connecting' ? 'bg-amber-500 animate-pulse' :
                  connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
                <span className="text-lg font-bold capitalize text-[var(--text-primary)]">
                  {connectionStatus === 'idle' ? 'Ready' : connectionStatus}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Main Layout Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Transcript Area */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Mic className="w-5 h-5 text-[var(--color-primary)]" />
                  Live Transcript
                </h2>
                
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="p-2 text-[var(--text-secondary)] hover:text-white bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md transition-colors" title="Copy">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={handleDownload} className="p-2 text-[var(--text-secondary)] hover:text-white bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={handleClear} className="p-2 text-[var(--text-secondary)] hover:text-red-400 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md transition-colors" title="Clear">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="saas-card flex flex-col min-h-[500px] overflow-hidden relative">
                {isListening && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 animate-[shimmer_2s_linear_infinite]" />
                )}
                
                <div className="flex-1 p-6 overflow-y-auto">
                  {currentTranscript ? (
                    <TranscriptPanel />
                  ) : (
                    <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
                      <div className="text-center">
                        <Mic className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Click "Start Session" to begin transcribing...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {isListening && (
                  <div className="bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)] px-6 py-3 flex items-center gap-3">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-3 bg-purple-500 rounded-full"
                          animate={{ height: ['12px', '24px', '12px'] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-purple-400">Listening...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: History */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <History className="w-5 h-5 text-[var(--text-secondary)]" />
                Session History
              </h2>
              <div className="saas-card p-5 min-h-[500px]">
                <TranscriptHistory />
              </div>
            </div>

          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
