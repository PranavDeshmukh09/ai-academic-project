import React from 'react';

export default function Navbar({ currentView, setView }) {
  const navItems = [
    { id: 'login', label: 'Login' },
    { id: 'register', label: 'Register' },
    { id: 'assessment', label: 'Skill Assessment' },
    { id: 'project', label: 'Submit Project' }, // Added this button entry
    { id: 'profile', label: 'Profile' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600 tracking-tight">AI Mentor Platform</span>
          </div>
          <div className="flex space-x-4 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}