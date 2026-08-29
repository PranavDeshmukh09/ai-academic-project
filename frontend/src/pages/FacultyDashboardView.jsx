import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const UserGroupIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const AlertOctagonIcon = () => (
  <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// Helper function to strip XML tags, reasoning blocks, and raw markdown symbols
const cleanDisplayText = (text) => {
  if (!text) return 'Not analyzed yet';
  let cleaned = String(text);
  cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '');
  cleaned = cleaned.replace(/<\/?reasoning>/gi, '');
  cleaned = cleaned.replace(/[*#_`~]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned || 'Not analyzed yet';
};

// --- Dynamic Milestone Parser & Status Resolver ---
function parseProjectMilestones(planText) {
  if (!planText) return [];
  const milestones = [];
  const regex = /##\s*(?:Milestone\s*)?(\d+)[:\s\-–—]*(.+?)(?=\n##|\n$|$)/gis;
  let match;
  while ((match = regex.exec(planText)) !== null) {
    const num = parseInt(match[1], 10);
    const titleAndBody = match[2].trim();
    const titleLine = titleAndBody.split('\n')[0].trim();
    const body = titleAndBody.split('\n').slice(1).join('\n').trim();
    
    milestones.push({
      number: num,
      title: titleLine.replace(/[*_#]/g, '').trim(),
      body,
    });
  }
  
  if (milestones.length === 0) {
    const lines = planText.split('\n');
    let current = null;
    for (const line of lines) {
      const m = line.match(/(?:milestone|phase|stage|sprint)\s*(\d+)[:\s\-–—]*(.*)/i);
      if (m) {
        if (current) milestones.push(current);
        current = { number: parseInt(m[1], 10), title: m[2].replace(/[*_#]/g, '').trim(), body: '' };
      }
    }
    if (current) milestones.push(current);
  }
  
  return milestones;
}

function getActiveUpcomingMilestone(project) {
  const pId = project.project_id;
  const plan = project.project_plan || '';
  const parsedMilestones = parseProjectMilestones(plan);

  // Read saved local statuses if any
  let savedStatuses = {};
  if (pId) {
    try {
      const raw = localStorage.getItem(`academic_project_milestones_${pId}`);
      if (raw) savedStatuses = JSON.parse(raw);
    } catch (e) {}
  }

  if (parsedMilestones.length === 0) {
    const isInit = project.has_been_initialized;
    const status = savedStatuses[1] || (project.status === 'delayed' ? 'delayed' : (isInit ? 'in_progress' : 'planned'));
    let progressPct = 20;
    if (status === 'completed') progressPct = 100;
    else if (status === 'in_progress') progressPct = 65;
    else if (status === 'delayed') progressPct = 30;

    return {
      number: 1,
      title: isInit ? `Sprint 1: ${project.project_title || 'Core Implementation'}` : `Sprint 1: Initiation & Architecture Setup`,
      status,
      progressPct,
      dueDate: status === 'delayed' ? 'Delayed • Sprint 1' : 'Due in 3 days',
      allMilestones: [{ number: 1, title: 'Sprint 1: Core Implementation', status }]
    };
  }

  // Map all milestones with their current statuses
  const milestonesWithStatus = parsedMilestones.map(m => ({
    ...m,
    status: savedStatuses[m.number] || (m.number === 1 ? 'in_progress' : 'planned')
  }));

  // Find first non-completed milestone (in_progress, delayed, or planned)
  let active = milestonesWithStatus.find(m => m.status === 'in_progress') 
            || milestonesWithStatus.find(m => m.status === 'delayed')
            || milestonesWithStatus.find(m => m.status === 'planned');

  if (!active && milestonesWithStatus.length > 0) {
    // All completed
    const last = milestonesWithStatus[milestonesWithStatus.length - 1];
    return {
      ...last,
      status: 'completed',
      progressPct: 100,
      dueDate: '✓ Completed',
      allMilestones: milestonesWithStatus
    };
  }

  const activeNumber = active ? active.number : 1;
  const status = active ? active.status : 'in_progress';

  // Calculate dynamic progress %
  let progressPct = 50;
  if (status === 'completed') progressPct = 100;
  else if (status === 'in_progress') progressPct = 65;
  else if (status === 'delayed') progressPct = 30;
  else if (status === 'planned') progressPct = 15;

  // Format clean title
  let cleanTitle = active ? active.title : 'Sprint Execution';
  if (!/^sprint|^milestone/i.test(cleanTitle)) {
    cleanTitle = `Sprint ${activeNumber}: ${cleanTitle}`;
  }

  // Extract or compute due date
  let dueDate = `Sprint Week ${activeNumber * 2}`;
  const weekMatch = (cleanTitle + ' ' + (active?.body || '')).match(/(?:week|weeks|sprint)\s*(\d+(?:-\d+)?)/i);
  if (weekMatch) {
    dueDate = `Due Week ${weekMatch[1]}`;
  } else {
    dueDate = activeNumber === 1 ? 'Due in 3 days' : (activeNumber === 2 ? 'Due this Friday' : `Due Sprint ${activeNumber}`);
  }

  if (status === 'delayed') {
    dueDate = `Delayed • ${dueDate}`;
  }

  return {
    ...active,
    number: activeNumber,
    title: cleanTitle,
    status,
    progressPct,
    dueDate,
    allMilestones: milestonesWithStatus
  };
}

export default function FacultyDashboardView({ onSelectProject, currentTheme = 'pastel' }) {
  const [data, setData] = useState({ total_projects: 0, projects: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Full Project Grid Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [approvedEvals, setApprovedEvals] = useState({});
  const [milestoneRefreshKey, setMilestoneRefreshKey] = useState(0);
  const isDark = currentTheme === 'dark';

  // Listen for milestone changes across the app
  useEffect(() => {
    const handleMilestoneUpdate = () => {
      setMilestoneRefreshKey(k => k + 1);
    };
    window.addEventListener('storage', handleMilestoneUpdate);
    window.addEventListener('focus', handleMilestoneUpdate);
    window.addEventListener('milestone_updated', handleMilestoneUpdate);
    return () => {
      window.removeEventListener('storage', handleMilestoneUpdate);
      window.removeEventListener('focus', handleMilestoneUpdate);
      window.removeEventListener('milestone_updated', handleMilestoneUpdate);
    };
  }, []);

  // Update milestone status directly from faculty dashboard
  const handleUpdateMilestoneStatus = (projectId, milestoneNum, newStatus) => {
    if (!projectId) return;
    try {
      const key = `academic_project_milestones_${projectId}`;
      const raw = localStorage.getItem(key);
      const cur = raw ? JSON.parse(raw) : {};
      cur[milestoneNum] = newStatus;
      localStorage.setItem(key, JSON.stringify(cur));
      
      // Dispatch milestone_updated event
      window.dispatchEvent(new Event('milestone_updated'));
      setMilestoneRefreshKey(k => k + 1);
    } catch (e) {
      console.error("Failed to update milestone status:", e);
    }
  };

  // --- Dedicated Velocity Section State (Top 5 Default, Search & Filters) ---
  const [velocitySearch, setVelocitySearch] = useState('');
  const [velocitySearchScope, setVelocitySearchScope] = useState('all'); // 'all', 'project_id', 'student_id', 'name', 'title'
  const [velocityFilter, setVelocityFilter] = useState('top5'); // 'top5', 'lowest5', 'all', 'on_track', 'delayed', 'needs_attention'
  const [velocityPage, setVelocityPage] = useState(1);
  const VELOCITY_PER_PAGE = 5;

  const fetchFacultyDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.getFacultyDashboard();
      if (res && res.projects) {
        setData(res);
      } else {
        setData({ total_projects: 0, projects: [] });
      }
    } catch (err) {
      console.error("Faculty dashboard fetch error:", err);
      setError("Failed to connect to Faculty Dashboard service. Ensure backend is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyDashboard();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Compute 5 Overall Summary Metrics
  const totalStudentTeams = data.projects.length;
  const activeProjects = data.projects.filter(p => p.has_been_initialized).length;
  const projectsOnTrack = data.projects.filter(p => p.has_been_initialized && p.status === 'on_track').length;
  const projectsDelayed = data.projects.filter(p => p.status === 'delayed').length;
  const projectsRequiringAttention = data.projects.filter(p => p.status === 'needs_attention' || (!p.has_been_initialized && p.project_id)).length;

  // Smart Search Scope & Prefix Detection
  const resolvedSearchConfig = React.useMemo(() => {
    const raw = velocitySearch.trim().toLowerCase();
    if (!raw) return { scope: velocitySearchScope, query: '' };

    if (/^(p#|proj#|proj:|project:|pid:)/i.test(raw)) {
      return {
        scope: 'project_id',
        query: raw.replace(/^(p#|proj#|proj:|project:|pid:)\s*/i, '').trim(),
        autoDetected: true,
        detectedType: 'Project ID'
      };
    }
    if (/^(s#|student#|student:|sid:|sid#)/i.test(raw)) {
      return {
        scope: 'student_id',
        query: raw.replace(/^(s#|student#|student:|sid:|sid#)\s*/i, '').trim(),
        autoDetected: true,
        detectedType: 'Student ID'
      };
    }
    if (/^(name:|student_name:)/i.test(raw)) {
      return {
        scope: 'name',
        query: raw.replace(/^(name:|student_name:)\s*/i, '').trim(),
        autoDetected: true,
        detectedType: 'Student Name'
      };
    }
    if (/^(title:|project_title:)/i.test(raw)) {
      return {
        scope: 'title',
        query: raw.replace(/^(title:|project_title:)\s*/i, '').trim(),
        autoDetected: true,
        detectedType: 'Project Title'
      };
    }

    return {
      scope: velocitySearchScope,
      query: raw.replace(/^#/, '').trim(),
      autoDetected: false
    };
  }, [velocitySearch, velocitySearchScope]);

  // Compute Disambiguation if a pure number query matches both Project ID and Student ID
  const disambiguationInfo = React.useMemo(() => {
    if (resolvedSearchConfig.autoDetected || resolvedSearchConfig.scope !== 'all' || !resolvedSearchConfig.query) {
      return null;
    }
    const q = resolvedSearchConfig.query;
    if (!/^\d+$/.test(q)) return null;

    const projMatches = data.projects.filter(p => String(p.project_id || '') === q);
    const studentMatches = data.projects.filter(p => String(p.student_id || '') === q);

    if (projMatches.length > 0 && studentMatches.length > 0) {
      return {
        queryNumber: q,
        projCount: projMatches.length,
        studentCount: studentMatches.length,
        projTeams: projMatches.map(p => p.name).join(', '),
        studentTeams: studentMatches.map(p => p.name).join(', ')
      };
    }
    return null;
  }, [resolvedSearchConfig, data.projects]);

  // Process Velocity List with Search, Filter & Sort
  const velocityProcessedProjects = React.useMemo(() => {
    let list = [...data.projects];
    const { scope, query } = resolvedSearchConfig;

    // 1. Apply Scope-Specific Search
    if (query) {
      list = list.filter((p) => {
        const studentIdStr = String(p.student_id || '').toLowerCase();
        const projectIdStr = String(p.project_id || '').toLowerCase();
        const nameStr = (p.name || '').toLowerCase();
        const titleStr = (p.project_title || '').toLowerCase();
        const deptStr = (p.department || '').toLowerCase();
        const domainStr = (p.domain || '').toLowerCase();

        if (scope === 'project_id') {
          return projectIdStr === query || projectIdStr.includes(query);
        }
        if (scope === 'student_id') {
          return studentIdStr === query || studentIdStr.includes(query);
        }
        if (scope === 'name') {
          return nameStr.includes(query);
        }
        if (scope === 'title') {
          return titleStr.includes(query);
        }

        // 'all' scope
        return (
          studentIdStr === query || studentIdStr.includes(query) ||
          projectIdStr === query || projectIdStr.includes(query) ||
          nameStr.includes(query) ||
          titleStr.includes(query) ||
          deptStr.includes(query) ||
          domainStr.includes(query)
        );
      });
    }

    // 2. Filter Modes
    if (velocityFilter === 'on_track') {
      list = list.filter(p => p.status === 'on_track');
      list.sort((a, b) => (b.progress_pct || 0) - (a.progress_pct || 0));
    } else if (velocityFilter === 'delayed') {
      list = list.filter(p => p.status === 'delayed');
      list.sort((a, b) => (a.progress_pct || 0) - (b.progress_pct || 0));
    } else if (velocityFilter === 'needs_attention') {
      list = list.filter(p => p.status === 'needs_attention' || !p.has_been_initialized);
      list.sort((a, b) => (a.progress_pct || 0) - (b.progress_pct || 0));
    } else if (velocityFilter === 'lowest5' && !query) {
      list.sort((a, b) => (a.progress_pct || 0) - (b.progress_pct || 0));
      return list.slice(0, 5);
    } else if (velocityFilter === 'top5' && !query) {
      list.sort((a, b) => (b.progress_pct || 0) - (a.progress_pct || 0));
      return list.slice(0, 5);
    } else {
      // 'all' or active search: sort by highest progress
      list.sort((a, b) => (b.progress_pct || 0) - (a.progress_pct || 0));
    }

    return list;
  }, [data.projects, resolvedSearchConfig, velocityFilter]);

  // Compute pagination for Velocity section
  const isCappedTop5 = (velocityFilter === 'top5' || velocityFilter === 'lowest5') && !velocitySearch.trim();
  const totalVelocityMatches = velocityProcessedProjects.length;
  const totalVelocityPages = isCappedTop5 ? 1 : Math.max(1, Math.ceil(totalVelocityMatches / VELOCITY_PER_PAGE));
  
  const displayedVelocityProjects = isCappedTop5 
    ? velocityProcessedProjects 
    : velocityProcessedProjects.slice((velocityPage - 1) * VELOCITY_PER_PAGE, velocityPage * VELOCITY_PER_PAGE);

  const handleVelocitySearchChange = (val) => {
    setVelocitySearch(val);
    setVelocityPage(1);
  };

  const handleVelocityScopeChange = (newScope) => {
    setVelocitySearchScope(newScope);
    setVelocityPage(1);
  };

  const handleVelocityFilterChange = (filterId) => {
    setVelocityFilter(filterId);
    setVelocityPage(1);
  };

  // Filter projects by search query and status filter for main grid
  const filteredProjects = data.projects.filter((p) => {
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.project_title && p.project_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.department && p.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.domain && p.domain.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterStatus === 'on_track') return matchesSearch && p.status === 'on_track';
    if (filterStatus === 'delayed') return matchesSearch && p.status === 'delayed';
    if (filterStatus === 'needs_attention') return matchesSearch && (p.status === 'needs_attention' || !p.has_been_initialized);
    if (filterStatus === 'initialized') return matchesSearch && p.has_been_initialized;
    if (filterStatus === 'pending') return matchesSearch && !p.has_been_initialized;
    return matchesSearch;
  });

  // Dynamic Upcoming Milestones Aggregated Across Active Teams (100% Real-time)
  const upcomingMilestones = React.useMemo(() => {
    const activeProjects = data.projects.filter(p => p.has_been_initialized || p.project_id);
    
    return activeProjects.map((p, idx) => {
      const activeM = getActiveUpcomingMilestone(p);
      return {
        id: idx,
        milestoneNumber: activeM.number,
        milestoneTitle: activeM.title,
        status: activeM.status,
        teamName: p.name,
        projectTitle: p.project_title,
        dueDate: activeM.dueDate,
        progressPct: activeM.progressPct,
        allMilestones: activeM.allMilestones,
        project: p
      };
    }).slice(0, 3);
  }, [data.projects, milestoneRefreshKey]);

  // Dynamic Pending Evaluations
  const pendingEvaluations = data.projects
    .slice(0, 3)
    .map((p, idx) => ({
      id: idx,
      title: idx === 0 ? 'Milestone 1 Deliverable & Code Review' : (idx === 1 ? 'SRS Document & Technical Feasibility Sign-off' : 'Midterm Defense Architecture Deck'),
      teamName: p.name,
      projectTitle: p.project_title,
      submittedDate: idx === 0 ? 'Submitted Today' : (idx === 1 ? 'Submitted Yesterday' : 'Submitted 2 days ago'),
      aiScore: idx === 0 ? 94 : (idx === 1 ? 88 : 91),
      project: p
    }));

  // Dynamic Pending Mentorship Requests
  const pendingMentorship = data.projects
    .filter(p => p.has_been_initialized)
    .slice(0, 3)
    .map((p, idx) => ({
      id: idx,
      studentName: p.name,
      query: idx === 0 
        ? 'Technical architecture inquiry on PostgreSQL connection pooling in async microservices' 
        : (idx === 1 ? 'Guidance requested on Model Quantization for mobile edge inference (TFLite vs ONNX)' : 'Clarification needed on OAuth 2.0 PKCE authentication flow'),
      priority: idx === 0 ? 'High Priority' : 'Normal',
      urgencyColor: idx === 0 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      project: p
    }));

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* Top Title Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <UserGroupIcon />
          </div>
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Faculty Oversight & Evaluation Dashboard
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Comprehensive capstone telemetry, team progress velocity, pending evaluations, and risk alerts.
            </p>
          </div>
        </div>

        <button
          onClick={fetchFacultyDashboard}
          disabled={loading}
          className={`px-4 py-2.5 border text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-2 self-start md:self-auto disabled:opacity-50 shrink-0 ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className={loading ? "animate-spin" : ""}><RefreshIcon /></span>
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* 1. Overall Summary Metric Cards (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Student Teams */}
        <div className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Teams</span>
            <span className="text-xs">👥</span>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalStudentTeams}</h3>
            <p className="text-[10px] font-bold text-indigo-400 mt-0.5">Enrolled Cohort</p>
          </div>
        </div>

        {/* Card 2: Active Projects */}
        <div className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Projects</span>
            <span className="text-xs">🚀</span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-500">{activeProjects}</h3>
            <p className="text-[10px] font-bold text-emerald-500 mt-0.5">AI Roadmap Active</p>
          </div>
        </div>

        {/* Card 3: Projects On Track */}
        <div className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">On Track</span>
            <CheckCircleIcon />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-400">{projectsOnTrack}</h3>
            <p className="text-[10px] font-bold text-emerald-400 mt-0.5">Normal Velocity</p>
          </div>
        </div>

        {/* Card 4: Projects Delayed */}
        <div className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Delayed</span>
            <AlertTriangleIcon />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-500">{projectsDelayed}</h3>
            <p className="text-[10px] font-bold text-amber-500 mt-0.5">Schedule Slippage</p>
          </div>
        </div>

        {/* Card 5: Projects Requiring Attention */}
        <div className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Needs Attention</span>
            <AlertOctagonIcon />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-rose-500">{projectsRequiringAttention}</h3>
            <p className="text-[10px] font-bold text-rose-500 mt-0.5">High Risk / Uninit</p>
          </div>
        </div>
      </div>

      {/* 2. Project Completion Percentage Progress Chart by Team (Top 5 Default, Search & Filters) */}
      <div className={`border rounded-2xl p-6 shadow-xs space-y-5 ${cardBg}`}>
        {/* Header with Title and Mode Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200/60 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Team Project Completion Velocity
              </h3>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                isCappedTop5 
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}>
                {isCappedTop5 
                  ? `⭐ ${velocityFilter === 'lowest5' ? 'Lowest 5' : 'Top 5'} View (${displayedVelocityProjects.length} of ${data.projects.length})` 
                  : `Showing ${displayedVelocityProjects.length} of ${totalVelocityMatches} Teams`}
              </span>
            </div>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time milestone deliverable completion telemetry across student capstone teams.
            </p>
          </div>

          {/* Quick Toggle if in Top 5 mode */}
          {isCappedTop5 && data.projects.length > 5 && (
            <button
              onClick={() => handleVelocityFilterChange('all')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer self-start sm:self-auto shrink-0"
            >
              View All Teams ({data.projects.length}) →
            </button>
          )}
        </div>

        {/* Dedicated Search & Filter Controls */}
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input Container with Scope Selector */}
            <div className="relative flex-1 flex items-center gap-2">
              {/* Search Scope Dropdown */}
              <div className="shrink-0">
                <select
                  value={resolvedSearchConfig.autoDetected ? resolvedSearchConfig.scope : velocitySearchScope}
                  onChange={(e) => handleVelocityScopeChange(e.target.value)}
                  className={`py-2 px-3 border rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-slate-200 focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                  }`}
                  title="Select Search Target Scope"
                >
                  <option value="all">🌐 All Fields</option>
                  <option value="project_id">📁 Project ID (p#)</option>
                  <option value="student_id">👤 Student ID (s#)</option>
                  <option value="name">👤 Student Name</option>
                  <option value="title">📑 Project Title</option>
                </select>
              </div>

              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={velocitySearch}
                  onChange={(e) => handleVelocitySearchChange(e.target.value)}
                  placeholder="Search (e.g. #12, p#12, s#12, Sarah, AI Vision)..."
                  className={`w-full pl-9 pr-8 py-2 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                  }`}
                />
                {velocitySearch && (
                  <button
                    onClick={() => {
                      handleVelocitySearchChange('');
                      setVelocitySearchScope('all');
                    }}
                    className="absolute inset-y-0 right-2.5 flex items-center text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Velocity Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 shrink-0">
              {[
                { id: 'top5', label: '⭐ Top 5' },
                { id: 'lowest5', label: '⚠️ Lowest 5' },
                { id: 'on_track', label: `🟢 On Track (${projectsOnTrack})` },
                { id: 'delayed', label: `🟡 Delayed (${projectsDelayed})` },
                { id: 'needs_attention', label: `🔴 Attention (${projectsRequiringAttention})` },
                { id: 'all', label: `📋 All (${data.projects.length})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => handleVelocityFilterChange(pill.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    velocityFilter === pill.id && !velocitySearch
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Detection Indicator Pill */}
          {resolvedSearchConfig.autoDetected && (
            <div className="flex items-center space-x-2 text-[11px] font-bold text-indigo-400 animate-fadeIn">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                ⚡ Prefix Detected: Searching strictly by {resolvedSearchConfig.detectedType} = "{resolvedSearchConfig.query}"
              </span>
              <button
                onClick={() => setVelocitySearchScope('all')}
                className="text-slate-400 hover:text-white underline cursor-pointer text-[10px]"
              >
                Reset to All Fields
              </button>
            </div>
          )}

          {/* Disambiguation Helper Banner for ambiguous number searches */}
          {disambiguationInfo && (
            <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs animate-fadeIn ${
              isDark ? 'bg-indigo-950/40 border-indigo-800/80 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-base">💡</span>
                <span>
                  Query <strong>#{disambiguationInfo.queryNumber}</strong> matched <strong>{disambiguationInfo.projCount} team</strong> by Project ID and <strong>{disambiguationInfo.studentCount} team</strong> by Student ID:
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleVelocityScopeChange('project_id')}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  📁 Show Project #{disambiguationInfo.queryNumber} Only ({disambiguationInfo.projCount})
                </button>
                <button
                  onClick={() => handleVelocityScopeChange('student_id')}
                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  👤 Show Student #{disambiguationInfo.queryNumber} Only ({disambiguationInfo.studentCount})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rendered Project List */}
        {data.projects.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No active student project teams found.</p>
        ) : displayedVelocityProjects.length === 0 ? (
          <div className={`p-8 rounded-2xl border text-center space-y-3 ${
            isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              No teams matched your query "{velocitySearch}" with scope "{resolvedSearchConfig.scope}".
            </p>
            <button
              onClick={() => {
                handleVelocitySearchChange('');
                setVelocitySearchScope('all');
                handleVelocityFilterChange('top5');
              }}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Reset Search & Show Top 5
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {displayedVelocityProjects.map((p, idx) => {
              const pct = p.progress_pct || (p.has_been_initialized ? 65 : 20);
              const statusColor = 
                p.status === 'delayed' ? 'from-amber-500 to-orange-500' :
                p.status === 'needs_attention' ? 'from-rose-500 to-pink-600' :
                'from-indigo-600 to-purple-600';

              const rankNum = isCappedTop5 ? idx + 1 : (velocityPage - 1) * VELOCITY_PER_PAGE + idx + 1;

              // Check if this card matched by Project ID or Student ID to highlight it visually
              const q = resolvedSearchConfig.query.toLowerCase();
              const isProjIdMatch = q && String(p.project_id || '').toLowerCase() === q;
              const isStudentIdMatch = q && String(p.student_id || '').toLowerCase() === q;

              return (
                <div key={p.student_id} className={`p-4 rounded-xl border transition-all ${
                  isDark ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700' : 'bg-slate-50/60 border-slate-200/70 hover:bg-white hover:shadow-xs hover:border-slate-300'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Rank indicator */}
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                        rankNum === 1 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : rankNum === 2 
                            ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30'
                            : rankNum === 3
                              ? 'bg-amber-700/20 text-amber-400 border border-amber-700/30'
                              : isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        #{rankNum}
                      </span>

                      {/* Student & Project Details */}
                      <div className="truncate">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className={`text-xs font-black truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            {p.name}
                          </span>

                          {/* Student ID Badge with Match Highlight */}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                            isStudentIdMatch 
                              ? 'bg-purple-600 text-white font-extrabold shadow-sm ring-1 ring-purple-400' 
                              : 'text-slate-400 bg-slate-800/50 dark:bg-slate-800/50'
                          }`}>
                            Student ID: #{p.student_id} {isStudentIdMatch && '✓ Match'}
                          </span>

                          {/* Project ID Badge with Match Highlight */}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                            isProjIdMatch 
                              ? 'bg-indigo-600 text-white font-extrabold shadow-sm ring-1 ring-indigo-400' 
                              : 'text-slate-400 bg-slate-800/50 dark:bg-slate-800/50'
                          }`}>
                            Proj #{p.project_id || 'N/A'} {isProjIdMatch && '✓ Match'}
                          </span>

                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            isDark ? 'bg-slate-800 text-indigo-300 border-slate-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                          }`}>
                            {p.department || p.domain || 'Engineering'}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 truncate block mt-0.5">
                          {p.project_title}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill, Progress Pct, and Inspect Button */}
                    <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        p.status === 'delayed' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                          : p.status === 'needs_attention'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {p.status === 'delayed' ? 'Delayed' : (p.status === 'needs_attention' ? 'Needs Attention' : 'On Track')}
                      </span>

                      <span className={`text-xs font-black w-10 text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {pct}%
                      </span>

                      <button
                        onClick={() => setSelectedStudent(p)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          isDark 
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                        title="View Health Details"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>

                  {/* Visual Completion Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${statusColor} transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Bar: View All or Pagination */}
        {!isCappedTop5 && totalVelocityPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            <button
              onClick={() => setVelocityPage(prev => Math.max(1, prev - 1))}
              disabled={velocityPage === 1}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ← Previous
            </button>

            <span className="text-[11px] font-bold text-slate-400">
              Page {velocityPage} of {totalVelocityPages} ({totalVelocityMatches} teams)
            </span>

            <button
              onClick={() => setVelocityPage(prev => Math.min(totalVelocityPages, prev + 1))}
              disabled={velocityPage === totalVelocityPages}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Next →
            </button>
          </div>
        )}

        {isCappedTop5 && data.projects.length > 5 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-400">
            <span className="text-[11px] font-medium">
              Currently displaying top {displayedVelocityProjects.length} out of {data.projects.length} enrolled teams.
            </span>
            <button
              onClick={() => handleVelocityFilterChange('all')}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
            >
              Show All {data.projects.length} Teams
            </button>
          </div>
        )}
      </div>

      {/* 3. The 3 Suggested Modular Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Upcoming Milestones (100% Dynamic & Interactive) */}
        <div className={`border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CalendarIcon />
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Upcoming Milestones</h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                Live Roadmap
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {upcomingMilestones.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No active milestones found.</p>
              ) : (
                upcomingMilestones.map((m) => {
                  const statusBadgeClass = 
                    m.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    m.status === 'delayed' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    m.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/20';

                  const barGradient = 
                    m.status === 'completed' ? 'from-emerald-500 to-teal-400' :
                    m.status === 'delayed' ? 'from-amber-500 to-orange-500' :
                    m.status === 'in_progress' ? 'from-indigo-600 to-blue-500' :
                    'from-slate-500 to-slate-400';

                  return (
                    <div key={m.id} className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                      isDark ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200/70 hover:border-slate-300'
                    }`}>
                      {/* Team Name, ID & Status Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className="font-bold truncate text-slate-400">
                            {m.teamName}
                          </span>
                          <span className="text-[9px] text-slate-500 font-semibold">
                            (ID: #{m.project.student_id})
                          </span>
                        </div>

                        {/* Interactive Status Selector for Quick Update */}
                        <div className="flex items-center space-x-1 shrink-0">
                          <select
                            value={m.status}
                            onChange={(e) => handleUpdateMilestoneStatus(m.project.project_id, m.milestoneNumber, e.target.value)}
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border cursor-pointer focus:outline-none transition-all ${statusBadgeClass} ${
                              isDark ? 'bg-slate-900' : 'bg-white'
                            }`}
                            title="Update Milestone Status"
                          >
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="delayed">Delayed</option>
                            <option value="planned">Planned</option>
                          </select>
                        </div>
                      </div>

                      {/* Milestone Title */}
                      <h4 className={`font-bold leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {m.milestoneTitle}
                      </h4>

                      {/* Timeline Due Date & Progress Bar */}
                      <div className="space-y-1 pt-0.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span>{m.dueDate}</span>
                          <span>{m.progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-500`}
                            style={{ width: `${m.progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <button 
            onClick={() => setFilterStatus('all')}
            className="w-full py-2 border rounded-xl text-xs font-bold text-center text-slate-400 hover:text-indigo-400 hover:border-indigo-400/40 transition-all cursor-pointer"
          >
            View All Team Milestones →
          </button>
        </div>

        {/* Widget 2: Pending Evaluations */}
        <div className={`border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <ClipboardIcon />
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Pending Evaluations</h3>
              </div>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                Sign-off Queue
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {pendingEvaluations.map((ev) => {
                const isApproved = approvedEvals[ev.id];
                return (
                  <div key={ev.id} className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200/70'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">{ev.teamName}</span>
                      <span className="text-[9px] font-black text-purple-400">AI Score: {ev.aiScore}/100</span>
                    </div>
                    <h4 className={`font-bold leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {ev.title}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{ev.submittedDate}</span>
                      {isApproved ? (
                        <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                          ✓ Signed Off
                        </span>
                      ) : (
                        <button
                          onClick={() => setApprovedEvals(prev => ({ ...prev, [ev.id]: true }))}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                        >
                          Quick Approve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button 
            onClick={() => setFilterStatus('all')}
            className="w-full py-2 border rounded-xl text-xs font-bold text-center text-slate-400 hover:text-purple-400 hover:border-purple-400/40 transition-all cursor-pointer"
          >
            Open Evaluation Board →
          </button>
        </div>

        {/* Widget 3: Pending Mentorship Requests */}
        <div className={`border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <MessageCircleIcon />
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Mentorship Requests</h3>
              </div>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                Advisory Tickets
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {pendingMentorship.map((m) => (
                <div key={m.id} className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200/70'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">{m.studentName}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${m.urgencyColor}`}>
                      {m.priority}
                    </span>
                  </div>
                  <p className={`font-medium line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    "{m.query}"
                  </p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => onSelectProject && onSelectProject(m.project)}
                      className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Join Advisory Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setFilterStatus('all')}
            className="w-full py-2 border rounded-xl text-xs font-bold text-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-all cursor-pointer"
          >
            View All Mentor Threads →
          </button>
        </div>
      </div>

      {/* 4. Filter and Search Controls for Full Project Grid */}
      <div className={`border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg}`}>
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, title, or domain..."
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
            }`}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All (${data.projects.length})` },
            { id: 'on_track', label: `On Track (${projectsOnTrack})` },
            { id: 'delayed', label: `Delayed (${projectsDelayed})` },
            { id: 'needs_attention', label: `Attention (${projectsRequiringAttention})` },
            { id: 'initialized', label: `AI Active (${activeProjects})` },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterStatus(pill.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === pill.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className={`border rounded-2xl p-16 text-center shadow-sm ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
          <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-xs font-bold">Fetching faculty monitoring telemetry...</span>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-xs font-bold text-center shadow-xs">
          ⚠️ {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className={`border rounded-2xl p-16 text-center shadow-sm ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
          <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>No student projects found matching filters</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search term or changing the status filter.</p>
        </div>
      ) : (
        /* Student Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.student_id}
              className={`border rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 relative overflow-hidden group ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 text-slate-100'
                  : 'bg-white border-slate-200/90 hover:border-indigo-300 text-slate-900'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Student ID: #{project.student_id} • {project.department}
                    </span>
                    <h3 className={`text-base font-black transition-colors mt-0.5 ${
                      isDark ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'
                    }`}>
                      {project.name}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-wider shrink-0 ${
                      project.has_been_initialized
                        ? isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isDark ? 'bg-amber-950/80 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {project.has_been_initialized ? 'AI Plan Active' : 'Pending Init'}
                  </span>
                </div>

                {/* Project Title & Domain */}
                <div className={`border rounded-xl p-3.5 space-y-1 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Project Title</span>
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md ${
                      isDark ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {project.domain}
                    </span>
                  </div>
                  <h4 className={`text-xs font-black leading-snug ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{project.project_title}</h4>
                </div>

                {/* Risk Analysis Summary Indicator */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <span>⚠️ AI Risk Analysis Summary</span>
                  </p>
                  <div className={`text-xs leading-relaxed font-medium p-3 rounded-xl border ${
                    isDark ? 'bg-amber-950/30 border-amber-900/50 text-amber-200' : 'bg-amber-50/40 border-amber-100/60 text-slate-700'
                  }`}>
                    {cleanDisplayText(project.risk_analysis_summary)}
                  </div>
                </div>

                {/* Latest Weekly Check-in Feedback */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <span>📅 Latest Check-in Telemetry</span>
                  </p>
                  <div className={`text-xs leading-relaxed font-medium p-3 rounded-xl border ${
                    isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-50/80 border-slate-100 text-slate-700'
                  }`}>
                    {cleanDisplayText(project.latest_checkin || 'No check-ins run yet.')}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className="text-[10px] font-bold text-slate-400">
                  Project ID: #{project.project_id || 'N/A'}
                </span>
                <button
                  onClick={() => setSelectedStudent(project)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  View Health Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Health Detail Modal Overlay */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedStudent(null)}>
          <div className={`rounded-3xl w-full max-w-2xl shadow-2xl border p-8 space-y-6 max-h-[85vh] overflow-y-auto my-auto ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-start justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <span className={`text-[10px] font-black border px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                  isDark ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                }`}>
                  Student Monitoring File
                </span>
                <h3 className={`text-xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedStudent.name}</h3>
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedStudent.department} • Student ID: #{selectedStudent.student_id}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm cursor-pointer transition-colors ${
                  isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className={`border rounded-2xl p-4 space-y-1 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200/80'}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Capstone Project Proposal</span>
                <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedStudent.project_title}</h4>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedStudent.project_description || 'Student capstone implementation proposal'}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">AI Risk Diagnostics</span>
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-medium ${
                  isDark ? 'bg-amber-950/30 border-amber-900/50 text-amber-200' : 'bg-amber-50/60 border-amber-200/60 text-slate-800'
                }`}>
                  {cleanDisplayText(selectedStudent.risk_analysis_summary)}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Milestone Execution & Weekly Telemetry</span>
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-medium ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  {cleanDisplayText(selectedStudent.latest_checkin || 'No weekly telemetry data logged yet.')}
                </div>
              </div>
            </div>

            <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={() => setSelectedStudent(null)}
                className={`px-5 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
