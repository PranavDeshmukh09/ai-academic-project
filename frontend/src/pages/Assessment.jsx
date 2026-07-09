import React, { useState } from 'react';
import axios from 'axios';

export default function Assessment({ setView, user, setUser, theme }) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [globalLevel, setGlobalLevel] = useState('Intermediate');
  const [status, setStatus] = useState('');
  const isDark = theme === 'dark';

  const availableSkills = ['Java', 'Spring Boot', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Python', 'React', 'FastAPI'];

  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      setStatus('⚠️ Please choose at least one capability node.');
      return;
    }

    // SNAKE_CASE Mapping for Python endpoint matching Database Schema
    const payload = {
      student_id: user.id || 1, 
      skills: selectedSkills, // Transmits text array array configuration
      experience_level: globalLevel,
      score: 100 // Default tracking score weight metric
    };

    try {
      setStatus('Syncing with database server matrix...');
      await axios.post('http://127.0.0.1:8000/students/assessment', payload);
      if (setUser) {
        setUser(prev => ({ ...prev, skills: selectedSkills }));
      }
      setStatus('✅ Matrix synced successfully!');
      setTimeout(() => setView('profile'), 1000);
    } catch (err) {
      setStatus('❌ Network synchronization error.');
    }
  };

  return (
    <div className={`p-6 max-w-2xl mx-auto space-y-6 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="text-center py-4">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Student Skill Assessment</h2>
        <p className="text-xs text-gray-400 mt-1">Select your primary tech stack and indicate your baseline experience levels.</p>
      </div>

      <div className={`border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-[#1e1f20] border-[#2d2e30]' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-4">Choose Technologies</label>
            <div className="grid grid-cols-3 gap-2">
              {availableSkills.map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button type="button" key={skill} onClick={() => handleToggleSkill(skill)} className={`p-2.5 text-xs rounded-xl border ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#131314] border-gray-800 text-gray-400'}`}>
                    {skill} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Overall Experience Layer</label>
            <select className="w-full p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={globalLevel} onChange={e => setGlobalLevel(e.target.value)}>
              <option value="Novice">Novice Baseline (L1)</option>
              <option value="Familiar">Familiar Entry (L2)</option>
              <option value="Intermediate">Intermediate Core (L3)</option>
              <option value="Advanced">Advanced Stack Engineer (L4)</option>
            </select>
          </div>

          {status && <div className="p-2.5 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">{status}</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white text-xs font-semibold p-2.5 rounded-xl hover:bg-indigo-700">Submit Profile Core</button>
        </form>
      </div>
    </div>
  );
}