import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function Toast() {
  const { notifications } = useAppContext();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {notifications.map(note => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass px-6 py-3 rounded-lg text-sm font-medium tracking-wide flex items-center shadow-2xl text-black dark:text-white border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40"
          >
            {note.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
