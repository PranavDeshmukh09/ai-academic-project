import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthGateway from './pages/AuthGateway';
import SkillAssessment from './pages/SkillAssessment';
import ProjectSubmission from './pages/ProjectSubmission';
import DashboardView from './pages/DashboardView';
import ProfileView from './pages/ProfileView';
import Sidebar from './components/Sidebar';
import AIPipelineDemoView from './pages/AIPipelineDemoView';
import { apiService } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    department: '',
    year: '',
    skills: [],
    experienceLevel: 'Intermediate'
  });

  useEffect(() => {
    // Clear out old tokens automatically on refresh to force dev flow
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
  }, []);

  // Fetch updated student profile and skills from Supabase database whenever tab changes
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchLatestProfile = async () => {
      try {
        const profile = await apiService.getMe();
        setUserProfile({
          fullName: profile.name,
          email: profile.email,
          department: profile.department,
          year: profile.year,
          student_id: profile.student_id,
          skills: profile.skills || [],
          experienceLevel: profile.experience_level || 'Intermediate'
        });
      } catch (err) {
        console.error("Failed to refresh student profile:", err);
      }
    };
    fetchLatestProfile();
  }, [currentTab, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    setUserProfile({ fullName: '', email: '', department: '', year: '', skills: [] });
    setIsAuthenticated(false);
  };

  const handleAuthSuccess = (isNewUser) => {
    setIsAuthenticated(true);
    setCurrentTab(isNewUser ? 'skills' : 'dashboard');
  };

  // If not authenticated, show either Landing or AuthGateway
  // We'll use a simple state just for the initial landing vs auth gate
  const [showAuth, setShowAuth] = useState(false);

  if (!isAuthenticated) {
    if (showAuth) {
      return <AuthGateway onAuthSuccess={handleAuthSuccess} setUserProfile={setUserProfile} />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // --- Main Authenticated Layout ---
  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="text-xl font-bold text-slate-800 capitalize">
            {currentTab.replace('_', ' ')}
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="text-xl">🔔</span>
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  {userProfile.fullName || 'Student Name'}
                </span>
                <span className="text-xs font-semibold text-slate-500">Student</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0252CD] flex items-center justify-center text-white font-bold shadow-sm">
                {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && <DashboardView userProfile={userProfile} onNavigate={setCurrentTab} />}
            {currentTab === 'skills' && <SkillAssessment userProfile={userProfile} onComplete={() => setCurrentTab('project')} />}
            {currentTab === 'project' && <ProjectSubmission onSubmitSuccess={() => setCurrentTab('dashboard')} onBack={() => setCurrentTab('dashboard')} />}
            
            {currentTab === 'profile' && (
              <ProfileView 
                userProfile={userProfile} 
                onProfileUpdate={async () => {
                  try {
                    const profile = await apiService.getMe();
                    setUserProfile({
                      fullName: profile.name,
                      email: profile.email,
                      department: profile.department,
                      year: profile.year,
                      student_id: profile.student_id,
                      skills: profile.skills || [],
                      experienceLevel: profile.experience_level || 'Intermediate'
                    });
                  } catch (e) {
                    console.error("Failed to update user profile in callback:", e);
                  }
                }}
              />
            )}
            {currentTab === 'pipeline_demo' && <AIPipelineDemoView />}
            {currentTab === 'chat' && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                <h2 className="text-2xl font-bold text-slate-800">Mentor Chat</h2>
                <p className="text-slate-500 mt-2">Coming soon...</p>
              </div>
            )}
            {currentTab === 'reports' && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                <h2 className="text-2xl font-bold text-slate-800">Reports</h2>
                <p className="text-slate-500 mt-2">Coming soon...</p>
              </div>
            )}
            {currentTab === 'settings' && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
                <p className="text-slate-500 mt-2">Coming soon...</p>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}