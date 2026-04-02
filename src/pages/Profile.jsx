import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const { user, updateUser, notify } = useAppContext();

  // Create local state so user can type freely before saving
  const [formData, setFormData] = useState({
    designation: 'Executive User',
    institution: 'Global Tech University',
    department: 'Computer Science',
    skillTier: 'Intermediate',
    availability: '18:00 - 22:00 EST'
  });

  // Sync up if global user state already has some data
  useEffect(() => {
    if (user?.profileData) {
      setFormData(user.profileData);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ profileData: formData });
    notify('Profile parameters synchronized.', 'success');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Profile</h1>
      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSave} className="glass p-8 rounded-3xl space-y-6 shadow-xl">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50">Full Designation</label>
            <input name="designation" value={formData.designation} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50">Institution Name</label>
            <input name="institution" value={formData.institution} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50">Department</label>
            <input name="department" value={formData.department} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50">Skill Tier</label>
            <select name="skillTier" value={formData.skillTier} onChange={handleChange} className="glass-input w-full p-3 rounded-xl text-sm appearance-none bg-transparent">
              <option className="text-black">Beginner</option>
              <option className="text-black">Intermediate</option>     
              <option className="text-black">Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50">Availability</label>
            <input name="availability" value={formData.availability} onChange={handleChange} type="text" className="glass-input w-full p-3 rounded-xl text-sm" />
          </div>
        </div>
        <div className="pt-6">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-6 py-3 rounded-xl text-sm font-bold tracking-wide border transition-all" style={{ background: 'var(--foreground)', color: 'var(--background)', borderColor: 'var(--foreground)' }}>
            Synchronize Data
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
