import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('hako_theme') || 'dark');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hako_token') || '');
  const [notifications, setNotifications] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('hako_theme', theme);
  }, [theme]);

  const notify = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const api = useMemo(() => {
    return async (endpoint, options = {}) => {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    };
  }, [token]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json());
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem('hako_token');
        setToken('');
      }
    } catch (_err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadAppData = useCallback(async () => {
    if (!token) {
      setJoinedGroups([]);
      setSuggestedGroups([]);
      setSessions([]);
      return;
    }
    try {
      const [mine, suggested, schedule] = await Promise.all([
        fetch('http://localhost:5000/api/groups/mine', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch('http://localhost:5000/api/match/groups', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch('http://localhost:5000/api/sessions', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      setJoinedGroups(Array.isArray(mine) ? mine : []);
      setSuggestedGroups(Array.isArray(suggested) ? suggested : []);
      setSessions(Array.isArray(schedule) ? schedule : []);
    } catch (_err) {
      setJoinedGroups([]);
      setSuggestedGroups([]);
      setSessions([]);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      loadAppData();
    }
  }, [user, loadAppData]);

  const login = async (tokenValue) => {
    localStorage.setItem('hako_token', tokenValue);
    setToken(tokenValue);
    await refreshUser();
    notify('Authenticated successfully.', 'success');
  };

  const updateUser = async (userData) => {
    const updated = await api('/api/users/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem('hako_token');
    setToken('');
    setUser(null);
    setJoinedGroups([]);
    setSuggestedGroups([]);
    setSessions([]);
    notify('Logged out.', 'info');
  };

  const joinGroup = async (id) => {
    await api(`/api/groups/${id}/join`, { method: 'POST' });
    await loadAppData();
    notify('Joined group successfully.', 'success');
  };

  const leaveGroup = async (id) => {
    await api(`/api/groups/${id}/leave`, { method: 'POST' });
    await loadAppData();
    notify('Left group.', 'info');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, token, login, logout, updateUser, refreshUser,
      notifications, notify,
      joinedGroups, suggestedGroups, sessions,
      joinGroup, leaveGroup, loadAppData,
      loading, api
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
