import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Notes() {
  const { api, notify } = useAppContext();
  const [notes, setNotes] = useState([]);
  const [active, setActive] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const loadNotes = async () => {
    const data = await api('/api/notes');
    setNotes(data);
    if (data.length && !active) {
      setActive(data[0].id);
      setTitle(data[0].title);
      setContent(data[0].content);
    }
  };

  useEffect(() => {
    loadNotes().catch(() => {});
  }, []);

  const selectNote = (note) => {
    setActive(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const createNote = async () => {
    const note = await api('/api/notes', {
      method: 'POST',
      body: JSON.stringify({ title: 'New note', content: '' }),
    });
    setNotes(prev => [note, ...prev]);
    selectNote(note);
  };

  const saveNote = async () => {
    if (!active) return;
    const updated = await api(`/api/notes/${active}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    });
    setNotes(prev => prev.map(n => (n.id === active ? updated : n)));
    notify('Note saved.', 'success');
  };

  const deleteNote = async () => {
    if (!active) return;
    await api(`/api/notes/${active}`, { method: 'DELETE' });
    const next = notes.filter(n => n.id !== active);
    setNotes(next);
    if (next[0]) {
      selectNote(next[0]);
    } else {
      setActive(null);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="h-[calc(100vh-170px)] grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 text-black dark:text-white">
      <aside className="glass rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Notes</h2>
          <button onClick={createNote} className="px-3 py-1 rounded-md bg-black dark:bg-white text-white dark:text-black">New</button>
        </div>
        <div className="space-y-2">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => selectNote(note)}
              className={`w-full text-left rounded-lg px-3 py-2 border ${note.id === active ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-gray-200 dark:border-white/10'}`}
            >
              <p className="font-medium truncate">{note.title}</p>
              <p className="text-xs opacity-70 truncate">{note.content}</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="glass rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40 p-5 flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="glass-input px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note"
          className="glass-input flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white min-h-[280px]"
        />
        <div className="flex gap-3">
          <button onClick={saveNote} className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black">Save</button>
          <button onClick={deleteNote} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10">Delete</button>
        </div>
      </section>
    </div>
  );
}
