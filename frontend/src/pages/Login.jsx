import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setView, onAuthSuccess, theme }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login', formData);
      // Backend returns a TokenResponse with nested student data object containing student_id
      onAuthSuccess(response.data.student); 
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid authentication parameters.');
    }
  };

  return (
    <div className={`h-screen w-screen flex items-center justify-center transition-colors ${isDark ? 'bg-[#111214]' : 'bg-gray-100'}`}>
      <div className={`p-8 rounded-2xl border max-w-sm w-full space-y-6 ${isDark ? 'bg-[#1e1f20] border-[#2d2e30]' : 'bg-white border-gray-200 shadow-xl'}`}>
        <div className="text-center">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sign in to AI-Academic</h2>
          <button onClick={() => setView('register')} className="text-xs text-indigo-500 mt-1 hover:underline">or create a new workspace account</button>
        </div>
        {error && <div className="p-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400">Email address</label>
            <input type="email" required className="w-full mt-1 p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400">Password</label>
            <input type="password" required className="w-full mt-1 p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white text-xs font-semibold p-2.5 rounded-xl hover:bg-indigo-700">Access Workspace</button>
        </form>
      </div>
    </div>
  );
}