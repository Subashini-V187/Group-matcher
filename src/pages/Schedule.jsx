import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Schedule() {
  const { sessions } = useAppContext();

  return (
    <div className="text-black dark:text-white">
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Schedule</h1>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40">
            <p className="text-lg font-semibold">{session.title}</p>
            <p className="text-sm opacity-75">{session.group_name}</p>
            <p className="text-sm opacity-85 mt-2">{new Date(session.starts_at).toLocaleString()}</p>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40">No sessions yet.</div>
        )}
      </div>
    </div>
  );
}
