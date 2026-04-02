import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const INTERESTS = [
  'Math', 'Physics', 'Chemistry', 'AI', 'ML', 'Space', 'Philosophy', 'Literature', 'Biology', 'Economics',
  'History', 'Psychology', 'Data Science', 'Robotics', 'Astronomy', 'Design', 'Programming', 'Cybersecurity',
  'Finance', 'Sociology', 'Music', 'Art', 'Law', 'Medicine', 'Statistics', 'Neuroscience', 'Blockchain',
  'Cloud', 'DevOps', 'Product', 'Marketing', 'Public Speaking', 'Writing', 'Poetry', 'Film', 'Politics',
  'Ethics', 'Anthropology', 'Geography', 'Environment', 'Climate', 'Game Dev', 'Mobile Dev', 'Web Dev',
  'Algorithms', 'Distributed Systems', 'Databases', 'Entrepreneurship', 'Startups', 'Leadership', 'Education',
  'Linguistics', 'Architecture', 'UI UX', 'Operations', 'Supply Chain', 'Nanotech', 'Quantum Computing'
];

export default function Onboarding() {
  const { updateUser, api, joinGroup, notify } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [typing, setTyping] = useState('Analyzing your interests...');
  const [matches, setMatches] = useState([]);

  const progressText = useMemo(() => {
    if (step !== 2) return '';
    return typing;
  }, [step, typing]);

  const toggleInterest = (item) => {
    setSelected(prev => (prev.includes(item) ? prev.filter(v => v !== item) : [...prev, item]));
  };

  const startMatching = async () => {
    if (selected.length === 0) {
      notify('Select at least one interest.', 'error');
      return;
    }

    await updateUser({ interests: selected });
    setStep(2);

    const lines = [
      'Analyzing your interests...',
      'Finding optimal groups...',
      'Matching skill levels...'
    ];

    for (let i = 0; i < lines.length; i += 1) {
      setTyping(lines[i]);
      await new Promise(r => setTimeout(r, 1000));
    }

    const result = await api('/api/match/groups');
    setMatches(Array.isArray(result) ? result.slice(0, 12) : []);
    setStep(3);
  };

  const completeOnboarding = async () => {
    await updateUser({ onboarding_completed: true });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {step === 1 && (
          <div>
            <h1 className="text-4xl font-semibold mb-2">Pick your interests</h1>
            <p className="opacity-70 mb-8">Select multiple topics to personalize your group matching.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {INTERESTS.map((item) => {
                const active = selected.includes(item);
                return (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`rounded-full px-4 py-2 text-sm border transition ${active ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'bg-white dark:bg-black border-gray-200 dark:border-white/10'}`}
                  >
                    {item}
                  </motion.button>
                );
              })}
            </div>
            <button onClick={startMatching} className="mt-8 px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black">Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className="min-h-[60vh] grid place-items-center">
            <div className="glass rounded-3xl p-10 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 w-full max-w-xl text-center">
              <div className="text-2xl font-semibold">AI Matching</div>
              <p className="mt-6 text-lg">{progressText}</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-4xl font-semibold mb-2">Suggested groups</h1>
            <p className="opacity-70 mb-8">Join a few groups to get started.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {matches.map((group) => (
                <div key={group.id} className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40">
                  <p className="text-xs uppercase tracking-wide opacity-70">{group.subject || 'General'}</p>
                  <p className="text-xl font-semibold mt-2">{group.name}</p>
                  <p className="opacity-80 mt-2 text-sm">{group.description}</p>
                  <button onClick={() => joinGroup(group.id)} className="mt-4 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black">Join</button>
                </div>
              ))}
            </div>
            <button onClick={completeOnboarding} className="mt-8 px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black">Finish onboarding</button>
          </div>
        )}
      </div>
    </div>
  );
}
