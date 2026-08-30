import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function AuthGateway({ onAuthSuccess, setUserProfile, onBackToHome }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mode, setMode] = useState(() => {
    const isReturning = localStorage.getItem('is_returning_user') === 'true';
    return isReturning ? 'LOGIN' : 'REGISTER';
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [mentorName, setMentorName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Captcha State
  const [captchaState, setCaptchaState] = useState('idle'); // 'idle' | 'loading' | 'success'

  const handleCaptchaClick = () => {
    if (captchaState !== 'idle') return;
    setCaptchaState('loading');
    setTimeout(() => {
      setCaptchaState('success');
    }, 500);
  };

  // Wait, let's define a real timeout value
  const triggerCaptcha = () => {
    if (captchaState !== 'idle') return;
    setCaptchaState('loading');
    setTimeout(() => {
      setCaptchaState('success');
    }, 1000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const isFacultyAttempt = email.trim().toLowerCase() === 'faculty' && password === 'faculty';
    if (!isFacultyAttempt && captchaState !== 'success') {
      setError("Please verify the human captcha verification.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Invalid email or password');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('is_returning_user', 'true');
      
      const profile = await apiService.getMe();
      const isFaculty = profile?.role === 'faculty' || profile?.email?.toLowerCase() === 'faculty';

      if (typeof setUserProfile === 'function') {
        setUserProfile({
          fullName: profile.name,
          email: profile.email,
          department: profile.department,
          year: profile.year,
          student_id: profile.student_id,
          skills: profile.skills || [],
          role: profile.role || (isFaculty ? 'faculty' : 'student'),
          experienceLevel: profile.experience_level || 'Intermediate'
        });
      }
      onAuthSuccess(false, isFaculty ? 'faculty' : 'student'); 
    } catch (err) {
      setError(err.message || 'Connection to authentication service failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!department) {
      setError("Please select your academic department");
      return;
    }
    if (!year) {
      setError("Please select your capstone/academic year");
      return;
    }
    if (captchaState !== 'success') {
      setError("Please verify the human captcha verification.");
      return;
    }
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
      localStorage.setItem('is_returning_user', 'true');
      
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
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden font-sans antialiased transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-[#090b11] via-[#1a1230] to-[#0c0817] text-slate-100' 
        : 'bg-gradient-to-b from-white via-[#f3e8ff] to-[#d8b4fe] text-slate-900'
    }`}>
      
      {/* Grid background overlay - matching landing page fading */}
      <div 
        className="absolute inset-x-0 top-0 h-[650px] bg-[size:3rem_3rem] pointer-events-none transition-all duration-300 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          backgroundImage: isDarkMode 
            ? 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.15) 1px, transparent 1px)'
        }}
      ></div>

      {/* Spaced Glowing Backdrop elements */}
      {isDarkMode ? (
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      ) : (
        <div className="absolute top-[10%] left-[10%] w-[800px] h-[750px] bg-gradient-to-tr from-[#d8b4fe]/40 via-[#f5d0fe]/25 to-transparent rounded-full blur-[140px] pointer-events-none z-0"></div>
      )}

      {/* Sticky Glass Navbar with logo and Theme switch */}
      <header className="w-full max-w-5xl mx-auto px-6 pt-5 flex justify-between items-center z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            A
          </div>
          <span className={`font-extrabold text-base tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            AI Academic
          </span>
        </div>

        {/* Theme Switching Toggle Pill */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`relative flex items-center p-0.5 rounded-full border transition-all duration-300 cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-900/90 border-white/10' 
              : 'bg-slate-200/50 border-slate-200'
          }`}
          title="Toggle theme"
        >
          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-300 flex items-center justify-center space-x-1 ${
            !isDarkMode 
              ? 'bg-white text-amber-500 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}>
            <span>☀️</span>
            <span className="hidden sm:inline">Light</span>
          </span>
          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-300 flex items-center justify-center space-x-1 ${
            isDarkMode 
              ? 'bg-slate-800 text-amber-400 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}>
            <span>🌙</span>
            <span className="hidden sm:inline">Dark</span>
          </span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-4xl mx-auto px-6 py-12 space-y-10">
        
        {/* Top Breadcrumb & Heading Block */}
        <div className="text-center space-y-5 max-w-xl mx-auto">
          <div className={`text-xs font-bold tracking-wide uppercase flex items-center justify-center space-x-2 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <button 
              onClick={onBackToHome}
              type="button"
              className={`cursor-pointer transition-colors duration-250 ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-purple-400' 
                  : 'text-slate-500 hover:text-purple-600'
              }`}
            >
              Home
            </button>
            <span>/</span>
            <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>
              {mode === 'REGISTER' ? 'Sign Up' : 'Login'}
            </span>
          </div>

          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-2xl text-[11px] font-bold tracking-wide shadow-sm transition-all duration-300 text-center max-w-md ${
              isDarkMode 
                ? 'bg-purple-950/30 border-purple-800/30 text-purple-400' 
                : 'bg-purple-50 border-purple-100 text-purple-700'
            }`}>
              AI-Guided Academic Project Progress Tracking Platform with Planning & Mentorship Assistance
            </div>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {mode === 'REGISTER' ? 'Sign up for AI Academic' : 'Login to AI Academic'}
          </h1>

          {mode === 'LOGIN' && (
            <p className={`text-xs sm:text-sm font-medium leading-relaxed transition-colors duration-300 ${
              isDarkMode ? 'text-slate-450' : 'text-slate-500'
            }`}>
              Access your project dashboard to track progress, plan milestone targets, and coordinate with AI-guided mentorship agents.
            </p>
          )}
        </div>

        {/* Central Registration Card with shadow glow */}
        <div className={`w-full max-w-lg border rounded-[2.5rem] p-8 sm:p-12 transition-all duration-300 text-left ${
          isDarkMode 
            ? 'bg-[#090b16]/75 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]' 
            : 'bg-white border-slate-200/50 shadow-[0_20px_50px_rgba(168,85,247,0.15)]'
        }`}>
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={mode === 'REGISTER' ? handleRegisterSubmit : handleLoginSubmit} className="space-y-6">
            
            {mode === 'REGISTER' && (
              <>
                {/* Full Name input */}
                <div className="space-y-2">
                  <label className={`block text-xs font-extrabold uppercase tracking-wide ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Name <span className="text-pink-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jordan Avery"
                    className={`w-full px-5 py-3.5 border rounded-2xl text-xs font-semibold transition-all outline-none ${
                      isDarkMode 
                        ? 'bg-slate-950 border-white/10 text-white placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
                        : 'bg-white border-slate-200/70 text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                    }`}
                  />
                </div>

                {/* Academic Department Selector (Dropdown) */}
                <div className="space-y-2">
                  <label className={`block text-xs font-extrabold uppercase tracking-wide ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Academic Department <span className="text-pink-500">*</span>
                  </label>
                  <select
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full px-5 py-3.5 border rounded-2xl text-xs font-bold transition-all outline-none cursor-pointer ${
                      isDarkMode 
                        ? 'bg-slate-950 border-white/10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
                        : 'bg-white border-slate-200/70 text-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                    }`}
                  >
                    <option value="" className={isDarkMode ? 'bg-slate-950 text-slate-500' : 'bg-white text-slate-400'}>Select department</option>
                    <option value="Comp Sci" className={isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}>Comp Sci</option>
                    <option value="Info Tech" className={isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}>Info Tech</option>
                    <option value="ECE Dept" className={isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}>ECE Dept</option>
                    <option value="Other" className={isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'}>Other</option>
                  </select>
                </div>

                {/* Academic Year Selection (Pill grid) */}
                <div className="space-y-2">
                  <label className={`block text-xs font-extrabold uppercase tracking-wide ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Capstone Year / Year <span className="text-pink-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1", "2", "3", "4"].map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setYear(y)}
                        className={`py-2 px-3 border rounded-2xl text-[10px] font-extrabold transition-all duration-200 cursor-pointer text-center ${
                          year === y
                            ? (isDarkMode 
                                ? 'bg-purple-950/40 border-purple-500 text-purple-400 shadow-md shadow-purple-500/10'
                                : 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm')
                            : (isDarkMode
                                ? 'bg-slate-950 border-white/10 text-slate-400 hover:bg-slate-900'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')
                        }`}
                      >
                        {y}st Year
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mentor Advisor input */}
                <div className="space-y-2">
                  <label className={`block text-xs font-extrabold uppercase tracking-wide ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Mentor Advisor Name <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={mentorName} 
                    onChange={(e) => setMentorName(e.target.value)}
                    placeholder="Enter your advisor name"
                    className={`w-full px-5 py-3.5 border rounded-2xl text-xs font-semibold transition-all outline-none ${
                      isDarkMode 
                        ? 'bg-slate-950 border-white/10 text-white placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
                        : 'bg-white border-slate-200/70 text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                    }`}
                  />
                </div>
              </>
            )}

            {/* Email input */}
            <div className="space-y-2">
              <label className={`block text-xs font-extrabold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Email / Username <span className="text-pink-500">*</span>
              </label>
              <input 
                type="text" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'LOGIN' ? "Email address or 'faculty'" : "jordan@institution.edu"}
                className={`w-full px-5 py-3.5 border rounded-2xl text-xs font-semibold transition-all outline-none ${
                  isDarkMode 
                    ? 'bg-slate-950 border-white/10 text-white placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
                    : 'bg-white border-slate-200/70 text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                }`}
              />
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <label className={`block text-xs font-extrabold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Password <span className="text-pink-500">*</span>
              </label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'REGISTER' ? "Create a password" : "Enter your password"}
                className={`w-full px-5 py-3.5 border rounded-2xl text-xs font-semibold transition-all outline-none ${
                  isDarkMode 
                    ? 'bg-slate-950 border-white/10 text-white placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
                    : 'bg-white border-slate-200/70 text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                }`}
              />
            </div>

            {/* Confirm Password (Registration only) */}
            {mode === 'REGISTER' && (
              <div className="space-y-2">
                <label className={`block text-xs font-extrabold uppercase tracking-wide ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Confirm Password <span className="text-pink-500">*</span>
                </label>
                <input 
                  type="password" 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full px-5 py-3.5 border rounded-2xl text-xs font-semibold transition-all outline-none ${
                    isDarkMode 
                      ? 'bg-slate-950 border-white/10 text-white placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
                      : 'bg-white border-slate-200/70 text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                  }`}
                />
              </div>
            )}

            {/* Mock Captcha Section - Interactive reCAPTCHA Checkbox */}
            <div className="space-y-2">
              <label className={`block text-xs font-extrabold uppercase tracking-wide ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Captcha — verify you're human <span className="text-pink-500">*</span>
              </label>
              
              <div 
                onClick={triggerCaptcha}
                className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors max-w-sm ${
                  isDarkMode 
                    ? 'bg-slate-950/80 border-white/10 hover:bg-slate-900' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${
                    captchaState === 'success' 
                      ? 'bg-emerald-500 border-emerald-500 text-white font-bold' 
                      : (isDarkMode ? 'bg-slate-900 border-white/20' : 'bg-white border-slate-300')
                  }`}>
                    {captchaState === 'success' && '✓'}
                    {captchaState === 'loading' && (
                      <span className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
                    )}
                  </div>
                  <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    I'm not a robot
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                  <span className="text-[7px] font-black text-slate-400 mt-1 uppercase">reCAPTCHA</span>
                </div>
              </div>
            </div>

            {/* Remember Me and Forgot Password (Login Mode only) */}
            {mode === 'LOGIN' && (
              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-500 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 rounded border-slate-350 focus:ring-purple-500 bg-white" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-xs font-bold text-purple-600 hover:underline">Forgot Password?</button>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-[size:200%_auto] hover:bg-[right_center] text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-purple-500/10 transition-all duration-500 cursor-pointer text-center flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>✨</span>
                    <span>{mode === 'REGISTER' ? 'Sign Up for AI Academic' : 'Login to AI Academic'}</span>
                  </>
                )}
              </button>
            </div>



          </form>
        </div>

        {/* Switch Mode toggle footer */}
        <div className="text-center text-xs font-bold text-slate-500">
          {mode === 'REGISTER' ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => { setMode(mode === 'REGISTER' ? 'LOGIN' : 'REGISTER'); setError(''); setCaptchaState('idle'); }}
            className={`font-black hover:underline cursor-pointer ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}
          >
            {mode === 'REGISTER' ? 'Login' : 'Register'}
          </button>
        </div>

      </main>
      
      {/* Footer copyright */}
      <footer className="py-8 text-center text-[10px] text-slate-400 font-bold">
        © 2026 AI-Guided Academic Project Progress Tracking Platform. All rights reserved.
      </footer>

    </div>
  );
}