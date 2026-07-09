import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import ProjectSubmission from './pages/ProjectSubmission';

export default function App() {
  const [view, setView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState({
    id: null, // Will be populated with real student_id from backend
    name: '',
    email: '',
    department: '',
    year: '',
    skills: [],
    projects: []
  });

  const handleAuthSuccess = (viewTarget, userData) => {
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      id: userData.student_id, // Map database student_id here
      name: userData.name,
      email: userData.email,
      department: userData.department,
      year: userData.year,
      projects: userData.projects || [],
      skills: userData.skills || []
    }));
    setView(viewTarget);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderMainContent = () => {
    switch (view) {
      case 'profile': return <Profile setView={setView} user={user} setUser={setUser} theme={theme} />;
      case 'assessment': return <Assessment setView={setView} user={user} setUser={setUser} theme={theme} />;
      case 'project': return <ProjectSubmission setView={setView} user={user} setUser={setUser} theme={theme} />;
      default: return <Profile setView={setView} user={user} setUser={setUser} theme={theme} />;
    }
  };

  if (!isAuthenticated) {
    if (view === 'register') {
      return <Register setView={setView} onAuthSuccess={(data) => handleAuthSuccess('assessment', data)} theme={theme} />;
    }
    return <Login setView={setView} onAuthSuccess={(data) => handleAuthSuccess('profile', data)} theme={theme} />;
  }

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#111214] text-gray-200' : 'bg-gray-100 text-gray-800'
    }`}>
      <aside className={`w-64 border-r flex flex-col justify-between transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#1e1f20] border-[#2d2e30]' : 'bg-white border-gray-200'
      }`}>
        <div>
          <div className={`p-5 flex items-center space-x-2 border-b ${theme === 'dark' ? 'border-[#2d2e30]' : 'border-gray-100'}`}>
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-50 to-indigo-600" />
            <span className={`font-semibold tracking-wide text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI-Academic</span>
          </div>
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'profile', label: 'Dashboard Home', icon: '⚡' },
              { id: 'assessment', label: 'Skill Matrix', icon: '🧠' },
              { id: 'project', label: 'Propose Architecture', icon: '🚀' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  view === item.id
                    ? theme === 'dark' ? 'bg-[#2d2e30] text-white' : 'bg-gray-100 text-gray-900 font-semibold'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-[#232425]' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-col">
          <div className={`px-4 py-2 border-t flex items-center justify-between ${theme === 'dark' ? 'border-[#2d2e30] bg-[#1a1b1c]' : 'border-gray-100 bg-gray-50'}`}>
            <span className="text-[10px] uppercase font-mono text-gray-400">Theme Mode</span>
            <button onClick={toggleTheme} className={`p-1.5 rounded-lg border text-xs ${theme === 'dark' ? 'bg-[#2d2e30] border-gray-700 text-yellow-400' : 'bg-white border-gray-200 text-indigo-600'}`}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          <div className={`p-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-[#2d2e30] bg-[#1a1b1c]' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-center space-x-3 truncate">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                {user.name ? user.name.charAt(0) : 'P'}
              </div>
              <div className="truncate">
                <p className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name || 'Anonymous Student'}</p>
                <button onClick={() => { setIsAuthenticated(false); setView('login'); }} className="text-[10px] text-gray-400 hover:text-red-500 block text-left">Disconnect</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className={`h-14 border-b px-6 flex items-center justify-between sticky top-0 z-10 ${theme === 'dark' ? 'bg-[#131314]/50 border-[#2d2e30] backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}`}>
          <h1 className={`text-sm font-semibold capitalize ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Workspace // {view}</h1>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">AI ONLINE</span>
        </header>
        <div className="flex-1">{renderMainContent()}</div>
      </main>
    </div>
  );
}