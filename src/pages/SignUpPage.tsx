import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, Mic, Activity, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      setLoading(false);
      return;
    }
    
    const { error, needsVerification } = await signUp(email, password, name);
    
    if (error) {
      toast.error(error.message || 'Failed to create account');
      setLoading(false);
    } else if (needsVerification) {
      toast.success('Account created! Please check your email to verify.', { duration: 5000 });
      navigate('/login');
    } else {
      toast.success('Welcome to VoiceFlow AI!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse bg-[#09090B] text-white">
      {/* Right Panel - Hero / Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#111827] border-l border-[rgba(255,255,255,0.08)] flex-col justify-between p-12">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[10%] -right-[20%] w-[80%] h-[80%] rounded-full bg-violet-600/20 blur-[130px]" />
          <div className="absolute bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-600/15 blur-[100px]" />
        </div>

        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight">VoiceFlow AI</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Mic className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md ml-auto mt-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight leading-[1.2] mb-8 text-right">
              Join the future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-violet-400 to-emerald-400">Voice Intelligence</span>
            </h1>

            <ul className="space-y-5">
              {[
                'Unlimited real-time transcription sessions',
                'Advanced endpointing & punctuation algorithms',
                'Secure session history & analytics',
                'Sub-100ms processing latency'
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                  className="flex items-center gap-4 justify-end"
                >
                  <span className="text-gray-300 font-medium text-sm text-right">{item}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-gray-500 text-right">
          © {new Date().getFullYear()} VoiceFlow AI. Powered by Deepgram & Nhost.
        </div>
      </div>

      {/* Left Panel - Form */}
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
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
            <p className="text-gray-400 mb-8">Start your journey with VoiceFlow AI today</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="signup-name">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    style={{ paddingLeft: '3rem' }}
                    className="saas-input w-full pr-4 py-3 rounded-xl bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder-gray-500 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="signup-email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                  <input
                    id="signup-email"
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
                <label className="text-sm font-medium text-gray-300" htmlFor="signup-password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    style={{ paddingLeft: '3rem' }}
                    className="saas-input w-full pr-4 py-3 rounded-xl bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder-gray-500 text-base"
                    autoComplete="new-password"
                    required
                    minLength={8}
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
                  'Create Account'
                )}
              </button>

              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-white hover:text-violet-400 transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
