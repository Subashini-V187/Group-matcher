import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function Auth() {
  const { login } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: 'admin@hako.ai', password: 'password123', name: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      return setError('All fields required.');
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError('Invalid format.');
    }
    
    try {
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
      
      login(data.user);
      localStorage.setItem('hako_token', data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full blur-[100px] bg-white opacity-5 dark:opacity-10" />
      </div>

      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass p-10 rounded-2xl w-full max-w-md relative z-10 shadow-2xl"
      >
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Hako <span className="font-normal opacity-50">AI</span></h1>
        <p className="text-sm opacity-50 mb-8">{isLogin ? 'Authentication protocol.' : 'Initialize credentials.'}</p>

        <AnimatePresence>
          {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm mb-4 border py-2 px-3 rounded-lg" style={{ borderColor: 'var(--foreground)' }}>{error}</motion.div>}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence>
            {!isLogin && (
              <motion.input initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="glass-input p-3 rounded-xl w-full text-sm transition-all"
                placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              />
            )}
          </AnimatePresence>
          <input className="glass-input p-3 rounded-xl w-full text-sm transition-all" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input className="glass-input p-3 rounded-xl w-full text-sm transition-all" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4 p-4 rounded-xl font-bold text-sm tracking-wide transition-all w-full border" style={{ background: 'var(--foreground)', color: 'var(--background)', borderColor: 'var(--foreground)' }}>
            {isLogin ? 'Authenticate' : 'Initialize'}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm opacity-50">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="hover:opacity-100 transition-opacity uppercase tracking-widest font-semibold text-xs border-b border-transparent hover:border-current pb-1">
            {isLogin ? 'Create Access' : 'Return to Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
