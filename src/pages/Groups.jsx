import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Groups() {
  const { suggestedGroups, joinedGroups, joinGroup, leaveGroup } = useAppContext();

  return (
    <div className="space-y-8 text-black dark:text-white">
      <h1 className="text-3xl font-semibold">Groups</h1>

      <section>
        <h2 className="text-xl font-semibold mb-3">Your Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {joinedGroups.map(group => (
            <div key={group.id} className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 flex items-center justify-between">
              <div>
                <p className="font-semibold">{group.name}</p>
                <p className="text-sm opacity-70">{group.subject || 'General'}</p>
              </div>
              <button onClick={() => leaveGroup(group.id)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10">Leave</button>
            </div>
          ))}
          {joinedGroups.length === 0 && <p className="opacity-70">No joined groups yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedGroups.map(group => (
            <div key={group.id} className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40">
              <p className="text-xs uppercase tracking-wide opacity-70">{group.subject || 'General'}</p>
              <p className="font-semibold text-lg mt-1">{group.name}</p>
              <p className="text-sm opacity-80 mt-2">{group.description}</p>
              <button onClick={() => joinGroup(group.id)} className="mt-4 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black">Join</button>
            </div>
          ))}
          {suggestedGroups.length === 0 && <p className="opacity-70">No groups to suggest right now.</p>}
        </div>
      </section>
    </div>
  );
}
