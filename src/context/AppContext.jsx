import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockGroups, mockSessions } from '../data/mock';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([1, 2]);

  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState(mockSessions);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    fetch('http://localhost:5000/api/groups')
      .then(res => res.json())
      .then(data => setGroups(Array.isArray(data) ? data : mockGroups))
      .catch(() => setGroups(mockGroups));
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  const login = (userData) => {
    setUser(userData);
    notify('Successfully deeply authenticated.', 'success');
  };
  
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const toggleGroup = (id) => {
    setJoinedGroups(prev => {
      const isJoined = prev.includes(id);
      if (isJoined) {
        notify('Left group seamlessly.', 'info');
        return prev.filter(g => g !== id);
      } else {
        notify('Joined group. Synchronization complete.', 'success');
        return [...prev, id];
      }
    });
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, login, logout, updateUser,
      notifications, notify,
      groups, setGroups, sessions, setSessions,
      joinedGroups, toggleGroup
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
