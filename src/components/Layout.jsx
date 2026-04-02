import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, User, Users, Calendar, MessageSquare, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/groups', label: 'Groups', icon: Users },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
];

export default function Layout({ children }) {
  const { theme, toggleTheme, logout, user } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <motion.aside 
        animate={{ width: collapsed ? 80 : 260 }}
        className="glass border-r border-t-0 border-b-0 border-l-0 z-20 flex flex-col hidden md:flex transiton-all"
      >
        <div className="h-20 flex items-center px-6 justify-between border-b" style={{ borderColor: 'var(--glass-border)' }}>
          {!collapsed && <span className="font-bold text-xl tracking-tighter">Hako AI</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 opacity-60 hover:opacity-100">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'glass shadow-sm font-semibold' : 'opacity-50 hover:opacity-100'}`}>
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          <button onClick={logout} className="flex items-center gap-4 px-4 py-3 w-full rounded-xl opacity-50 hover:opacity-100 transition-all">
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="h-20 glass flex items-center justify-between px-8 border-b border-t-0 border-r-0 border-l-0 sticky top-0 z-30">
          <div className="md:hidden font-bold text-xl tracking-tighter">Hako AI</div>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="opacity-60 hover:opacity-100 transition-opacity">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-px h-6" style={{ background: 'var(--glass-border)' }} />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-500 overflow-hidden"></div>
              <span className="text-sm font-medium tracking-wide hidden sm:block">{user?.name || 'User'}</span>
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
