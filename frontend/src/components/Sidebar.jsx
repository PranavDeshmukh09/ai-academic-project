import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'skills', label: 'Skill Assessment', icon: '📝' },
    { id: 'project', label: 'Project Submission', icon: '🚀' },
    { id: 'pipeline_demo', label: 'AI Pipeline Demo', icon: '✨' },
    { id: 'chat', label: 'Mentor Chat', icon: '💬' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 h-screen sticky top-0 shrink-0 z-20">
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#0252CD] flex items-center justify-center text-white text-xl shadow-sm">
            🎓
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">AI Academic</span>
            <span className="text-sm font-bold text-slate-900 leading-tight">Project Mentor</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setCurrentTab(item.id)} 
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#0252CD] text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}