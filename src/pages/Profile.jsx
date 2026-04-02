import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const { user, updateUser, notify, refreshUser } = useAppContext();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    skills: '',
    languages: '',
    availability: '',
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || '',
      bio: user.bio || '',
      location: user.location || '',
      skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
      languages: Array.isArray(user.languages) ? user.languages.join(', ') : '',
      availability: Array.isArray(user.availability) ? user.availability.join(', ') : '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUser({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills.split(',').map(v => v.trim()).filter(Boolean),
        languages: formData.languages.split(',').map(v => v.trim()).filter(Boolean),
        availability: formData.availability.split(',').map(v => v.trim()).filter(Boolean),
      });
      await refreshUser();
      notify('Profile saved successfully.', 'success');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl text-black dark:text-white">
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Profile</h1>
      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSave} className="glass p-8 rounded-3xl space-y-6 shadow-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/40">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-70">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-70">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest opacity-70">Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="glass-input w-full p-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white" />
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-70">Skills</label>
            <input name="skills" value={formData.skills} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white" placeholder="React, Node, SQL" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-70">Languages</label>
            <input name="languages" value={formData.languages} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white" placeholder="English, Hindi" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-70">Availability</label>
            <input name="availability" value={formData.availability} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white" placeholder="Mon 8PM, Tue 9PM" />
          </div>
        </div>
        <div className="pt-4">
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl text-sm font-bold tracking-wide border border-gray-200 dark:border-white/10 bg-black dark:bg-white text-white dark:text-black disabled:opacity-70">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
