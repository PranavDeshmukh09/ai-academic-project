import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function AuthGateway({ onAuthSuccess, setUserProfile }) {
  const [mode, setMode] = useState('LOGIN');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [mentorName, setMentorName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Invalid email or password');
      }

      localStorage.setItem('access_token', data.access_token);
      
      // Retrieve full student profile from backend
      const profile = await apiService.getMe();
      if (typeof setUserProfile === 'function') {
        setUserProfile({
          fullName: profile.name,
          email: profile.email,
          department: profile.department,
          year: profile.year,
          student_id: profile.student_id,
          skills: profile.skills || []
        });
      }
      onAuthSuccess(false); 
    } catch (err) {
      setError(err.message || 'Connection to authentication service failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: fullName,
          department,
          year: parseInt(year) || 1,
          mentor_name: mentorName || null
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed.');
      }

      localStorage.setItem('access_token', data.access_token);
      
      // Retrieve full student profile from backend
      const profile = await apiService.getMe();
      if (typeof setUserProfile === 'function') {
        setUserProfile({
          fullName: profile.name,
          email: profile.email,
          department: profile.department,
          year: profile.year,
          student_id: profile.student_id,
          skills: profile.skills || []
        });
      }
      onAuthSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex overflow-hidden min-h-[600px]">
        
        {/* Left Side Branding Panel */}
        <div className="hidden lg:flex w-5/12 bg-[#0252CD] p-12 flex-col justify-between relative text-white">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0252CD] text-lg font-black shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>
              </div>
              <span className="text-xl font-bold tracking-tight">AI Academic<br/>Project Mentor</span>
            </div>

            {mode === 'LOGIN' ? (
              <>
                <h1 className="text-4xl font-bold leading-tight">
                  Empower Your Ideas<br/>Build Smarter Projects<br/>with AI Guidance
                </h1>
                <p className="text-blue-100 text-sm mt-4 leading-relaxed max-w-sm">
                  Plan, build, and succeed in your academic journey with the power of AI.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold leading-tight">
                  Create Your<br/>Account
                </h1>
                <p className="text-blue-100 text-sm mt-4 leading-relaxed max-w-sm">
                  Join us and start your AI-powered project mentorship journey.
                </p>
              </>
            )}
          </div>
          
          {/* Abstract background shapes/placeholder for illustration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-40 -right-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="w-full lg:w-7/12 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                {mode === 'LOGIN' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-sm text-slate-500">
                {mode === 'LOGIN' ? 'Login to continue your journey' : 'Fill in your details to get started'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold text-center">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={mode === 'LOGIN' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
              
              {mode === 'REGISTER' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">👤</span>
                      <input 
                        type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] focus:border-[#0252CD] outline-none" 
                        placeholder="Enter your full name" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-slate-700">Department</label>
                      <select required value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] outline-none bg-white">
                        <option value="">Select department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics">Electronics</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-slate-700">Year / Semester</label>
                      <select required value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] outline-none bg-white">
                        <option value="">Select year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Mentor Name (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">🧑‍🏫</span>
                      <input 
                        type="text" value={mentorName} onChange={(e) => setMentorName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] outline-none" 
                        placeholder="Enter mentor name" 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">✉️</span>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] outline-none" 
                    placeholder="Enter your email" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">🔒</span>
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] outline-none" 
                    placeholder={mode === 'LOGIN' ? 'Enter your password' : 'Create a password'} 
                  />
                </div>
              </div>

              {mode === 'REGISTER' && (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">🔒</span>
                    <input 
                      type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0252CD] outline-none" 
                      placeholder="Confirm your password" 
                    />
                  </div>
                </div>
              )}

              {mode === 'LOGIN' && (
                <div className="flex justify-between items-center pt-2">
                  <label className="flex items-center space-x-2 text-sm text-slate-600">
                    <input type="checkbox" className="w-4 h-4 text-[#0252CD] rounded border-slate-300 focus:ring-[#0252CD]" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-sm font-semibold text-[#0252CD] hover:underline">Forgot Password?</button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#0252CD] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 mt-6"
              >
                {loading ? 'Processing...' : mode === 'LOGIN' ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="text-center text-sm font-medium text-slate-600 pt-4">
              {mode === 'LOGIN' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setError(''); }}
                className="text-[#0252CD] hover:underline font-bold"
              >
                {mode === 'LOGIN' ? 'Register' : 'Login'}
              </button>
            </div>
            
            {mode === 'LOGIN' && (
               <div className="text-center text-xs text-slate-400 pt-8">
                 © 2024 AI Academic Project Mentor
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}