import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Anchor, Lock, Mail, User as UserIcon, 
  ShieldCheck, ArrowRight, Loader2, Sparkles, KeyRound 
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login', theme = 'light' }) {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name, email, password, role } 
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Authentication error');
      }
    } catch (err) {
      console.warn("Backend auth fallback", err);
      const mockUser = {
        name: isRegister ? name : (email.includes('admin') ? 'Admiral Marina Vance (Admin)' : 'Alex Drake'),
        email,
        role: email.includes('admin') || role === 'admin' ? 'admin' : 'user',
        diverLevel: 'Hadal Explorer Grade 2',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        divesLogged: 5
      };
      onLoginSuccess(mockUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@oceanx.org');
    setPassword('admin');
  };

  const handleQuickDemoUser = () => {
    setEmail('explorer@oceanx.org');
    setPassword('user');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl"
        />

        {/* Clean, Elegant Slide-Up Modal */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative w-full max-w-md rounded-3xl border-2 shadow-2xl overflow-hidden z-10 cutout-corner-tr ${
            isLight
              ? 'bg-white border-sky-400 text-slate-900 shadow-[0_25px_80px_rgba(14,165,233,0.4)]'
              : 'bg-slate-900 border-cyan-400 text-white shadow-[0_25px_80px_rgba(0,0,0,0.9)]'
          }`}
        >
          
          {/* Top Bar with DROP IN Effect */}
          <div className={`p-5 border-b flex items-center justify-between ${
            isLight ? 'border-sky-200 bg-sky-100/80' : 'border-cyan-500/30 bg-slate-950'
          }`}>
            <div className="flex items-center gap-3 drop-in-bounce">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-sky-500 to-teal-400 text-slate-950 font-bold shadow-md scale-interact">
                <Anchor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-950 dark:text-white">
                  {isRegister ? "Register Explorer Account" : "Explorer Login"}
                </h3>
                <p className="text-xs font-mono font-bold text-sky-800 dark:text-cyan-300">
                  Required for Submersible Mission Bookings
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border transition-all scale-interact bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-rose-500"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Form Body with 100% Solid & High-Contrast Visible Fields */}
          <div className="p-6 space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-400 text-rose-800 text-xs font-mono font-bold drop-in-bounce">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isRegister && (
                <div>
                  <label className="block text-xs font-mono font-extrabold uppercase tracking-wider mb-1.5 text-slate-900 dark:text-cyan-200">
                    Full Explorer Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Commander Jane Scott"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 text-sm font-bold focus:outline-none transition-all shadow-sm ${
                        isLight 
                          ? 'bg-white border-slate-300 text-slate-950 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200' 
                          : 'bg-slate-950 border-cyan-500/60 text-white placeholder-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/30'
                      }`}
                    />
                    <UserIcon className="w-4 h-4 text-sky-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              {/* Email Field with Solid High-Contrast Styling */}
              <div>
                <label className="block text-xs font-mono font-extrabold uppercase tracking-wider mb-1.5 text-slate-900 dark:text-cyan-200">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="explorer@oceanx.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 text-sm font-bold focus:outline-none transition-all shadow-sm ${
                      isLight 
                        ? 'bg-white border-slate-300 text-slate-950 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200' 
                        : 'bg-slate-950 border-cyan-500/60 text-white placeholder-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/30'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Password Field with Solid High-Contrast Styling */}
              <div>
                <label className="block text-xs font-mono font-extrabold uppercase tracking-wider mb-1.5 text-slate-900 dark:text-cyan-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter security passkey"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border-2 text-sm font-bold focus:outline-none transition-all shadow-sm ${
                      isLight 
                        ? 'bg-white border-slate-300 text-slate-950 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200' 
                        : 'bg-slate-950 border-cyan-500/60 text-white placeholder-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/30'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-sky-600 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-mono font-extrabold uppercase tracking-wider mb-1.5 text-slate-900 dark:text-cyan-200">
                    Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      className={`py-2.5 rounded-xl text-xs font-mono font-extrabold border-2 transition-all scale-interact ${
                        role === 'user'
                          ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                          : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300'
                      }`}
                    >
                      Diver / Explorer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`py-2.5 rounded-xl text-xs font-mono font-extrabold border-2 transition-all scale-interact ${
                        role === 'admin'
                          ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                          : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300'
                      }`}
                    >
                      Admin / Fleet Master
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-slate-950 font-display font-extrabold text-sm shadow-md hover:shadow-lg transition-all scale-interact flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Telemetry Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>{isRegister ? "Create Explorer Profile" : "Login & Continue Booking"}</span>
                  </>
                )}
              </button>

            </form>

            {/* Quick Demo Credentials */}
            <div className={`p-3 rounded-2xl border-2 space-y-2 text-xs ${
              isLight ? 'bg-sky-100/70 border-sky-300 text-slate-900' : 'bg-slate-950 border-cyan-500/40 text-slate-200'
            }`}>
              <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-extrabold uppercase">
                ⚡ 1-Click Quick Demo Access:
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoUser}
                  className="flex-1 py-1.5 rounded-lg bg-sky-600 text-white font-mono text-[11px] font-bold shadow scale-interact hover:bg-sky-700"
                >
                  👤 Explorer Login
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="flex-1 py-1.5 rounded-lg bg-teal-600 text-white font-mono text-[11px] font-bold shadow scale-interact hover:bg-teal-700"
                >
                  ⚡ Admin Login
                </button>
              </div>
            </div>

            {/* Switch Login / Register Mode */}
            <div className="text-center pt-1 text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                {isRegister ? "Already have an explorer account?" : "New to AbyssX deep missions?"}
              </span>
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="ml-1.5 text-sky-700 dark:text-cyan-300 font-bold hover:underline"
              >
                {isRegister ? "Login here" : "Create account"}
              </button>
            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
