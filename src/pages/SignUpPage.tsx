import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Mic, Waves } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

export default function SignUpPage() {
  const { signUp, isAuthenticated, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  if (needsVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0f0a1a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 text-center" glow>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
              <Mail className="w-8 h-8 text-slate-900 dark:text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Check your email</h2>
            <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">
              We've sent a verification link to <span className="text-purple-400 font-medium">{email}</span>.
              Please verify your email to continue.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-900 dark:text-white font-medium transition-colors"
            >
              Go to Login
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in email and password');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const { error, needsVerification: nv } = await signUp(email, password, name);
      if (error) {
        toast.error(error.message || 'Sign up failed');
      } else if (nv) {
        setNeedsVerification(true);
        toast.success('Account created! Check your email.');
      } else {
        toast.success('Account created successfully!');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-[#0f0a1a]">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-violet-900/20 to-transparent rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-900/20 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-violet-500/10"
            style={{
              width: 80 + i * 50,
              height: 80 + i * 50,
              right: `${5 + i * 18}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, -20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 mb-4 shadow-lg shadow-purple-500/30">
            <Mic className="w-8 h-8 text-slate-900 dark:text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            VoiceFlow AI
          </h1>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Waves className="w-4 h-4 text-purple-400" />
            <p className="text-slate-600 dark:text-gray-400 text-sm">Create your account</p>
          </div>
        </motion.div>

        {/* Signup card */}
        <GlassCard
          className="p-8"
          glow
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Get started</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm text-slate-600 dark:text-gray-400 font-medium" htmlFor="signup-name">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-600 dark:text-gray-400 font-medium" htmlFor="signup-email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-600 dark:text-gray-400 font-medium" htmlFor="signup-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-slate-900 dark:text-white font-semibold flex items-center justify-center gap-2 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-slate-900/30 dark:border-white/30 border-t-slate-900 dark:border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </GlassCard>

        <motion.p
          className="text-center mt-6 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Powered by Deepgram AI & Nhost Auth
        </motion.p>
      </motion.div>
    </div>
  );
}
