import React, { useState } from 'react';

// --- Premium Vector SVG Icons ---
const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const RocketIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.56 1.63-2.5l5.87-5.87A7 7 0 0 0 21 3s-3.5 0-6.13 6l-5.87 5.87c-.94.37-1.79.92-2.5 1.63z" />
    <circle cx="15" cy="9" r="1" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const SlidersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const AcademicCapIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FolderKanbanIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <path d="M8 10v4" />
    <path d="M12 10v2" />
    <path d="M16 10v6" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function Sidebar({ currentTab, setCurrentTab, onLogout, currentTheme = 'pastel', userProfile }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isDark = currentTheme === 'dark';

  const isFaculty = userProfile?.role === 'faculty' || userProfile?.email?.toLowerCase() === 'faculty';

  const menuItems = isFaculty
    ? [
        { id: 'faculty', label: 'Dashboard', icon: <GridIcon />, comingSoon: false },
        { id: 'faculty-teams', label: 'My Teams', icon: <UsersIcon />, comingSoon: false },
        { id: 'faculty-projects', label: 'Projects', icon: <FolderKanbanIcon />, comingSoon: false },
        { id: 'faculty-progress', label: 'Progress Tracking', icon: <TrendingUpIcon />, comingSoon: false },
        { id: 'faculty-insights', label: 'AI Insights', icon: <SparklesIcon />, comingSoon: false },
        { id: 'faculty-mentorship', label: 'Mentorship', icon: <GraduationCapIcon />, comingSoon: false },
        { id: 'faculty-reviews', label: 'Reviews & Evaluation', icon: <ClipboardCheckIcon />, comingSoon: false },
        { id: 'faculty-documents', label: 'Documents', icon: <FileTextIcon />, comingSoon: false },
        { id: 'faculty-analytics', label: 'Reports & Analytics', icon: <BarChartIcon />, comingSoon: false },
        { id: 'faculty-notifications', label: 'Notifications', icon: <BellIcon />, comingSoon: false },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: <GridIcon />, comingSoon: false },
        { id: 'project', label: 'Project', icon: <RocketIcon />, comingSoon: false },
        { id: 'chat', label: 'Mentor Chat', icon: <MessageSquareIcon />, comingSoon: false },
        { id: 'reports', label: 'Reports', icon: <BarChartIcon />, comingSoon: false },
        { id: 'settings', label: 'Settings', icon: <SlidersIcon />, comingSoon: false },
      ];

  return (
    <aside className={`backdrop-blur-xl border-r flex flex-col justify-between py-6 h-screen sticky top-0 shrink-0 z-20 transition-all duration-300 relative ${
      isDark 
        ? 'bg-slate-900/90 border-slate-800/90 shadow-slate-950/50 text-slate-100' 
        : 'bg-white/80 border-white/80 shadow-lg shadow-sky-900/5 text-slate-800'
    } ${isCollapsed ? 'w-20 px-3' : 'w-64 px-5'}`}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        className={`absolute top-6 -right-3 w-6 h-6 rounded-full border flex items-center justify-center shadow-sm cursor-pointer z-50 transition-colors ${
          isDark
            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            : 'bg-white/90 border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
        }`}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      <div className="space-y-6 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {/* Brand Logo */}
        {isCollapsed ? (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0252CD] via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
              <AcademicCapIcon />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0252CD] via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
              <AcademicCapIcon />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFaculty ? 'Faculty Portal' : 'AI Academic'}
              </span>
              <span className={`text-xs font-semibold leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFaculty ? 'Capstone Suite' : 'Project Mentor'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id || (item.id === 'faculty' && currentTab === 'faculty-dashboard');
            return (
              <button 
                key={item.id} 
                onClick={() => setCurrentTab(item.id)} 
                className={`group w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center py-2.5' : 'justify-between px-3.5 py-2.5'
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#0252CD] via-blue-600 to-indigo-600 text-white shadow-md shadow-sky-500/20' 
                    : isDark
                      ? 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                      : 'text-slate-600 hover:bg-white/80 hover:text-[#0252CD]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`flex items-center justify-center shrink-0 ${isActive ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-sky-400' : 'text-slate-400 group-hover:text-[#0252CD]'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.id === 'project' && (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTab('create-project');
                    }}
                    className={`transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center w-5 h-5 rounded-lg font-bold text-sm bg-transparent border-transparent cursor-pointer hover:scale-125 ${
                      isActive 
                        ? 'text-white/80 hover:text-white' 
                        : isDark
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-450 hover:text-slate-800'
                    }`}
                    title="Submit New Project"
                  >
                    <PlusIcon />
                  </button>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile & Settings Combined Option Bottom Node */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 relative">
        {showProfileMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
            <div className={`absolute z-50 shadow-2xl rounded-2xl p-4 w-56 border backdrop-blur-2xl animate-fadeIn ${
              isCollapsed 
                ? 'left-16 bottom-0' 
                : 'bottom-16 left-0 right-0'
            } ${
              isDark 
                ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-slate-950/70' 
                : 'bg-white/95 border-slate-200/80 text-slate-900 shadow-sky-950/15'
            }`}>
              <div className={`flex flex-col items-center pb-3 border-b mb-3 text-center ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0252CD] via-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-md mb-2">
                  {userProfile?.fullName
                    ? userProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'U'}
                </div>
                <h4 className="text-xs font-black leading-tight truncate max-w-full">{userProfile?.fullName || 'Academic Student'}</h4>
                <p className="text-[10px] text-slate-450 font-bold mt-0.5 truncate max-w-full">{userProfile?.email}</p>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mt-2 border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-indigo-300' : 'bg-slate-50 border-slate-200 text-indigo-600'
                }`}>
                  {userProfile?.department || 'General'}
                </span>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentTab('profile');
                    setShowProfileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group ${
                    isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400 group-hover:text-sky-400' : 'text-slate-400 group-hover:text-[#0252CD]'}><UserIcon /></span>
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group ${
                    isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400 group-hover:text-sky-400' : 'text-slate-400 group-hover:text-[#0252CD]'}><SlidersIcon /></span>
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group ${
                    isDark ? 'hover:bg-rose-950/40 text-rose-350' : 'hover:bg-rose-50 text-rose-600'
                  }`}
                >
                  <span className="text-rose-550"><LogOutIcon /></span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </>
        )}

        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <button 
              onClick={onLogout}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm cursor-pointer transition-all ${
                isDark 
                  ? 'bg-slate-800 text-slate-350 border border-slate-700 hover:text-rose-450 hover:bg-slate-700'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-rose-600 hover:bg-slate-100'
              }`}
              title="Logout"
            >
              <LogOutIcon />
            </button>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0252CD] via-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-md cursor-pointer hover:scale-105 transition-transform"
              title="User Profile"
            >
              {userProfile?.fullName
                ? userProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                : 'U'}
            </button>
          </div>
        ) : (
          <div className={`flex items-center justify-between p-2.5 rounded-2xl border shadow-xs ${
            isDark 
              ? 'bg-slate-800/40 border-slate-800/80' 
              : 'bg-slate-50/50 border-slate-200/60'
          }`}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2.5 min-w-0 text-left cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0252CD] via-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-md shrink-0">
                {userProfile?.fullName
                  ? userProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'U'}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className={`text-xs font-black truncate leading-none mb-0.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {userProfile?.fullName || 'Capstone Student'}
                </span>
                <span className={`text-[10px] font-bold leading-none truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {userProfile?.department || 'Student'}
                </span>
              </div>
            </button>
            <button 
              onClick={onLogout}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isDark 
                  ? 'text-slate-450 hover:text-rose-450 hover:bg-slate-800' 
                  : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
              }`}
              title="Logout"
            >
              <LogOutIcon />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}