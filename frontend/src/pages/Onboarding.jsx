import React, { useState } from 'react';
import axios from 'axios';

export default function Onboarding({ theme, toggleTheme }) {
  const [formData, setFormData] = useState({
    student_id: Math.floor(Math.random() * 10000), 
    name: '',
    department: '',
    year: '1',
    skills: '',
    experience_level: 'Beginner',
    project_title: '',
    project_description: '',
    project_domain: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [retrievedData, setRetrievedData] = useState(null);
  
  const isDark = theme === 'dark';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Submitting onboarding data...' });
    setRetrievedData(null);
    
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      
      const response = await axios.post('http://127.0.0.1:8000/onboard', payload);
      setStatus({ type: 'success', message: response.data.message });
      
      setTimeout(async () => {
        try {
          const res = await axios.get(`http://127.0.0.1:8000/student/${formData.student_id}`);
          setRetrievedData(res.data);
          setStatus({ type: 'success', message: 'Data pushed and retrieved successfully.' });
        } catch (err) {
          setStatus({ type: 'error', message: 'Pushed data but failed to retrieve.' });
        }
      }, 1000);
      
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Failed to submit data.' });
    }
  };

  const inputGroupClass = `relative border-b-2 transition-all duration-300 focus-within:border-premium-royal ${
    isDark ? 'border-gray-700/50' : 'border-gray-300/50'
  }`;

  const inputClass = `w-full bg-transparent border-none py-3 px-1 text-sm font-medium focus:ring-0 focus:outline-none placeholder-transparent peer ${
    isDark ? 'text-white' : 'text-premium-slate'
  }`;

  const labelClass = `absolute left-1 top-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 transform -translate-y-7 scale-90 origin-left opacity-50 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:opacity-40 peer-focus:-translate-y-7 peer-focus:scale-90 peer-focus:text-premium-royal peer-focus:opacity-100 ${
    isDark ? 'text-white' : 'text-premium-slate'
  }`;

  return (
    <div className="w-full max-w-3xl mx-auto px-8 py-16 lg:px-16 lg:py-24 animate-fade-in-up">
      
      {/* Mobile Header (Hidden on Desktop since it has the left panel) */}
      <div className="lg:hidden flex items-center justify-between mb-12">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-premium-royal to-premium-violet shadow-lg shadow-premium-royal/30"></div>
          <span className="font-serif text-lg font-bold">AI Academic</span>
        </div>
        <button onClick={toggleTheme} className="text-xs font-bold uppercase opacity-50">Toggle Theme</button>
      </div>

      <div className="mb-16">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-premium-royal">Step 1 of 1</h2>
        <h3 className="text-3xl font-serif font-bold">Initialize Profile</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className={`md:col-span-2 ${inputGroupClass}`}>
            <input required type="text" name="name" id="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className={inputClass} />
            <label htmlFor="name" className={labelClass}>Official Full Name</label>
          </div>
          <div className={inputGroupClass}>
            <input required type="text" name="department" id="department" placeholder="Department" value={formData.department} onChange={handleChange} className={inputClass} />
            <label htmlFor="department" className={labelClass}>Department (e.g. CS)</label>
          </div>
          <div className={inputGroupClass}>
            <select name="year" id="year" value={formData.year} onChange={handleChange} className={inputClass}>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
            <label htmlFor="year" className={`absolute left-1 -top-3 text-sm font-bold uppercase tracking-widest scale-90 origin-left text-premium-royal`}>Year of Study</label>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-6">
          <div className={`md:col-span-2 ${inputGroupClass}`}>
            <input required type="text" name="skills" id="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} className={inputClass} />
            <label htmlFor="skills" className={labelClass}>Core Competencies (Comma separated)</label>
          </div>
          <div className={`md:col-span-2 ${inputGroupClass}`}>
            <select name="experience_level" id="experience_level" value={formData.experience_level} onChange={handleChange} className={inputClass}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <label htmlFor="experience_level" className={`absolute left-1 -top-3 text-sm font-bold uppercase tracking-widest scale-90 origin-left text-premium-royal`}>Overall Experience Level</label>
          </div>
        </div>

        {/* Project Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-6">
          <div className={inputGroupClass}>
            <input required type="text" name="project_title" id="project_title" placeholder="Project Title" value={formData.project_title} onChange={handleChange} className={inputClass} />
            <label htmlFor="project_title" className={labelClass}>Proposed Title</label>
          </div>
          <div className={inputGroupClass}>
            <input required type="text" name="project_domain" id="project_domain" placeholder="Domain" value={formData.project_domain} onChange={handleChange} className={inputClass} />
            <label htmlFor="project_domain" className={labelClass}>Industry Domain</label>
          </div>
          <div className={`md:col-span-2 ${inputGroupClass}`}>
            <textarea required name="project_description" id="project_description" placeholder="Abstract" value={formData.project_description} onChange={handleChange} rows="3" className={`${inputClass} resize-none py-4`} />
            <label htmlFor="project_description" className={labelClass}>Technical Abstract / Description</label>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-8">
          <button type="submit" className="group relative w-full md:w-auto overflow-hidden rounded-xl bg-gradient-to-r from-premium-royal to-premium-violet px-10 py-4 font-bold text-white shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_-15px_rgba(124,58,237,0.7)]">
            <span className="relative z-10 flex items-center justify-center space-x-2 text-sm uppercase tracking-widest">
              <span>Commit Payload</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>
        
        {status.message && (
          <div className={`p-5 rounded-2xl text-sm font-bold border ${
            status.type === 'error' ? 'border-premium-crimson/30 text-premium-crimson bg-premium-crimson/5' : 
            status.type === 'success' ? 'border-premium-emerald/30 text-premium-emerald bg-premium-emerald/5' :
            'border-premium-royal/30 text-premium-royal bg-premium-royal/5'
          }`}>
            {status.message}
          </div>
        )}
      </form>

      {/* Retrieved Data Display Widget */}
      {retrievedData && (
        <div className={`mt-20 p-10 rounded-3xl animate-slide-in-right relative overflow-hidden ${
          isDark ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 shadow-2xl' : 'bg-white border border-gray-200 shadow-2xl shadow-premium-slate/5'
        }`}>
          {/* Decorative Background Blob */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-premium-royal/10 blur-[50px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10 border-b pb-6 border-current opacity-80">
              <div className="h-2 w-2 rounded-full bg-premium-emerald animate-pulse"></div>
              <h3 className="font-serif text-2xl font-bold">System Validation</h3>
            </div>
            
            <div className="space-y-8">
              {[
                { title: 'Identity Record', data: retrievedData.student_profile },
                { title: 'Skill Matrix', data: retrievedData.skill_assessment },
                { title: 'Project Scope', data: retrievedData.project_idea }
              ].map((section, i) => (
                <div key={i}>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 opacity-50 text-premium-royal">
                    // {section.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(section.data).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest opacity-40 mb-1">{key.replace('_', ' ')}</span>
                        <span className="text-sm font-medium">
                          {Array.isArray(value) ? value.join(', ') : (value === null ? 'N/A' : value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
