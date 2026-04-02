import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_GROUPS = [
  { id: 1, name: 'Advanced Calculus', subjects: ['Math', 'Calculus'], members: 12 },
  { id: 2, name: 'Quantum Physics Prep', subjects: ['Physics', 'Quantum'], members: 8 },
  { id: 3, name: 'Data Structures & Algorithms', subjects: ['Computer Science'], members: 24 },
  { id: 4, name: 'Organic Chemistry', subjects: ['Chemistry', 'Organic'], members: 15 },
  { id: 5, name: 'Introduction to Psychology', subjects: ['Psychology', 'Humanities'], members: 30 },
  { id: 6, name: 'Macroeconomics Discussion', subjects: ['Economics', 'Finance'], members: 18 },
  { id: 7, name: 'Creative Writing Workshop', subjects: ['Writing', 'English'], members: 10 },
  { id: 8, name: 'Machine Learning Deep Dive', subjects: ['AI', 'Computer Science'], members: 45 },
];

const JOINED_GROUPS = [
  { id: 101, name: 'Machine Learning 101', members: 42 },
  { id: 102, name: 'Philosophy of Mind', members: 19 },
];

const UPCOMING_SESSIONS = [
  { id: 201, title: 'Neural Networks Review', time: 'Today, 4:00 PM', group: 'Machine Learning 101' },
  { id: 202, title: 'Kant Discussion', time: 'Tomorrow, 2:00 PM', group: 'Philosophy of Mind' },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSuggested, setShowAllSuggested] = useState(false);
  const [suggestedGroups, setSuggestedGroups] = useState(SUGGESTED_GROUPS);
  const [joinedGroups, setJoinedGroups] = useState(JOINED_GROUPS);

  const handleJoin = (groupToJoin) => {
    setSuggestedGroups(prev => prev.filter(g => g.id !== groupToJoin.id));
    setJoinedGroups(prev => [{...groupToJoin, members: groupToJoin.members + 1}, ...prev]);
  };

  const filteredSuggestedGroups = suggestedGroups.filter(group => {
    const q = searchQuery.toLowerCase();
    return group.name.toLowerCase().includes(q) || group.subjects.some(sub => sub.toLowerCase().includes(q));
  });

  const displayedSuggestedGroups = showAllSuggested 
    ? filteredSuggestedGroups 
    : filteredSuggestedGroups.slice(0, 4);

  const filteredJoinedGroups = joinedGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 flex-1 flex flex-col h-full overflow-hidden">
      <header className="sticky top-0 z-30 bg-white/60 dark:bg-black/40 backdrop-blur-lg px-6 py-4 flex items-center justify-between border-b border-gray-200/50 dark:border-white/10">
        <h2 className="text-xl font-semibold hidden md:block">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search by subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full md:w-64 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/50 transition-all placeholder-gray-400 text-sm shadow-inner"
            />
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-10 flex-1 overflow-y-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto space-y-10">
          
          {/* Suggested Groups */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold tracking-tight">Suggested for You</h3>
              {filteredSuggestedGroups.length > 4 && (
                <button onClick={() => setShowAllSuggested(!showAllSuggested)} className="text-sm font-medium hover:underline opacity-60 hover:opacity-100 transition">
                  {showAllSuggested ? 'Show less' : 'View all'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedSuggestedGroups.length > 0 ? (
                displayedSuggestedGroups.map((group) => (
                  <motion.div key={group.id} whileHover={{ y: -5, scale: 1.02 }} className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgb(255,255,255,0.05)] flex flex-col justify-between h-56 transition-shadow">
                    <div>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {group.subjects.map(sub => (
                          <span key={sub} className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-gray-900/5 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                            {sub}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-lg font-bold leading-tight mb-2">{group.name}</h4>
                      <p className="text-sm opacity-60 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        {group.members} members
                      </p>
                    </div>
                    <button 
                      onClick={() => handleJoin(group)}
                      className="w-full py-2.5 mt-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
                    >
                      Join Group
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center opacity-50">
                  <p>No groups match your search.</p>
                </div>
              )}
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Joined Groups */}
            <motion.section variants={itemVariants}>
              <h3 className="text-xl font-bold tracking-tight mb-6">Your Groups</h3>
              <div className="space-y-4">
                {filteredJoinedGroups.length > 0 ? (
                  filteredJoinedGroups.map((group) => (
                    <motion.div key={group.id} whileHover={{ x: 5 }} className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-50 dark:from-white/10 dark:to-white/5 flex items-center justify-center font-bold text-lg shadow-inner">
                          {group.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{group.name}</h4>
                          <p className="text-xs opacity-50">{group.members} members</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-4 text-center opacity-50 text-sm">
                    <p>No joined groups match your search.</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Upcoming Sessions */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold tracking-tight">Upcoming Sessions</h3>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
              </div>
              <div className="space-y-4">
                {UPCOMING_SESSIONS.map((session) => (
                  <motion.div key={session.id} whileHover={{ scale: 1.01 }} className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 shadow-sm hover:border-gray-300 dark:hover:border-white/20 transition-all border-l-4 border-l-gray-900 dark:border-l-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-base">{session.title}</h4>
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-white/10">{session.time}</span>
                    </div>
                    <p className="text-sm opacity-60 font-medium">with {session.group}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

        </motion.div>
      </main>
    </div>
  );
}