import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, User, Users, Calendar, MessageSquare, LogOut, Menu, Moon, Sun, NotebookPen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/groups', label: 'Groups', icon: Users },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
  { path: '/notes', label: 'Notes', icon: NotebookPen },
];

export default function Layout({ children }) {
  const { theme, toggleTheme, logout, user } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      <motion.aside 
        animate={{ width: collapsed ? 80 : 260 }}
        className="glass border-r border-gray-200 dark:border-white/10 z-20 flex flex-col hidden md:flex transition-all"
      >
        <div className="h-20 flex items-center px-6 justify-between border-b border-gray-200 dark:border-white/10">
          {!collapsed && <span className="font-bold text-xl tracking-tighter text-black dark:text-white">Hako AI</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 text-black dark:text-white opacity-70 hover:opacity-100">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-white/10 shadow-md font-semibold text-black dark:text-white' : 'opacity-70 hover:opacity-100 text-black dark:text-white'}`}>
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <button onClick={logout} className="flex items-center gap-4 px-4 py-3 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-black dark:text-white opacity-80 hover:opacity-100 transition-all">
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="h-20 glass flex items-center justify-between px-8 border-b border-gray-200 dark:border-white/10 sticky top-0 z-30">
          <div className="md:hidden font-bold text-xl tracking-tighter text-black dark:text-white">Hako AI</div>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="opacity-70 hover:opacity-100 transition-opacity text-black dark:text-white">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 overflow-hidden"></div>
              <span className="text-sm font-medium tracking-wide hidden sm:block text-black dark:text-white">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: "easeOut" }}>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
