import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { auth } from '../../lib/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ProtectedRoute will handle the Firestore check
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Invalid credentials or access denied.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-6">
            <span className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent italic">
              Terminal Access
            </span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-brand-primary leading-none mb-2">
            Alpha<span className="text-brand-accent">Davis</span>
          </h1>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-brand-primary/40 italic">
            Management Portal
          </p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-display text-[10px] font-black uppercase tracking-widest text-brand-primary/40 mb-3 ml-4 italic">
                Authorized Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-accent/40 group-focus-within:text-brand-accent transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alphadavis.com"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-display font-medium placeholder:text-white/10 focus:outline-none focus:border-brand-accent/30 transition-all uppercase text-xs tracking-wider"
                />
              </div>
            </div>

            <div>
              <label className="block font-display text-[10px] font-black uppercase tracking-widest text-brand-primary/40 mb-3 ml-4 italic">
                Secret Access Code
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-accent/40 group-focus-within:text-brand-accent transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-display font-medium placeholder:text-white/10 focus:outline-none focus:border-brand-accent/30 transition-all uppercase text-xs tracking-wider"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center italic"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-accent text-black font-display font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 group transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Authenticate Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/')}
            className="font-display text-[10px] font-bold uppercase tracking-widest text-brand-primary/20 hover:text-brand-accent transition-colors italic"
          >
            ← Return to Public Terminal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
