import React, { useState } from 'react';

export default function Profile({ setView, user, setUser, theme }) {
  const checkedSkills = user?.skills || [];
  const submittedProjects = user?.projects || [];

  const [editingIndex, setEditingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', domain: '', description: '' });
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);

  const startEditing = (idx, project) => {
    setEditingIndex(idx);
    setEditFormData({ ...project });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    if (setUser) {
      setUser((prevUser) => {
        const updatedProjects = [...prevUser.projects];
        updatedProjects[editingIndex] = editFormData;
        return { ...prevUser, projects: updatedProjects };
      });
    }
    setEditingIndex(null);
  };

  const handleDeleteProject = () => {
    if (setUser && deleteTargetIndex !== null) {
      setUser((prevUser) => ({
        ...prevUser,
        projects: prevUser.projects.filter((_, idx) => idx !== deleteTargetIndex)
      }));
    }
    setDeleteTargetIndex(null);
  };

  const isDark = theme === 'dark';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 relative">
      
      {/* Welcome Banner Card */}
      <div className={`border rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-gradient-to-r from-indigo-950 to-neutral-900 border-indigo-500/20' : 'bg-gradient-to-r from-indigo-50 to-white border-indigo-200'
      }`}>
        <p className={`text-xs font-mono tracking-widest uppercase ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>System Core Dashboard</p>
        <h2 className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome back, {user?.name || 'Pranav'}</h2>
        <p className={`text-xs mt-1 max-w-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Your AI profile matrices are active. Update your tech configurations or explore system orchestration recommendations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 1/3: Technical Capability Matrix */}
        <div className={`border rounded-2xl p-5 md:col-span-1 h-fit transition-all duration-300 ${
          isDark ? 'bg-[#1e1f20] border-[#2d2e30]' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xs font-mono uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Verified Stack</h3>
            <button onClick={() => setView('assessment')} className="text-[10px] text-indigo-500 font-semibold hover:underline">Edit Matrix</button>
          </div>
          
          {checkedSkills.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4">No framework metrics registered.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {checkedSkills.map((skill) => (
                <span key={skill} className={`px-2.5 py-1 text-[11px] font-medium border rounded-md ${
                  isDark ? 'bg-[#131314] text-gray-300 border-gray-800' : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right 2/3: Active Project Blueprints */}
        <div className={`border rounded-2xl p-5 md:col-span-2 space-y-4 transition-all duration-300 ${
          isDark ? 'bg-[#1e1f20] border-[#2d2e30]' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center">
            <h3 className={`text-xs font-mono uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Project Files</h3>
            <button onClick={() => setView('project')} className="text-xs px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
              + Propose Idea
            </button>
          </div>

          {submittedProjects.length === 0 ? (
            <div className={`text-center py-12 border border-dashed rounded-xl ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
              <p className="text-xs text-gray-400 italic">No registered blueprints inside current stack workspace.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submittedProjects.map((proj, idx) => (
                <div key={idx} className={`p-4 border rounded-xl relative group transition-all ${
                  isDark ? 'bg-[#131314] border-[#2d2e30] hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm'
                }`}>
                  
                  {editingIndex === idx ? (
                    <form onSubmit={handleUpdateProject} className="space-y-3 mt-1">
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase">Title</label>
                        <input 
                          type="text" 
                          value={editFormData.title} 
                          onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                          className={`mt-1 w-full border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                            isDark ? 'bg-[#1e1f20] border-[#2d2e30] text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase">Domain</label>
                        <input 
                          type="text" 
                          value={editFormData.domain} 
                          onChange={(e) => setEditFormData({ ...editFormData, domain: e.target.value })}
                          className={`mt-1 w-full border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                            isDark ? 'bg-[#1e1f20] border-[#2d2e30] text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase">Abstract Description</label>
                        <textarea 
                          rows="3"
                          value={editFormData.description} 
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          className={`mt-1 w-full border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none ${
                            isDark ? 'bg-[#1e1f20] border-[#2d2e30] text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-1">
                        <button type="button" onClick={cancelEditing} className="px-2.5 py-1 text-[11px] bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-2.5 py-1 text-[11px] bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Save Changes</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex justify-between items-start pr-16">
                        <h4 className={`text-sm font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{proj.title}</h4>
                        <span className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 rounded font-mono font-medium">
                          {proj.domain || 'General'}
                        </span>
                      </div>
                      <p className={`text-xs mt-2 leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{proj.description}</p>
                      
                      <div className="absolute top-4 right-4 flex space-x-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditing(idx, proj)}
                          className={`p-1 text-xs border rounded-md transition-colors ${
                            isDark ? 'bg-[#1e1f20] border-[#2d2e30] text-gray-400 hover:text-indigo-400' : 'bg-white border-gray-200 text-gray-500 hover:text-indigo-600'
                          }`}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => setDeleteTargetIndex(idx)}
                          className={`p-1 text-xs border rounded-md transition-colors ${
                            isDark ? 'bg-[#1e1f20] border-[#2d2e30] text-gray-400 hover:text-red-500' : 'bg-white border-gray-200 text-gray-500 hover:text-red-500'
                          }`}
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Deletion Dialog Box */}
      {deleteTargetIndex !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`border max-w-sm w-full rounded-2xl p-5 shadow-2xl space-y-4 ${
            isDark ? 'bg-[#1e1f20] border-red-500/20' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 text-red-500">
              <span className="text-xl">⚠️</span>
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Irreversible File Purge</h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you absolutely sure you want to terminate this operational engineering concept blueprint? 
              <span className="text-red-500 block font-semibold mt-1">This metrics payload cannot be retrieved once purged.</span>
            </p>
            <div className="flex justify-end space-x-2 pt-2 border-t border-gray-700">
              <button onClick={() => setDeleteTargetIndex(null)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-600">Abort</button>
              <button onClick={handleDeleteProject} className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Confirm Deletion</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}