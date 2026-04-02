import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Groups from './pages/Groups';
import Schedule from './pages/Schedule';
import Chat from './pages/Chat';
import Notes from './pages/Notes';
import Onboarding from './pages/Onboarding';
import Toast from './components/Toast';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAppContext();
  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white grid place-items-center">Loading...</div>;
  }
  return user ? <Layout>{children}</Layout> : <Navigate to="/auth" />;
};

const OnboardingRoute = () => {
  const { user, loading } = useAppContext();
  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white grid place-items-center">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/auth" />;
  }
  if (user.onboarding_completed) {
    return <Navigate to="/" />;
  }
  return <Onboarding />;
};

const AppContent = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white grid place-items-center">Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="/" element={user && !user.onboarding_completed ? <Navigate to="/onboarding" /> : <PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={user && !user.onboarding_completed ? <Navigate to="/onboarding" /> : <PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/groups" element={user && !user.onboarding_completed ? <Navigate to="/onboarding" /> : <PrivateRoute><Groups /></PrivateRoute>} />
        <Route path="/schedule" element={user && !user.onboarding_completed ? <Navigate to="/onboarding" /> : <PrivateRoute><Schedule /></PrivateRoute>} />
        <Route path="/chat" element={user && !user.onboarding_completed ? <Navigate to="/onboarding" /> : <PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/notes" element={user && !user.onboarding_completed ? <Navigate to="/onboarding" /> : <PrivateRoute><Notes /></PrivateRoute>} />
      </Routes>
      <Toast />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

