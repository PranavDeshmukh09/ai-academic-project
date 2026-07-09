import React, { useState } from 'react';
import Onboarding from './pages/Onboarding';

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex h-screen w-screen font-sans transition-colors duration-700 overflow-hidden ${
      isDark ? 'bg-premium-slate text-premium-white' : 'bg-premium-offwhite text-premium-slate'
    }`}>
      
      {/* LEFT PANEL: Sticky Branding (25%) */}
      <aside className={`hidden lg:flex flex-col justify-between w-[25%] h-full p-8 relative overflow-hidden transition-colors duration-700 ${
        isDark ? 'bg-premium-surface' : 'bg-premium-white border-r border-gray-200'
      }`}>
        {/* Dynamic Gradient Orb */}
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[100px] opacity-40 mix-blend-screen pointer-events-none transition-all duration-1000 ${
          isDark ? 'bg-gradient-to-tr from-premium-royal to-premium-violet' : 'bg-gradient-to-tr from-premium-royal/50 to-premium-violet/50'
        }`}></div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-8 w-8 rounded-xl bg-gradient-to-br from-premium-royal to-premium-violet flex items-center justify-center shadow-lg shadow-premium-royal/30`}>
              <div className="h-3 w-3 bg-white rounded-full"></div>
            </div>
            <span className="font-serif text-lg font-bold tracking-tight">AI Academic</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-serif font-bold leading-[1.1] tracking-tight">
            Design <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-royal via-premium-violet to-premium-crimson">
              The Future.
            </span>
          </h1>
          <p className={`text-xs leading-relaxed max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Welcome to the AI Academic Project portal. Initialize your profile to begin the Milestone 1 onboarding sequence.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between border-t pt-6 border-gray-500/20">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Milestone 01</p>
          <button 
            onClick={toggleTheme}
            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
              isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* RIGHT PANEL: Scrollable Form Area (65%) */}
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth">
        <Onboarding theme={theme} toggleTheme={toggleTheme} />
      </main>
      
    </div>
  );
}