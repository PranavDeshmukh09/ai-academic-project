import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function ProfileView({ userProfile, onProfileUpdate, currentTheme = 'pastel' }) {
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editedSkills, setEditedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isDark = currentTheme === 'dark';

  const handleOpenEdit = () => {
    setEditedSkills(userProfile?.skills || []);
    setError('');
    setIsEditingSkills(true);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (editedSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setError('Skill already exists.');
      return;
    }
    setEditedSkills([...editedSkills, trimmed]);
    setNewSkill('');
    setError('');
  };

  const handleDeleteSkill = (skillToDelete) => {
    setEditedSkills(editedSkills.filter(s => s !== skillToDelete));
  };

  const handleSaveSkills = async () => {
    setSaving(true);
    setError('');
    try {
      await apiService.saveSkills(editedSkills, userProfile?.experienceLevel || 'Intermediate');
      if (typeof onProfileUpdate === 'function') {
        await onProfileUpdate();
      }
      setIsEditingSkills(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update skills. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className={`border rounded-2xl shadow-sm overflow-hidden ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-[#0252CD] to-blue-400"></div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Avatar */}
              <div className={`-mt-12 w-24 h-24 rounded-2xl p-1 shadow-md flex-shrink-0 z-10 ${
                isDark ? 'bg-slate-900' : 'bg-white'
              }`}>
                <div className="w-full h-full bg-[#0252CD] rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                  {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'S'}
                </div>
              </div>
              
              <div className="pt-2 sm:pt-0">
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{userProfile?.fullName || 'Student Name'}</h1>
                <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{userProfile?.email || 'student@university.edu'}</p>
              </div>
            </div>
            
            <button className={`px-4 py-2 border font-bold text-sm rounded-xl transition-colors cursor-pointer self-start sm:self-auto mt-4 sm:mt-0 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}>
              Edit Profile
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</label>
                <div className={`mt-1 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Student</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</label>
                <div className={`mt-1 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{userProfile?.department || 'Not specified'}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Year of Study</label>
                <div className={`mt-1 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Year {userProfile?.year || '1'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Mentor</label>
                <div className="mt-1 flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">M</div>
                  <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Mentor Name (Pending)</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessed Skills</label>
                  <button 
                    onClick={handleOpenEdit}
                    className="text-xs font-bold text-[#0252CD] hover:underline cursor-pointer bg-transparent border-none outline-none"
                  >
                    Edit Skills
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile?.skills && userProfile.skills.length > 0 ? (
                    userProfile.skills.map(skill => (
                      <span key={skill} className={`px-2 py-1 text-xs font-bold rounded-lg border ${
                        isDark ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-blue-50 text-[#0252CD] border-blue-100'
                      }`}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-xs block mt-1">No assessed skills yet. Complete your skills assessment.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Edit Skills Modal overlay */}
      {isEditingSkills && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`rounded-3xl border shadow-2xl w-full max-w-md p-6 overflow-hidden relative animate-in zoom-in-95 duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="space-y-4">
              <div className={`flex justify-between items-center pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <h3 className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>Edit Assessed Skills</h3>
                <button 
                  onClick={() => setIsEditingSkills(false)}
                  className={`hover:text-slate-600 text-lg cursor-pointer bg-transparent border-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`}
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {/* Add New Skill form */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Type a skill (e.g., Docker, SQL)..."
                  className={`flex-1 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-[#0252CD] transition-all outline-none border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  type="submit"
                  className="bg-[#0252CD] hover:bg-blue-700 text-white rounded-xl px-4 py-2 font-bold text-xs shadow-sm transition-colors cursor-pointer border-none"
                >
                  Add
                </button>
              </form>

              {/* Dynamic tag container */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Skills Tag Cloud</label>
                <div className={`border rounded-2xl p-4 min-h-[100px] max-h-[200px] overflow-y-auto flex flex-wrap gap-2 ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-200'
                }`}>
                  {editedSkills.length > 0 ? (
                    editedSkills.map(skill => (
                      <span key={skill} className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border shadow-sm flex items-center space-x-1.5 ${
                        isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-white text-slate-700 border-slate-250'
                      }`}>
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(skill)}
                          className="text-red-500 hover:text-red-700 text-[10px] font-bold focus:outline-none cursor-pointer bg-transparent border-none"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-xs m-auto">No skills added yet. Type one above!</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-3 border-t justify-end ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setIsEditingSkills(false)}
                  className={`px-4 py-2.5 font-bold rounded-xl text-xs transition-colors cursor-pointer border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSkills}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#0252CD] to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2 border-none"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}