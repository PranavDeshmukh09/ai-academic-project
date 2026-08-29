import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const GraduationCapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M12 2l2.4 7.2L21 12l-6.6 2.8L12 22l-2.4-7.2L3 12l6.6-2.8L12 2z" />
  </svg>
);

export default function FacultyMentorshipView({ currentTheme = 'pastel', onSelectProject }) {
  const [data, setData] = useState({ total_projects: 0, projects: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'schedule', 'guidance', 'history'

  // Mentorship Requests State
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('academic_mentorship_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 101,
        studentName: 'Abhishek Kumar',
        studentId: 1,
        projectTitle: 'AI-Powered Academic Project Mentor Platform',
        projectId: 12,
        domain: 'Artificial Intelligence',
        topic: 'Technical architecture review on PostgreSQL connection pooling in async microservices',
        priority: 'High Priority',
        submittedAt: 'Today, 11:30 AM',
        status: 'pending', // 'pending', 'accepted', 'rejected'
        details: 'We are experiencing connection timeout errors under concurrent agent invocations. Need guidance on asyncpg pool size and connection recycling.'
      },
      {
        id: 102,
        studentName: 'Pranav',
        studentId: 4,
        projectTitle: 'Multimodal Capstone Orchestrator',
        projectId: 12,
        domain: 'Cloud Systems',
        topic: 'Guidance requested on Model Quantization for mobile edge inference (TFLite vs ONNX)',
        priority: 'Normal',
        submittedAt: 'Yesterday, 3:15 PM',
        status: 'pending',
        details: 'Seeking recommendation on whether to quantize our embedding model to INT8 or FP16 for low-latency client inference.'
      },
      {
        id: 103,
        studentName: 'Test Student 5',
        studentId: 5,
        projectTitle: 'Real-time Autonomous Agent Workflow',
        projectId: 15,
        domain: 'Cybersecurity',
        topic: 'Clarification needed on OAuth 2.0 PKCE authentication flow and JWT rotation',
        priority: 'Urgent',
        submittedAt: '2 days ago',
        status: 'pending',
        details: 'Need security sign-off on token refresh strategy and cross-site scripting mitigation.'
      }
    ];
  });

  // Scheduled Meetings State (Schedule Meeting -> Date -> Time -> Topic -> Team)
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('academic_scheduled_meetings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 201,
        teamName: 'Abhishek Kumar',
        studentId: 1,
        projectTitle: 'AI-Powered Academic Project Mentor Platform',
        topic: 'Database Schema Optimization & Async Connection Tuning',
        date: '2026-08-28',
        time: '03:30 PM - 04:15 PM',
        mode: 'Google Meet',
        meetLink: 'https://meet.google.com/abc-defg-hij',
        status: 'scheduled'
      },
      {
        id: 202,
        teamName: 'Pranav',
        studentId: 4,
        projectTitle: 'Multimodal Capstone Orchestrator',
        topic: 'Edge Inference Benchmarking & Quantization Strategy',
        date: '2026-08-29',
        time: '11:00 AM - 11:45 AM',
        mode: 'Room 402 - AI Systems Lab',
        meetLink: 'In-Person (Room 402)',
        status: 'scheduled'
      }
    ];
  });

  // Historical Mentoring Sessions State
  const [historySessions, setHistorySessions] = useState(() => {
    const saved = localStorage.getItem('academic_mentorship_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 301,
        teamName: 'Abhishek Kumar',
        studentId: 1,
        projectTitle: 'AI-Powered Academic Project Mentor Platform',
        topic: 'SRS Document Review & Architectural Boundary Definition',
        date: 'Aug 18, 2026',
        duration: '45 mins',
        decisions: 'Approved PostgreSQL + Pinecone vector architecture. Instructed team to modularize agent tools.',
        actionItems: '1. Commit initial FastAPI router structure. 2. Implement mock authentication wrapper.',
        status: 'Action Items Verified'
      },
      {
        id: 302,
        teamName: 'Test Student 5',
        studentId: 5,
        projectTitle: 'Real-time Autonomous Agent Workflow',
        topic: 'Feasibility Assessment & Research Scope Refinement',
        date: 'Aug 10, 2026',
        duration: '30 mins',
        decisions: 'Scoped project down to focus on core evaluation pipeline rather than full LMS replacement.',
        actionItems: '1. Update project proposal with revised 12-week roadmap.',
        status: 'Completed'
      }
    ];
  });

  // Recommended Resources State
  const [recommendedResources, setRecommendedResources] = useState(() => {
    const saved = localStorage.getItem('academic_recommended_resources');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 401,
        teamName: 'All Teams',
        title: 'Asyncpg Connection Pooling & Transaction Management in FastAPI',
        category: 'Documentation',
        url: 'https://magicstack.github.io/asyncpg/current/',
        notes: 'Essential reading for resolving database connection pool timeouts in microservices.'
      },
      {
        id: 402,
        teamName: 'Pranav',
        title: 'ONNX Runtime vs TensorRT for Edge Embedding Model Acceleration',
        category: 'Research Paper',
        url: 'https://arxiv.org/abs/2104.08698',
        notes: 'Benchmark comparisons for INT8 quantization on client edge devices.'
      }
    ];
  });

  // Schedule Meeting Form State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    teamName: '',
    topic: '',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '03:30 PM - 04:15 PM',
    mode: 'Google Meet',
    meetLink: 'https://meet.google.com/aca-proj-ment'
  });

  // Guidance Composer Form State
  const [guidanceForm, setGuidanceForm] = useState({
    targetTeam: '',
    guidanceText: '',
    resourceTitle: '',
    resourceCategory: 'Documentation',
    resourceUrl: ''
  });
  const [guidanceSuccess, setGuidanceSuccess] = useState(false);

  const isDark = currentTheme === 'dark';

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFacultyDashboard();
      if (res && res.projects) {
        setData(res);
        if (res.projects.length > 0 && !scheduleForm.teamName) {
          setScheduleForm(prev => ({ ...prev, teamName: res.projects[0].name }));
          setGuidanceForm(prev => ({ ...prev, targetTeam: res.projects[0].name }));
        }
      }
    } catch (e) {
      console.error("Error fetching dashboard data for mentorship:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Save requests, meetings, history to localStorage on change
  const saveRequests = (updated) => {
    setRequests(updated);
    localStorage.setItem('academic_mentorship_requests', JSON.stringify(updated));
  };

  const saveMeetings = (updated) => {
    setMeetings(updated);
    localStorage.setItem('academic_scheduled_meetings', JSON.stringify(updated));
  };

  const saveHistory = (updated) => {
    setHistorySessions(updated);
    localStorage.setItem('academic_mentorship_history', JSON.stringify(updated));
  };

  const saveResources = (updated) => {
    setRecommendedResources(updated);
    localStorage.setItem('academic_recommended_resources', JSON.stringify(updated));
  };

  // 1. Accept Request -> Open Schedule Modal
  const handleAcceptRequest = (req) => {
    const updated = requests.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r);
    saveRequests(updated);

    // Pre-fill schedule meeting modal
    setScheduleForm({
      teamName: req.studentName,
      topic: req.topic,
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '03:30 PM - 04:15 PM',
      mode: 'Google Meet',
      meetLink: 'https://meet.google.com/aca-' + Math.random().toString(36).substring(7)
    });
    setShowScheduleModal(true);
  };

  // 2. Reject Request
  const handleRejectRequest = (reqId) => {
    const updated = requests.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r);
    saveRequests(updated);
  };

  // 3. Submit Scheduled Meeting
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleForm.topic.trim()) return;

    const newMeeting = {
      id: Date.now(),
      teamName: scheduleForm.teamName || (data.projects[0]?.name || 'Student Team'),
      studentId: data.projects.find(p => p.name === scheduleForm.teamName)?.student_id || 1,
      projectTitle: data.projects.find(p => p.name === scheduleForm.teamName)?.project_title || 'Capstone Project',
      topic: scheduleForm.topic,
      date: scheduleForm.date,
      time: scheduleForm.time,
      mode: scheduleForm.mode,
      meetLink: scheduleForm.meetLink,
      status: 'scheduled'
    };

    saveMeetings([newMeeting, ...meetings]);
    setShowScheduleModal(false);
    setActiveTab('schedule');
  };

  // 4. Submit Guidance & Recommended Resource
  const handleGuidanceSubmit = (e) => {
    e.preventDefault();
    if (!guidanceForm.guidanceText.trim()) return;

    // If resource provided, add to recommended resources
    if (guidanceForm.resourceTitle.trim()) {
      const newRes = {
        id: Date.now(),
        teamName: guidanceForm.targetTeam || 'All Teams',
        title: guidanceForm.resourceTitle.trim(),
        category: guidanceForm.resourceCategory,
        url: guidanceForm.resourceUrl.trim() || 'https://developer.mozilla.org',
        notes: guidanceForm.guidanceText.trim().slice(0, 120) + '...'
      };
      saveResources([newRes, ...recommendedResources]);
    }

    // Save session note into history
    const newSession = {
      id: Date.now(),
      teamName: guidanceForm.targetTeam || (data.projects[0]?.name || 'Student Pod'),
      studentId: data.projects.find(p => p.name === guidanceForm.targetTeam)?.student_id || 1,
      projectTitle: data.projects.find(p => p.name === guidanceForm.targetTeam)?.project_title || 'Capstone Project',
      topic: guidanceForm.resourceTitle ? `Advisory Review: ${guidanceForm.resourceTitle}` : 'Faculty Guidance & Architectural Direction',
      date: 'Today',
      duration: 'Written Review',
      decisions: guidanceForm.guidanceText.trim(),
      actionItems: 'Implement faculty recommendations before next milestone review.',
      status: 'Guidance Dispatched'
    };
    saveHistory([newSession, ...historySessions]);

    setGuidanceSuccess(true);
    setGuidanceForm({
      targetTeam: data.projects[0]?.name || '',
      guidanceText: '',
      resourceTitle: '',
      resourceCategory: 'Documentation',
      resourceUrl: ''
    });
    setTimeout(() => setGuidanceSuccess(false), 4000);
  };

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <GraduationCapIcon />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Mentorship & Advisory Center
              </h1>
              {pendingRequestsCount > 0 && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                  {pendingRequestsCount} Pending Requests
                </span>
              )}
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Review student advisory inquiries, schedule 1-on-1 sprint reviews, send architectural guidance, and track mentoring sessions.
            </p>
          </div>
        </div>

        {/* Quick Schedule Meeting Button */}
        <button
          onClick={() => {
            if (data.projects.length > 0) {
              setScheduleForm(prev => ({ ...prev, teamName: data.projects[0].name }));
            }
            setShowScheduleModal(true);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-2 self-start md:self-auto shrink-0"
        >
          <PlusIcon />
          <span>Schedule Mentorship Meeting</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Advisory Requests</span>
            <ClockIcon />
          </div>
          <h3 className="text-2xl font-black text-amber-400 mt-2">
            {pendingRequestsCount}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">Awaiting Faculty Review</p>
        </div>

        {/* Scheduled Meetings */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Scheduled Sessions</span>
            <CalendarIcon />
          </div>
          <h3 className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {meetings.length}
          </h3>
          <p className="text-[10px] font-bold text-indigo-500/80 mt-0.5">Upcoming on Calendar</p>
        </div>

        {/* Completed Sessions */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Sessions Completed</span>
            <CheckCircleIcon />
          </div>
          <h3 className="text-2xl font-black text-emerald-400 mt-2">
            {historySessions.length}
          </h3>
          <p className="text-[10px] font-bold text-emerald-500/80 mt-0.5">Historical Mentoring Log</p>
        </div>

        {/* Recommended Resources */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Resources Shared</span>
            <BookOpenIcon />
          </div>
          <h3 className="text-2xl font-black text-purple-400 mt-2">
            {recommendedResources.length}
          </h3>
          <p className="text-[10px] font-bold text-purple-500/80 mt-0.5">Curated Academic Assets</p>
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className={`p-2 border rounded-2xl shadow-xs flex flex-wrap items-center gap-1.5 ${cardBg}`}>
        {[
          { id: 'requests', label: `📥 Mentorship Requests (${pendingRequestsCount})` },
          { id: 'schedule', label: `📅 Scheduled Meetings (${meetings.length})` },
          { id: 'guidance', label: '💬 Send Guidance & Recommend Resources' },
          { id: 'history', label: `📜 Session History & Ledger (${historySessions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab 1: Mentorship Requests Queue */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Incoming Student Advisory Tickets
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Showing {requests.length} inquiries
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((req) => {
              const priorityClass = req.priority === 'Urgent' || req.priority === 'High Priority'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                    req.status === 'accepted' 
                      ? 'border-emerald-500/30 bg-emerald-500/5' 
                      : req.status === 'rejected' 
                        ? 'border-slate-700/40 bg-slate-800/20 opacity-60' 
                        : cardBg
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Student Name & Priority */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {req.studentName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          ID: #{req.studentId} • {req.domain}
                        </p>
                      </div>

                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${priorityClass}`}>
                        {req.priority}
                      </span>
                    </div>

                    {/* Topic & Details */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-indigo-400">Advisory Topic</span>
                      <h5 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {req.topic}
                      </h5>
                    </div>

                    <p className={`text-[11px] leading-relaxed p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-800/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {req.details}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>Submitted: {req.submittedAt}</span>
                      <span className="capitalize font-bold text-slate-300">Status: {req.status}</span>
                    </div>
                  </div>

                  {/* Actions: Accept or Reject */}
                  {req.status === 'pending' ? (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs text-center flex items-center justify-center space-x-1"
                      >
                        <CheckCircleIcon />
                        <span>Accept & Schedule</span>
                      </button>

                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3 py-2 border border-slate-700 hover:bg-slate-800 text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        title="Decline Request"
                      >
                        <XCircleIcon />
                      </button>
                    </div>
                  ) : req.status === 'accepted' ? (
                    <div className="pt-2 border-t border-emerald-500/20 text-center">
                      <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                        ✓ Accepted & Added to Schedule
                      </span>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-700 text-center">
                      <span className="text-xs font-semibold text-slate-400">
                        ✕ Declined
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Tab 2: Schedule & Upcoming Meetings (Schedule Meeting -> Date -> Time -> Topic -> Team) */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Upcoming Mentorship Sessions
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Direct Sprint review sessions scheduled with student capstone pods.
              </p>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <PlusIcon />
              <span>Schedule New Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border space-y-3.5 transition-all shadow-xs ${cardBg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400">Student Team Pod</span>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {m.teamName}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400 truncate">
                      {m.projectTitle}
                    </p>
                  </div>

                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {m.mode}
                  </span>
                </div>

                <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] font-black uppercase text-slate-400">Meeting Topic & Agenda</span>
                  <p className="font-bold text-slate-200">{m.topic}</p>
                </div>

                {/* Date, Time & Meeting Room */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                    isDark ? 'bg-slate-800/30 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <CalendarIcon />
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block">Date</span>
                      <span className="font-bold text-[11px]">{m.date}</span>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                    isDark ? 'bg-slate-800/30 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <ClockIcon />
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block">Time Slot</span>
                      <span className="font-bold text-[11px]">{m.time}</span>
                    </div>
                  </div>
                </div>

                {/* Link button */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={m.meetLink.startsWith('http') ? m.meetLink : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
                  >
                    <VideoIcon />
                    <span>{m.meetLink.startsWith('http') ? 'Join Online Call' : m.meetLink}</span>
                  </a>

                  <button
                    onClick={() => {
                      if (onSelectProject) {
                        const proj = data.projects.find(p => p.name === m.teamName);
                        if (proj) onSelectProject(proj);
                      }
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Open Advisory Chat →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Send Guidance & Recommend Resources */}
      {activeTab === 'guidance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guidance Composer Form */}
          <div className={`p-6 border rounded-2xl shadow-xs space-y-4 ${cardBg}`}>
            <div>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Send Guidance & Architectural Comments
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Dispatch direct mentor advice and recommended academic resources to student pods.
              </p>
            </div>

            <form onSubmit={handleGuidanceSubmit} className="space-y-3.5">
              {/* Target Team Selector */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Target Student Team</label>
                <select
                  value={guidanceForm.targetTeam}
                  onChange={(e) => setGuidanceForm({ ...guidanceForm, targetTeam: e.target.value })}
                  className={`w-full p-2.5 border rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {data.projects.map((p) => (
                    <option key={p.student_id} value={p.name}>
                      {p.name} — {p.project_title ? p.project_title.slice(0, 30) + '...' : `Proj #${p.project_id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guidance / Comments Textarea */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Faculty Guidance & Comments</label>
                <textarea
                  value={guidanceForm.guidanceText}
                  onChange={(e) => setGuidanceForm({ ...guidanceForm, guidanceText: e.target.value })}
                  placeholder="Provide concrete advice, architectural direction, code structure tips, or sprint deliverables feedback..."
                  rows="4"
                  required
                  className={`w-full p-3 border rounded-xl text-xs font-medium focus:outline-none transition-all ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Optional Recommended Resource */}
              <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-black uppercase text-purple-400 flex items-center gap-1">
                  <BookOpenIcon />
                  <span>Attach Recommended Resource (Optional)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={guidanceForm.resourceTitle}
                    onChange={(e) => setGuidanceForm({ ...guidanceForm, resourceTitle: e.target.value })}
                    placeholder="Resource Title (e.g. Asyncpg Docs)"
                    className={`p-2 border rounded-lg text-xs font-semibold focus:outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />

                  <select
                    value={guidanceForm.resourceCategory}
                    onChange={(e) => setGuidanceForm({ ...guidanceForm, resourceCategory: e.target.value })}
                    className={`p-2 border rounded-lg text-xs font-bold focus:outline-none cursor-pointer ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Documentation">Documentation</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Code Repository">Code Repository</option>
                    <option value="Video Lecture">Video Lecture</option>
                    <option value="Dataset">Dataset</option>
                  </select>
                </div>

                <input
                  type="url"
                  value={guidanceForm.resourceUrl}
                  onChange={(e) => setGuidanceForm({ ...guidanceForm, resourceUrl: e.target.value })}
                  placeholder="URL / Link (https://...)"
                  className={`w-full p-2 border rounded-lg text-xs font-semibold focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {guidanceSuccess && (
                  <span className="text-xs font-bold text-emerald-400 animate-fadeIn">✓ Guidance & resources dispatched to team!</span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer ml-auto"
                >
                  Send Guidance & Recommendations
                </button>
              </div>
            </form>
          </div>

          {/* Curated Resources List */}
          <div className={`p-6 border rounded-2xl shadow-xs space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recommended Resources Library
              </h3>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                {recommendedResources.length} Shared Assets
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {recommendedResources.map((res) => (
                <div
                  key={res.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                    isDark ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400">{res.teamName}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {res.category}
                    </span>
                  </div>

                  <h4 className={`font-bold leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {res.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {res.notes}
                  </p>

                  <div className="pt-1">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                    >
                      <LinkIcon />
                      <span>Open Recommended Link</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Historical Mentoring Sessions Ledger */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Mentorship Audit Log & Historical Sessions
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {historySessions.length} recorded sessions
            </span>
          </div>

          <div className="space-y-3">
            {historySessions.map((session) => (
              <div
                key={session.id}
                className={`p-5 rounded-2xl border space-y-3 transition-all ${cardBg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                      {session.teamName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {session.teamName}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-semibold truncate">
                        {session.projectTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400 font-bold">{session.date} • {session.duration}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {session.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-black uppercase text-indigo-400">Key Decisions & Feedback</span>
                    <p className="text-slate-300 leading-relaxed">{session.decisions}</p>
                  </div>

                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-black uppercase text-purple-400">Agreed Action Items</span>
                    <p className="text-slate-300 leading-relaxed">{session.actionItems}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Schedule Meeting Modal (Schedule Meeting -> Date -> Time -> Topic -> Team) */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg border rounded-2xl p-6 shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CalendarIcon />
                <h3 className="text-base font-black">Schedule Mentorship Meeting</h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5 text-xs">
              {/* Step 1: Team */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Target Student Team</label>
                <select
                  value={scheduleForm.teamName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, teamName: e.target.value })}
                  className={`w-full p-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {data.projects.map((p) => (
                    <option key={p.student_id} value={p.name}>
                      {p.name} (ID: #{p.student_id}) — {p.project_title ? p.project_title.slice(0, 25) + '...' : `Project #${p.project_id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Topic */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Meeting Topic / Agenda</label>
                <input
                  type="text"
                  value={scheduleForm.topic}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, topic: e.target.value })}
                  placeholder="e.g. Architecture Review & PostgreSQL Connection Pooling"
                  required
                  className={`w-full p-2.5 border rounded-xl text-xs font-semibold focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Step 3: Date & Time */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    required
                    className={`w-full p-2.5 border rounded-xl text-xs font-bold focus:outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Time Slot</label>
                  <select
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM</option>
                    <option value="11:30 AM - 12:15 PM">11:30 AM - 12:15 PM</option>
                    <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM</option>
                    <option value="03:30 PM - 04:15 PM">03:30 PM - 04:15 PM</option>
                    <option value="05:00 PM - 05:45 PM">05:00 PM - 05:45 PM</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Meeting Mode & Link */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Meeting Mode</label>
                  <select
                    value={scheduleForm.mode}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, mode: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Google Meet">Google Meet (Online)</option>
                    <option value="MS Teams">Microsoft Teams</option>
                    <option value="Room 402 - AI Systems Lab">In-Person (Lab 402)</option>
                    <option value="Faculty Office 108">Faculty Office 108</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Meeting Link / Room</label>
                  <input
                    type="text"
                    value={scheduleForm.meetLink}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, meetLink: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl text-xs font-semibold focus:outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Confirm & Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
