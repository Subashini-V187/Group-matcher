import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { suggestedGroups, joinedGroups, sessions, joinGroup, leaveGroup } = useAppContext();
  const [search, setSearch] = useState('');

  const filteredSuggested = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suggestedGroups;
    return suggestedGroups.filter(g =>
      g.name.toLowerCase().includes(q) ||
      (g.subject || '').toLowerCase().includes(q)
    );
  }, [suggestedGroups, search]);

  const filteredJoined = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return joinedGroups;
    return joinedGroups.filter(g => g.name.toLowerCase().includes(q));
  }, [joinedGroups, search]);

  return (
    <div className="space-y-8 text-black dark:text-white">
      <section className="glass border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups"
            className="glass-input rounded-xl px-4 py-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Suggested Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSuggested.map((group) => (
            <motion.div
              key={group.id}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 shadow-lg shadow-black/5 dark:shadow-white/5"
            >
              <p className="text-xs uppercase tracking-widest opacity-70">{group.subject || 'General'}</p>
              <h3 className="text-xl font-semibold mt-2">{group.name}</h3>
              <p className="text-sm opacity-80 mt-2 line-clamp-2">{group.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm opacity-70">{group.members || 0} members</span>
                <button
                  onClick={() => joinGroup(group.id)}
                  className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black"
                >
                  Join
                </button>
              </div>
            </motion.div>
          ))}
          {filteredSuggested.length === 0 && (
            <div className="col-span-full glass rounded-2xl p-6 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40">
              No suggestions found.
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Joined Groups</h2>
          <div className="space-y-4">
            {filteredJoined.map((group) => (
              <div
                key={group.id}
                className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 flex items-center justify-between"
              >
                <div>
                  <p className="text-lg font-semibold">{group.name}</p>
                  <p className="text-sm opacity-70">{group.subject || 'General'}</p>
                </div>
                <button
                  onClick={() => leaveGroup(group.id)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10"
                >
                  Leave
                </button>
              </div>
            ))}
            {filteredJoined.length === 0 && (
              <div className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40">
                You have no groups yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40"
              >
                <p className="text-lg font-semibold">{session.title}</p>
                <p className="text-sm opacity-70 mt-1">{session.group_name}</p>
                <p className="text-sm opacity-80 mt-2">{new Date(session.starts_at).toLocaleString()}</p>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40">
                Join a group to see sessions.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
