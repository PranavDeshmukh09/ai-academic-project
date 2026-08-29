import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthGateway from './pages/AuthGateway';
import SkillAssessment from './pages/SkillAssessment';
import ProjectSubmission from './pages/ProjectSubmission';
import ProjectDetailsView from './pages/ProjectDetailsView';
import DashboardView from './pages/DashboardView';
import ProfileView from './pages/ProfileView';
import ReportsView from './pages/ReportsView';
import SettingsView from './pages/SettingsView';
import FacultyDashboardView from './pages/FacultyDashboardView';
import FacultyMyTeamsView from './pages/FacultyMyTeamsView';
import FacultyProjectsView from './pages/FacultyProjectsView';
import FacultyProgressTrackingView from './pages/FacultyProgressTrackingView';
import FacultyAiInsightsView from './pages/FacultyAiInsightsView';
import FacultyMentorshipView from './pages/FacultyMentorshipView';
import FacultyReviewsView from './pages/FacultyReviewsView';
import FacultyAnalyticsView from './pages/FacultyAnalyticsView';
import FacultyDocumentsView from './pages/FacultyDocumentsView';
import FacultyNotificationsView from './pages/FacultyNotificationsView';
import Sidebar from './components/Sidebar';
import MentorChat from './components/MentorChat';
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

  const [projects, setProjects] = useState([]);
  const [hasLoadedOnboarding, setHasLoadedOnboarding] = useState(false);
  const [isInitializingProject, setIsInitializingProject] = useState(false);
  const [initStage, setInitStage] = useState(0);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('app_theme') || 'pastel');
  const [showAuth, setShowAuth] = useState(false);

  const stages = [
    "Launching Multi-Agent Analysis...",
    "Executing Skill Diagnostic Mapper...",
    "Evaluating Capstone Project Scope...",
    "Constructing Milestone Timeline...",
    "Configuring Optimal Tech Stack...",
    "Simulating Project Risk Vectors...",
    "Instantiating Academic Mentor Memories..."
  ];

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (token) {
        try {
          const profile = await apiService.getMe();
          if (profile && profile.email) {
            const isFac = profile.role === 'faculty' || profile.email?.toLowerCase() === 'faculty';
            setUserProfile({
              fullName: profile.name,
              email: profile.email,
              department: profile.department,
              year: profile.year,
              student_id: profile.student_id,
              role: profile.role || (isFac ? 'faculty' : 'student'),
              skills: profile.skills || [],
              experienceLevel: profile.experience_level || 'Intermediate'
            });
            setIsAuthenticated(true);
            if (isFac) {
              setCurrentTab('faculty');
            }
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error("Auto-login token validation failed:", err);
          handleLogout();
        }
      }
      setIsInitializing(false);
    };
    checkToken();
  }, []);

  // Fetch updated student profile and projects from database whenever tab or auth changes
  useEffect(() => {
    if (!isAuthenticated) {
      setHasLoadedOnboarding(false);
      setProjects([]);
      return;
    }
    const fetchLatestData = async () => {
      try {
        const profile = await apiService.getMe();
        const isFac = profile?.role === 'faculty' || profile?.email?.toLowerCase() === 'faculty';
        setUserProfile({
          fullName: profile.name,
          email: profile.email,
          department: profile.department,
          year: profile.year,
          student_id: profile.student_id,
          role: profile.role || (isFac ? 'faculty' : 'student'),
          skills: profile.skills || [],
          experienceLevel: profile.experience_level || 'Intermediate'
        });

        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (token) {
          const response = await fetch('http://localhost:8000/projects/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setProjects(data || []);
          }
        }
      } catch (err) {
        console.error("Failed to refresh student profile or projects:", err);
      } finally {
        setHasLoadedOnboarding(true);
      }
    };
    fetchLatestData();
  }, [currentTab, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    setUserProfile({ fullName: '', email: '', department: '', year: '', skills: [], role: 'student' });
    setProjects([]);
    setHasLoadedOnboarding(false);
    setIsAuthenticated(false);
  };

  const refreshProjects = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      try {
        const response = await fetch('http://localhost:8000/projects/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data || []);
        }
      } catch (err) {
        console.error("Failed to refresh projects in App.jsx:", err);
      }
    }
  };

  const handleAuthSuccess = async (isNewUser, role) => {
    setIsAuthenticated(true);
    setHasLoadedOnboarding(true);
    
    try {
      const profile = await apiService.getMe();
      const isFac = role === 'faculty' || profile?.role === 'faculty' || profile?.email?.toLowerCase() === 'faculty';
      if (profile && profile.email) {
        setUserProfile({
          fullName: profile.name || '',
          email: profile.email || '',
          department: profile.department || '',
          year: profile.year || '',
          student_id: profile.student_id || '',
          role: profile.role || (isFac ? 'faculty' : 'student'),
          skills: profile.skills || [],
          experienceLevel: profile.experience_level || 'Intermediate'
        });
      }
      setCurrentTab(isFac ? 'faculty' : (isNewUser ? 'skills' : 'dashboard'));
      
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (token) {
        const pResponse = await fetch('http://localhost:8000/projects/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (pResponse.ok) {
          const pData = await pResponse.json();
          setProjects(pData || []);
        }
      }
    } catch (err) {
      console.warn("Post-auth data fetch warning:", err);
      setCurrentTab(role === 'faculty' ? 'faculty' : (isNewUser ? 'skills' : 'dashboard'));
    }
  };

  const handleProjectSubmitSuccess = async (projectData) => {
    const rawId = typeof projectData === 'object' ? (projectData.project_id || projectData.id) : projectData;
    const projectId = Number(rawId);
    if (!projectId || isNaN(projectId)) {
      console.error("Invalid projectId received for initialization:", projectData);
      return;
    }

    setIsInitializingProject(true);
    setInitStage(0);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/initialize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ project_id: projectId })
      });
      if (!response.ok) {
        console.warn("Failed to initialize project on backend:", await response.text());
      }
    } catch (err) {
      console.error("Error during project initialization:", err);
    } finally {
      setIsInitializingProject(false);
      // Re-fetch everything to clear onboarding lock
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
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (token) {
        const pResponse = await fetch('http://localhost:8000/projects/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (pResponse.ok) {
          const pData = await pResponse.json();
          setProjects(pData || []);
        }
      }
      setCurrentTab('dashboard');
    }
  };

  // Progress ticker effect for project initialization
  useEffect(() => {
    if (!isInitializingProject) return;
    const interval = setInterval(() => {
      setInitStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [isInitializingProject, stages.length]);

  // If not authenticated, show either Landing or AuthGateway
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0252CD] rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-slate-500">Initializing session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showAuth) {
      return <AuthGateway onAuthSuccess={handleAuthSuccess} setUserProfile={setUserProfile} onBackToHome={() => setShowAuth(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // --- Initial loading checker ---
  if (isAuthenticated && !hasLoadedOnboarding) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0252CD] rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-slate-500">Checking profile verification status...</span>
        </div>
      </div>
    );
  }

  // --- Initialization stage loading screen ---
  if (isInitializingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center p-6 select-none animate-fadeIn">
        <div className="max-w-md w-full text-center space-y-8 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Top glowing mesh */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="space-y-4">
            {/* Spinning/pulsing logo/icon */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin animate-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-purple-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">AI Project Initialization</h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Please wait while the Multi-Agent orchestrator analyzes your capstone submission.
              </p>
            </div>
          </div>

          {/* Stages Tracker */}
          <div className="space-y-3 pt-4 text-left border-t border-white/10">
            {stages.map((stage, index) => {
              const isActive = index === initStage;
              const isCompleted = index < initStage;
              return (
                <div key={index} className={`flex items-center space-x-3 transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-40'}`}>
                  <span className="text-xs">
                    {isCompleted ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : isActive ? (
                      <span className="text-purple-400 font-bold">●</span>
                    ) : (
                      <span className="text-slate-500">○</span>
                    )}
                  </span>
                  <span className={`text-xs font-bold ${isActive ? 'text-purple-400 font-extrabold shadow-sm' : 'text-slate-300'}`}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress line */}
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
              style={{ width: `${((initStage + 1) / stages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // --- Onboarding Lock Verification (Students only) ---
  const isFaculty = userProfile?.role === 'faculty' || userProfile?.email?.toLowerCase() === 'faculty';
  const needsSkills = !isFaculty && (!userProfile.skills || userProfile.skills.length === 0);
  const needsProject = !isFaculty && (projects.length === 0);

  if (needsSkills || needsProject) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between overflow-y-auto">
        {/* Simple Setup Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-800">
              AI Academic Onboarding
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold text-slate-500">
              Logged in as: {userProfile.fullName || userProfile.email}
            </span>
            <button 
              onClick={handleLogout}
              className="px-3.5 py-1.5 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Setup Content Area */}
        <main className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
          <div className="w-full max-w-4xl py-6">
            {needsSkills ? (
              <SkillAssessment 
                userProfile={userProfile} 
                onComplete={async () => {
                  const profile = await apiService.getMe();
                  setUserProfile(prev => ({
                    ...prev,
                    skills: profile.skills || [],
                    experienceLevel: profile.experience_level || 'Intermediate'
                  }));
                }} 
              />
            ) : (
              <ProjectSubmission 
                onSubmitSuccess={handleProjectSubmitSuccess} 
                onBack={handleLogout} 
              />
            )}
          </div>
        </main>

        {/* Footer info progress */}
        <footer className="py-4 text-center text-[10px] text-slate-400 font-bold border-t border-slate-200/50 bg-white">
          Step {needsSkills ? '1' : '2'} of 2: {needsSkills ? 'Configure Developer Skills Matrix' : 'Submit Capstone Project Details'}
        </footer>
      </div>
    );
  }

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  const getThemeClass = (themeName) => {
    switch (themeName) {
      case 'dark':
        return 'bg-slate-950 bg-[radial-gradient(at_top_left,#1e1b4b_0%,transparent_50%),radial-gradient(at_bottom_right,#0f172a_0%,transparent_50%)] text-slate-100';
      case 'light':
        return 'bg-slate-50 text-slate-900';
      case 'pastel':
      default:
        return 'bg-[#f0f9ff] bg-[radial-gradient(at_top_left,#bae6fd_0%,transparent_55%),radial-gradient(at_bottom_right,#fbcfe8_0%,transparent_55%),radial-gradient(at_top_right,#e0e7ff_0%,transparent_50%)]';
    }
  };

  // --- Main Authenticated Layout ---
  return (
    <div className={`flex h-screen ${getThemeClass(currentTheme)} font-sans antialiased overflow-hidden relative`}>
      
      {/* Sidebar Navigation */}
      {currentTab !== 'skills' && (
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          onLogout={handleLogout} 
          currentTheme={currentTheme}
          userProfile={userProfile}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="w-full h-full">
            {currentTab === 'dashboard' && (
              <DashboardView 
                userProfile={userProfile} 
                onNavigate={setCurrentTab} 
                onProjectsChange={refreshProjects}
                currentTheme={currentTheme}
              />
            )}
            {currentTab === 'skills' && (
              <SkillAssessment 
                userProfile={userProfile} 
                onComplete={() => setCurrentTab('dashboard')} 
                onBack={() => setCurrentTab('dashboard')} 
                currentTheme={currentTheme}
              />
            )}
            {currentTab === 'project' && (
              <ProjectDetailsView 
                onCreateProject={() => setCurrentTab('create-project')} 
                onSelectProject={(projectId) => {
                  setActiveProjectId(projectId);
                  setCurrentTab('chat');
                }}
                onProjectsChange={refreshProjects}
                currentTheme={currentTheme}
              />
            )}
            {currentTab === 'create-project' && <ProjectSubmission onSubmitSuccess={handleProjectSubmitSuccess} onBack={() => setCurrentTab('project')} currentTheme={currentTheme} />}
            
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
                currentTheme={currentTheme}
              />
            )}
            {currentTab === 'chat' && (
              (() => {
                const activeProject = projects.find(p => p.project_id === activeProjectId) || projects[0];
                return activeProject ? (
                  <MentorChat student={userProfile} project={activeProject} currentTheme={currentTheme} />
                ) : (
                  <div className={`rounded-2xl p-8 border text-center ${currentTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                    <h2 className="text-2xl font-bold">No Active Project</h2>
                    <p className={`mt-2 ${currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Please submit a project idea first to activate the Mentor Chat.</p>
                  </div>
                );
              })()
            )}
            {currentTab === 'reports' && (
              <ReportsView 
                userProfile={userProfile} 
                projects={projects} 
                onNavigate={setCurrentTab} 
                onSelectProject={(projectId) => {
                  setActiveProjectId(projectId);
                  setCurrentTab('chat');
                }}
                currentTheme={currentTheme}
              />
            )}
            {(currentTab === 'faculty' || currentTab === 'faculty-dashboard') && (
              isFaculty ? (
                <FacultyDashboardView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-teams' && (
              isFaculty ? (
                <FacultyMyTeamsView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-projects' && (
              isFaculty ? (
                <FacultyProjectsView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-progress' && (
              isFaculty ? (
                <FacultyProgressTrackingView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-insights' && (
              isFaculty ? (
                <FacultyAiInsightsView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-mentorship' && (
              isFaculty ? (
                <FacultyMentorshipView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-reviews' && (
              isFaculty ? (
                <FacultyReviewsView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-analytics' && (
              isFaculty ? (
                <FacultyAnalyticsView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-documents' && (
              isFaculty ? (
                <FacultyDocumentsView 
                  onSelectProject={(project) => {
                    if (project && project.project_id) {
                      setActiveProjectId(project.project_id);
                      setCurrentTab('chat');
                    }
                  }}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab === 'faculty-notifications' && (
              isFaculty ? (
                <FacultyNotificationsView 
                  onNavigate={setCurrentTab}
                  currentTheme={currentTheme}
                />
              ) : (
                <DashboardView 
                  userProfile={userProfile} 
                  onNavigate={setCurrentTab} 
                  onProjectsChange={refreshProjects}
                  currentTheme={currentTheme}
                />
              )
            )}
            {currentTab.startsWith('faculty-') && currentTab !== 'faculty-dashboard' && currentTab !== 'faculty-teams' && currentTab !== 'faculty-projects' && currentTab !== 'faculty-progress' && currentTab !== 'faculty-insights' && currentTab !== 'faculty-mentorship' && currentTab !== 'faculty-reviews' && currentTab !== 'faculty-analytics' && currentTab !== 'faculty-documents' && currentTab !== 'faculty-notifications' && (
              <FacultyDashboardView 
                onSelectProject={(project) => {
                  if (project && project.project_id) {
                    setActiveProjectId(project.project_id);
                    setCurrentTab('chat');
                  }
                }}
                currentTheme={currentTheme}
              />
            )}
            {currentTab === 'settings' && (
              <SettingsView 
                userProfile={userProfile} 
                currentTheme={currentTheme} 
                onThemeChange={handleThemeChange}
              />
            )}
          </div>
        </main>

      </div>
    </div>
  );
}