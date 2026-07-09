import React, { useState } from 'react';
import axios from 'axios';

export default function ProjectSubmission({ setView, user, setUser, theme }) {
  const [projectData, setProjectData] = useState({ title: '', domain: '', description: '' });
  const [status, setStatus] = useState('');
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Pushing blueprint file to Python API pipeline...');

    // Exact Snake_Case Mapping payload corresponding directly to project_idea DB rules
    const payload = {
      student_id: user.id || 1,
      title: projectData.title,
      description: projectData.description,
      domain: projectData.domain,
      status: 'Staged' 
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/projects/submit', payload);
      if (setUser) {
        setUser(prev => ({
          ...prev,
          projects: [...prev.projects, response.data] // Stashes the return model index directly
        }));
      }
      setStatus('✅ Blueprint saved to core database storage.');
      setTimeout(() => setView('profile'), 1000);
    } catch (err) {
      setStatus('❌ Core endpoint transmission failure.');
    }
  };

  return (
    <div className={`p-6 max-w-2xl mx-auto space-y-6 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold">Submit Project Abstract</h2>
      </div>
      <div className={`border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-[#1e1f20] border-[#2d2e30]' : 'bg-white border-gray-200'}`}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Project Title" required className="w-full p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} />
          <input type="text" placeholder="Domain Classification" required className="w-full p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={projectData.domain} onChange={e => setProjectData({...projectData, domain: e.target.value})} />
          <textarea rows="4" placeholder="Abstract Description metrics..." required className="w-full p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl resize-none" value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} />
          {status && <div className="p-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">{status}</div>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setView('profile')} className="px-4 py-2 bg-gray-800 text-xs rounded-xl text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-xs rounded-xl text-white font-semibold">Submit Idea</button>
          </div>
        </form>
      </div>
    </div>
  );
}