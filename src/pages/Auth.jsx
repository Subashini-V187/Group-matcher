import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function Auth() {
  const { login } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      return setError('All fields required.');
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError('Invalid format.');
    }
    
    try {
      setSubmitting(true);
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, name: form.name };
        
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Authentication failed');
      }
      
      await login(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full blur-[100px] bg-neutral-400/30 dark:bg-white/10" />
      </div>

      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass p-10 rounded-2xl w-full max-w-md relative z-10 shadow-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40"
      >
        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-black dark:text-white">Hako <span className="font-normal opacity-60">AI</span></h1>
        <p className="text-sm opacity-60 mb-8 text-black dark:text-white">{isLogin ? 'Welcome back.' : 'Create your account.'}</p>

        <AnimatePresence>
          {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm mb-4 border border-red-300 text-red-700 dark:text-red-300 py-2 px-3 rounded-lg">{error}</motion.div>}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence>
            {!isLogin && (
              <motion.input initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="glass-input p-3 rounded-xl w-full text-sm transition-all text-black dark:text-white border border-gray-200 dark:border-white/10 bg-white dark:bg-black"
                placeholder="Enter name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              />
            )}
          </AnimatePresence>
          <input className="glass-input p-3 rounded-xl w-full text-sm transition-all text-black dark:text-white border border-gray-200 dark:border-white/10 bg-white dark:bg-black" type="email" placeholder="Enter email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input className="glass-input p-3 rounded-xl w-full text-sm transition-all text-black dark:text-white border border-gray-200 dark:border-white/10 bg-white dark:bg-black" type="password" placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={submitting} className="mt-4 p-4 rounded-xl font-bold text-sm tracking-wide transition-all w-full border border-gray-200 dark:border-white/10 bg-black dark:bg-white text-white dark:text-black disabled:opacity-60">
            {submitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm opacity-70 text-black dark:text-white">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="hover:opacity-100 transition-opacity uppercase tracking-widest font-semibold text-xs border-b border-transparent hover:border-current pb-1">
            {isLogin ? 'Create account' : 'Back to login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
