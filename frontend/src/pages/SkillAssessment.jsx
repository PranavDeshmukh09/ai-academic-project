import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function SkillAssessment({ onComplete, userProfile }) {
  const [skills, setSkills] = useState(() => {
    if (userProfile?.skills && userProfile.skills.length > 0) {
      return userProfile.skills.map(s => ({
        name: s,
        level: userProfile.experienceLevel || 'Intermediate'
      }));
    }
    return [
      { name: 'Python', level: 'Intermediate' },
      { name: 'Java', level: 'Beginner' },
    ];
  });

  useEffect(() => {
    if (userProfile?.skills && userProfile.skills.length > 0) {
      setSkills(userProfile.skills.map(s => ({
        name: s,
        level: userProfile.experienceLevel || 'Intermediate'
      })));
    }
  }, [userProfile]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    // Prevent duplicate entries
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setError('This skill is already added.');
      return;
    }

    setError('');
    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
    setNewSkillLevel('Beginner');
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleLevelChange = (indexToUpdate, newLevel) => {
    setSkills(skills.map((skill, idx) => 
      idx === indexToUpdate ? { ...skill, level: newLevel } : skill
    ));
  };

  const handleSubmitAssessment = async () => {
  if (skills.length === 0) {
    setError('Please add at least one core skill to complete your diagnostic assessment.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const skillNames = skills.map(s => s.name);
    let finalLevel = 'Beginner';
    if (skills.some(s => s.level === 'Advanced')) {
      finalLevel = 'Advanced';
    } else if (skills.some(s => s.level === 'Intermediate')) {
      finalLevel = 'Intermediate';
    }

    await apiService.saveSkills(skillNames, finalLevel);
    setLoading(false);
    onComplete(); // This kicks the app cleanly into your ProjectSubmission view!

  } catch (err) {
    setError(err.message || 'Failed to save skill assessment.');
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Skill Assessment Matrix
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Configure your development skills matrix for specialized project planning alignment.
          </p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Interactive Add Skill Block */}
        <form onSubmit={handleAddSkill} className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Add Skill Item</label>
            <input 
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g., Spring Boot, React, JavaScript"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:border-[#0252CD]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 items-end">
            <div className="col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Experience Level</label>
              <select 
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium bg-white text-slate-700 focus:outline-none focus:border-[#0252CD]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <button 
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              + Add
            </button>
          </div>
        </form>

        {/* Live Configured Skills Checklist */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Skills Matrix Stack</label>
          
          {skills.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
              No development skills added yet.
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-all"
                >
                  <span className="text-xs font-bold text-slate-800">{skill.name}</span>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={skill.level}
                      onChange={(e) => handleLevelChange(index, e.target.value)}
                      className="px-2 py-1 border border-slate-200 rounded-lg text-[11px] font-semibold bg-slate-50 text-slate-600 focus:outline-none focus:border-[#0252CD]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-slate-400 hover:text-red-500 text-xs font-bold bg-transparent border-none px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        <button
          type="button"
          disabled={loading}
          onClick={handleSubmitAssessment}
          className="w-full bg-[#0252CD] hover:bg-blue-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Processing Dynamic Diagnostics...' : 'Initialize Feasibility Metrics →'}
        </button>

      </div>
    </div>
  );
}