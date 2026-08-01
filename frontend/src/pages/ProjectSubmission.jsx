import React, { useState } from 'react';

export default function ProjectSubmission({ onSubmitSuccess, onBack }) {
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
      const response = await fetch('http://localhost:8000/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: title, 
          description: description, 
          domain: domain,
          technologies: technologies.split(',').map(t => t.trim()).filter(Boolean) 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to submit project.');
      }

      onSubmitSuccess(); 
    } catch (err) {
      setError(err.message || 'Failed to submit project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Submit New Project
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the details below to initialize your new AI project and get mentor matching.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Project Title</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] focus:border-[#0252CD] outline-none transition-all" 
              placeholder="e.g., AI Vayu Kavach" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Project Description</label>
            <textarea 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] focus:border-[#0252CD] outline-none transition-all h-32 resize-none" 
              placeholder="Describe the core problem your project solves and its key features..." 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Primary Domain</label>
              <select 
                required 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] outline-none bg-white transition-all"
              >
                <option value="">Select a domain</option>
                <option value="Healthcare AI">Healthcare AI</option>
                <option value="Environmental AI">Environmental AI</option>
                <option value="FinTech">FinTech</option>
                <option value="LegalTech">LegalTech</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Core Technologies</label>
              <input 
                type="text" 
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] outline-none transition-all" 
                placeholder="e.g., Python, TensorFlow, React (comma separated)" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-2.5 bg-[#0252CD] hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center space-x-2"
            >
              <span>{loading ? 'Submitting...' : 'Submit Project'}</span>
              {!loading && <span>→</span>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}