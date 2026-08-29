import React, { useState } from 'react';

// --- Vector Icons ---
const RocketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.56 1.63-2.5l5.87-5.87A7 7 0 0 0 21 3s-3.5 0-6.13 6l-5.87 5.87c-.94.37-1.79.92-2.5 1.63z" />
    <circle cx="15" cy="9" r="1" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 1 1.71 3h16.94a2 2 0 0 1 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function ProjectSubmission({ onSubmitSuccess, onBack, currentTheme = 'pastel' }) {
  const isDark = currentTheme === 'dark';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    try {
      const techArray = typeof technologies === 'string'
        ? technologies.split(',').map(t => t.trim()).filter(Boolean)
        : (Array.isArray(technologies) ? technologies : []);

      const response = await fetch('http://localhost:8000/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: title.trim(), 
          description: description.trim(), 
          domain: domain.trim(),
          technologies: techArray 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit project proposal.');
      }

      const data = await response.json();
      setLoading(false);
      
      // Execute callback to app.jsx to trigger agent initialization & navigate
      if (typeof onSubmitSuccess === 'function') {
        const projectId = typeof data === 'object' ? (data.project_id || data.id || data) : data;
        onSubmitSuccess(projectId);
      }
    } catch (err) {
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* HARMONIZED GLASSMORPHIC CONTAINER CARD */}
      <div className={`backdrop-blur-xl border rounded-3xl shadow-xl p-8 md:p-10 space-y-8 relative overflow-hidden ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50' : 'bg-white/75 border-white/80 text-slate-900 shadow-sky-950/5'
      }`}>
        
        {/* TOP GRADIENT ACCENT STRIP */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-[#0252CD] to-pink-500"></div>

        {/* HEADER SECTION */}
        <div className={`border-b pb-5 flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100/80'}`}>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-xl shadow-md shadow-sky-500/20">
                <RocketIcon />
              </span>
              <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Submit Capstone Project Idea
              </h2>
            </div>
            <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Provide your proposed system title, problem statement, domain, and target stack to launch multi-agent AI evaluation.
            </p>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 bg-rose-50/90 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center space-x-2.5 shadow-sm">
            <AlertTriangleIcon />
            <span>{error}</span>
          </div>
        )}

        {/* PROPOSAL FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TITLE INPUT */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Project Title</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#0252CD]/20 focus:border-[#0252CD] outline-none transition-all shadow-xs ${
                isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white/90 border-slate-200/80 text-slate-800'
              }`} 
              placeholder="e.g., Real-Time Distributed Chat & Advisory Engine" 
            />
          </div>

          {/* DESCRIPTION TEXTAREA */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Problem Statement & Scope</label>
            <textarea 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-3 border rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#0252CD]/20 focus:border-[#0252CD] outline-none transition-all h-36 resize-none leading-relaxed shadow-xs ${
                isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white/90 border-slate-200/80 text-slate-800'
              }`} 
              placeholder="Describe the problem, target audience, core modules, architecture vision, and expected deliverables..." 
            />
          </div>

          {/* DOMAIN AND TECH STACK GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className={`block text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Primary Engineering Domain</label>
              <select 
                required 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className={`w-full px-4 py-3 border rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#0252CD]/20 focus:border-[#0252CD] outline-none transition-all cursor-pointer shadow-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white/90 border-slate-200/80 text-slate-800'
                }`}
              >
                <option value="">Select Domain</option>
                <option value="Cloud & Distributed Systems">Cloud & Distributed Systems</option>
                <option value="Healthcare AI">Healthcare AI</option>
                <option value="Environmental AI">Environmental AI</option>
                <option value="FinTech">FinTech</option>
                <option value="LegalTech">LegalTech</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={`block text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Target Tech Stack (Comma Separated)</label>
              <input 
                type="text" 
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className={`w-full px-4 py-3 border rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#0252CD]/20 focus:border-[#0252CD] outline-none transition-all shadow-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white/90 border-slate-200/80 text-slate-800'
                }`} 
                placeholder="Spring Boot, SockJS, PostgreSQL, React" 
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100/80">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className={`px-5 py-3 border rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#0252CD] to-indigo-600 hover:shadow-lg hover:shadow-sky-500/25 text-white font-bold rounded-2xl text-xs transition-all flex items-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Running AI Diagnostics & Generating Feasibility Roadmap...</span>
                </>
              ) : (
                <>
                  <span>Submit Proposal for Evaluation</span>
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}