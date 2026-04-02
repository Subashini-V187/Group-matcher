import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppContext } from '../context/AppContext';

const socket = io('http://localhost:5000', { autoConnect: true });

export default function Chat() {
  const { token, joinedGroups, user } = useAppContext();
  const [activeGroupId, setActiveGroupId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!activeGroupId && joinedGroups.length > 0) {
      setActiveGroupId(String(joinedGroups[0].id));
    }
  }, [joinedGroups, activeGroupId]);

  useEffect(() => {
    if (!activeGroupId) return;

    socket.emit('join-room', { groupId: activeGroupId });
    return () => {
      socket.emit('leave-room', { groupId: activeGroupId });
    };
  }, [activeGroupId]);

  useEffect(() => {
    if (!activeGroupId || !token) return;
    fetch(`http://localhost:5000/api/chat/${activeGroupId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));
  }, [activeGroupId, token]);

  useEffect(() => {
    const handler = (message) => {
      if (String(message.group_id) === String(activeGroupId)) {
        setMessages(prev => [...prev, message]);
      }
    };
    socket.on('chat-message', handler);
    return () => socket.off('chat-message', handler);
  }, [activeGroupId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeGroup = useMemo(
    () => joinedGroups.find(g => String(g.id) === String(activeGroupId)),
    [joinedGroups, activeGroupId]
  );

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !activeGroupId || !token) return;

    setInput('');
    await fetch(`http://localhost:5000/api/chat/${activeGroupId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, messageType: 'text' }),
    });
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeGroupId || !token) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      await fetch(`http://localhost:5000/api/chat/${activeGroupId}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="h-[calc(100vh-170px)] grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 text-black dark:text-white">
      <aside className="glass rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Your Groups</h2>
        <div className="space-y-2">
          {joinedGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveGroupId(String(group.id))}
              className={`w-full text-left rounded-lg px-3 py-2 border ${String(group.id) === String(activeGroupId) ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-gray-200 dark:border-white/10'}`}
            >
              {group.name}
            </button>
          ))}
          {joinedGroups.length === 0 && <p className="opacity-70 text-sm">Join a group to start chat.</p>}
        </div>
      </aside>

      <section className="glass rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 flex flex-col overflow-hidden">
        <header className="p-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="font-semibold text-lg">{activeGroup?.name || 'Group Chat'}</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl p-3 border ${m.user_id === user?.id ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'bg-white dark:bg-black border-gray-200 dark:border-white/10'}`}>
                <p className="text-xs opacity-70 mb-1">{m.username}</p>
                {m.message_type === 'image' && m.image_url ? (
                  <img src={`http://localhost:5000${m.image_url}`} alt="upload" className="rounded-lg max-h-56 object-cover" />
                ) : (
                  <p>{m.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-white/10 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 glass-input px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white"
          />
          <label className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer">
            {uploading ? '...' : 'Image'}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </label>
          <button className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black">Send</button>
        </form>
      </section>
    </div>
  );
}
