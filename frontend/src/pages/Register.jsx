import React, { useState } from 'react';
import axios from 'axios';

export default function Register({ setView, onAuthSuccess, theme }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', year: 1 });
  const [error, setError] = useState('');
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        year: parseInt(formData.year) // Force integer parsed metrics
      });
      onAuthSuccess(response.data.student);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration pipeline rejected data payload.');
    }
  };

  return (
    <div className={`h-screen w-screen flex items-center justify-center transition-colors ${isDark ? 'bg-[#111214]' : 'bg-gray-100'}`}>
      <div className={`p-6 rounded-2xl border max-w-md w-full space-y-5 ${isDark ? 'bg-[#1e1f20] border-[#2d2e30]' : 'bg-white border-gray-200 shadow-xl'}`}>
        <div className="text-center">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Workspace Profile</h2>
          <button onClick={() => setView('login')} className="text-xs text-indigo-500 hover:underline">Already registered? Sign in here</button>
        </div>
        {error && <div className="p-2.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input type="text" placeholder="Full Name" required className="w-full p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" required className="w-full p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="e.g. CS" required className="p-2 bg-[#131314] text-white text-xs border border-gray-800 rounded-xl" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
            <select className="p-2 bg-[#131314] text-gray-300 text-xs border border-gray-800 rounded-xl" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}>
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white text-xs font-semibold p-2.5 rounded-xl hover:bg-indigo-700">Register Profile</button>
        </form>
      </div>
    </div>
  );
}