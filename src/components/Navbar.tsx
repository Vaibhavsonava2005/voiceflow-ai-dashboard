import { motion } from 'framer-motion';
import { LogOut, Sun, Moon, Mic, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/[0.03] dark:bg-white/[0.03] border-b border-slate-900/[0.08] dark:border-white/[0.08]"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Mic className="w-5 h-5 text-slate-900 dark:text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">VoiceFlow AI</h1>
              <p className="text-[10px] sm:text-xs text-purple-500 font-bold uppercase tracking-widest hidden sm:block">Dashboard</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:bg-slate-900/10 dark:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* User info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
              </div>
              <span className="text-sm text-slate-700 dark:text-gray-300 font-medium max-w-[120px] truncate">
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </span>
              <Shield className="w-3 h-3 text-emerald-400" />
            </div>

            {/* Logout */}
            <motion.button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-all text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
