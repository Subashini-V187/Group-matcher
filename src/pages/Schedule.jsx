import React from 'react';
import { motion } from 'framer-motion';

export default function Schedule() {
  const hours = Array.from({ length: 8 }, (_, i) => `${i + 13}:00`);
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Chronology</h1>
      <div className="glass rounded-3xl p-8 overflow-x-auto hide-scrollbar">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-8 gap-4 mb-4">
            {hours.map(h => <div key={h} className="text-xs font-mono opacity-50 text-center">{h}</div>)}
          </div>
          <div className="relative h-32 border-t border-b" style={{ borderColor: 'var(--glass-border)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} className="absolute h-full left-[25%] opacity-20 border-x" style={{ background: 'var(--foreground)', borderColor: 'var(--foreground)' }} />
            <motion.div initial={{ width: 0 }} animate={{ width: '12.5%' }} className="absolute h-full left-[62.5%] opacity-20 border-x" style={{ background: 'var(--foreground)', borderColor: 'var(--foreground)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
