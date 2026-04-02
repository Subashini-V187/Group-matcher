export const mockGroups = [
  { id: 1, name: 'Advanced AI Architecture', subjects: ['AI', 'System Design'], members: 3, level: 'Advanced', match: '98%' },
  { id: 2, name: 'Applied Cryptography', subjects: ['Math', 'Security'], members: 4, level: 'Advanced', match: '94%' },
  { id: 3, name: 'Machine Learning Basics', subjects: ['Data', 'Python'], members: 5, level: 'Beginner', match: '85%' },
  { id: 4, name: 'Quantum Mechanics', subjects: ['Physics'], members: 2, level: 'Expert', match: '72%' }
];

export const mockSessions = [
  { id: 1, group: 'Advanced AI Architecture', time: '14:00', duration: '2h', date: 'Today' },
  { id: 2, group: 'Applied Cryptography', time: '18:00', duration: '1.5h', date: 'Tomorrow' }
];

export const mockMessages = [
  { id: 1, sender: 'System', text: 'Synchronization established.' },
  { id: 2, sender: 'Alice', text: 'Are we reviewing the gradient descent models today?' },
  { id: 3, sender: 'You', text: 'Yes, focusing on optimization techniques.' }
];
