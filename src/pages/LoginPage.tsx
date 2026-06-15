import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Mic, Activity, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#09090B] text-white">
      {/* Left Panel - Hero / Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#111827] border-r border-[rgba(255,255,255,0.08)] flex-col justify-between p-12">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-600/20 blur-[100px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">VoiceFlow AI</span>
        </div>

        <div className="relative z-10 max-w-md mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Real-time Speech Intelligence
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Platform</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-lg mb-10"
          >
            Enterprise-grade live transcription powered by Deepgram. Secure, fast, and remarkably accurate.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="saas-card p-5 bg-[#1F2937]/50 backdrop-blur-sm border-[rgba(255,255,255,0.05)]">
              <Activity className="w-6 h-6 text-purple-400 mb-3" />
              <h3 className="font-semibold text-sm">Ultra-low Latency</h3>
              <p className="text-xs text-gray-500 mt-1">~100ms response time</p>
            </div>
            <div className="saas-card p-5 bg-[#1F2937]/50 backdrop-blur-sm border-[rgba(255,255,255,0.05)]">
              <Shield className="w-6 h-6 text-cyan-400 mb-3" />
              <h3 className="font-semibold text-sm">Enterprise Security</h3>
              <p className="text-xs text-gray-500 mt-1">End-to-end encryption</p>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-gray-500">
          © {new Date().getFullYear()} VoiceFlow AI. Powered by Deepgram & Nhost.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">VoiceFlow AI</span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-gray-400 mb-8">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="login-email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{ paddingLeft: '3rem' }}
                    className="saas-input w-full pr-4 py-3 rounded-xl bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder-gray-500 text-base"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300" htmlFor="login-password">Password</label>
                  <a href="#" className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingLeft: '3rem' }}
                    className="saas-input w-full pr-4 py-3 rounded-xl bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder-gray-500 text-base"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isLoading}
                className="btn-primary w-full mt-8 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all text-base"
              >
                {loading || isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>

              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-white hover:text-purple-400 transition-colors">
                  Create one now
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
