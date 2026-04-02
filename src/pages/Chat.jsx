import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { mockMessages } from '../data/mock';

export default function Chat() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col glass rounded-3xl overflow-hidden">
      <div className="p-6 border-b" style={{ borderColor: 'var(--glass-border)' }}>
        <h2 className="font-bold tracking-tight">Advanced AI Architecture</h2>
        <p className="text-xs opacity-50 font-mono">Secure comms channel</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
        {messages.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] uppercase tracking-widest opacity-40 mb-1">{m.sender}</span>
            <div className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] ${m.sender === 'You' ? 'border' : 'glass'}`} style={m.sender === 'You' ? { background: 'var(--foreground)', color: 'var(--background)' } : {}}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-4" style={{ borderColor: 'var(--glass-border)' }}>
        <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Transmit sequence..." className="glass-input flex-1 px-4 py-3 rounded-xl text-sm" />
        <button type="submit" className="px-6 rounded-xl flex items-center justify-center border transition-all hover:scale-105" style={{ background: 'var(--foreground)', color: 'var(--background)' }}><Send size={16} /></button>
      </form>
    </div>
  );
}
