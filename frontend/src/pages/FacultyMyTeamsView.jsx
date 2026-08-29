import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M12 2l2.4 7.2L21 12l-6.6 2.8L12 22l-2.4-7.2L3 12l6.6-2.8L12 2z" />
  </svg>
);

const UserCheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const AlertOctagonIcon = () => (
  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// --- Helper to parse roadmap milestones from plan text ---
function parseMilestoneRoadmap(planText) {
  if (!planText) return [];
  const milestones = [];
  const regex = /##\s*(?:Milestone\s*)?(\d+)[:\s\-–—]*(.+?)(?=\n##|\n$|$)/gis;
  let match;
  while ((match = regex.exec(planText)) !== null) {
    const num = parseInt(match[1], 10);
    const titleAndBody = match[2].trim();
    const titleLine = titleAndBody.split('\n')[0].trim();
    milestones.push({
      number: num,
      title: titleLine.replace(/[*_#]/g, '').trim(),
      body: titleAndBody.split('\n').slice(1).join('\n').trim()
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

// Format relative date nicely
function formatLastUpdate(updatedAt, createdAt) {
  const ts = updatedAt || createdAt;
  if (!ts) return 'Recent check-in';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return 'Recently updated';
    const now = new Date();
    const diffHours = Math.round((now - d) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently updated';
  }
}

export default function FacultyMyTeamsView({ onSelectProject, currentTheme = 'pastel' }) {
  const [data, setData] = useState({ total_projects: 0, projects: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Controls & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'on_track', 'at_risk', 'delayed', 'completed'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedTeamModal, setSelectedTeamModal] = useState(null);
  const [sortBy, setSortBy] = useState('progress_desc'); // 'progress_desc', 'progress_asc', 'name_asc'

  const isDark = currentTheme === 'dark';

  const fetchTeams = async () => {
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
      console.error("Failed to fetch teams:", err);
      setError("Failed to connect to Faculty Teams directory. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Update local milestone or team status
  const handleUpdateStatus = (projectId, newStatus) => {
    if (!projectId) return;
    try {
      const key = `academic_team_status_override_${projectId}`;
      localStorage.setItem(key, newStatus);
      // Dispatch update
      window.dispatchEvent(new Event('milestone_updated'));
      fetchTeams();
    } catch (e) {
      console.error("Error saving status override:", e);
    }
  };

  // Process & Enrich Teams Data with all 8 requested fields
  const processedTeams = useMemo(() => {
    return data.projects.map((p) => {
      const pId = p.project_id;
      
      // Read saved local statuses if any
      let localStatuses = {};
      let localStatusOverride = null;
      if (pId) {
        try {
          const raw = localStorage.getItem(`academic_project_milestones_${pId}`);
          if (raw) localStatuses = JSON.parse(raw);
          localStatusOverride = localStorage.getItem(`academic_team_status_override_${pId}`);
        } catch (e) {}
      }

      const milestones = parseMilestoneRoadmap(p.project_plan);
      
      // 1. Current Phase
      let currentPhase = 'Phase 1: Requirements & Architecture Setup';
      let nextMilestone = 'Sprint 1: Schema & Core Setup';
      let activeNum = 1;

      if (milestones.length > 0) {
        const active = milestones.find(m => localStatuses[m.number] === 'in_progress' || localStatuses[m.number] === 'delayed') 
                    || milestones.find(m => !localStatuses[m.number] || localStatuses[m.number] === 'planned')
                    || milestones[milestones.length - 1];

        activeNum = active ? active.number : 1;
        currentPhase = `Phase ${activeNum}: ${active ? active.title : 'Development Phase'}`;

        const nextM = milestones.find(m => m.number === activeNum + 1) || active;
        nextMilestone = nextM 
          ? `Sprint ${nextM.number}: ${nextM.title}` 
          : 'Final System Validation & Defense';
      } else if (p.has_been_initialized) {
        currentPhase = 'Phase 2: Core Engine & API Services';
        nextMilestone = 'Sprint 3: Database & Auth Integration';
      }

      // 2. Normalized Status
      let normalizedStatus = localStatusOverride || p.status || 'on_track';
      if (normalizedStatus === 'needs_attention') normalizedStatus = 'at_risk';
      if (normalizedStatus === 'pending') normalizedStatus = 'on_track';
      if (p.progress_pct >= 100) normalizedStatus = 'completed';

      // 3. Project Guide
      const guideName = p.guide_name || 'Dr. R. K. Sharma (Faculty Guide)';

      // 4. Last Update
      const lastUpdateFormatted = formatLastUpdate(p.updated_at, p.created_at);

      // 5. Overall Progress
      const overallProgress = p.progress_pct || (p.has_been_initialized ? 65 : 20);

      return {
        ...p,
        uniqueId: pId || `student-${p.student_id}`,
        studentName: p.name || 'Unknown Student',
        studentId: p.student_id,
        studentEmail: p.email || `${(p.name || 'student').toLowerCase().replace(/\s+/g, '.')}@university.edu`,
        department: p.department || 'Computer Science & Engineering',
        year: p.year || 4,
        projectTitle: p.project_title || 'Untitled Capstone Project',
        projectGuide: guideName,
        currentPhase,
        overallProgress,
        lastUpdate: lastUpdateFormatted,
        nextMilestone,
        status: normalizedStatus, // 'on_track', 'at_risk', 'delayed', 'completed'
        milestones
      };
    });
  }, [data.projects]);

  // Compute KPI Summary Metrics
  const summaryCounters = useMemo(() => {
    const total = processedTeams.length;
    const onTrack = processedTeams.filter(t => t.status === 'on_track').length;
    const atRisk = processedTeams.filter(t => t.status === 'at_risk').length;
    const delayed = processedTeams.filter(t => t.status === 'delayed').length;
    const completed = processedTeams.filter(t => t.status === 'completed').length;
    const avgProgress = total > 0 
      ? Math.round(processedTeams.reduce((sum, t) => sum + t.overallProgress, 0) / total) 
      : 0;

    return { total, onTrack, atRisk, delayed, completed, avgProgress };
  }, [processedTeams]);

  // Filter and Sort Teams
  const filteredTeams = useMemo(() => {
    let list = [...processedTeams];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase().replace(/^#/, '');
      list = list.filter(t => 
        t.studentName.toLowerCase().includes(q) ||
        t.projectTitle.toLowerCase().includes(q) ||
        t.projectGuide.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.currentPhase.toLowerCase().includes(q) ||
        t.nextMilestone.toLowerCase().includes(q) ||
        String(t.studentId).includes(q) ||
        String(t.project_id || '').includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'all') {
      list = list.filter(t => t.status === statusFilter);
    }

    // 3. Sorting
    if (sortBy === 'progress_desc') {
      list.sort((a, b) => b.overallProgress - a.overallProgress);
    } else if (sortBy === 'progress_asc') {
      list.sort((a, b) => a.overallProgress - b.overallProgress);
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => a.studentName.localeCompare(b.studentName));
    }

    return list;
  }, [processedTeams, searchQuery, statusFilter, sortBy]);

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <UsersIcon />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                My Teams & Capstone Pods
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {processedTeams.length} Enrolled Pods
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Directory of student project teams, assigned faculty guides, current execution phases, progress velocity, and next sprint milestones.
            </p>
          </div>
        </div>

        {/* Quick Refresh Button */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={fetchTeams}
            disabled={loading}
            className={`px-3.5 py-2 border text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-2 disabled:opacity-50 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Refresh Teams Data"
          >
            <RefreshIcon />
            <span>Sync Live Telemetry</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Teams */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Teams</span>
            <UsersIcon />
          </div>
          <h3 className={`text-2xl font-black mt-2.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {summaryCounters.total}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">Assigned Cohort</p>
        </div>

        {/* On Track */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">On Track</span>
            <CheckCircleIcon />
          </div>
          <h3 className="text-2xl font-black text-emerald-400 mt-2.5">
            {summaryCounters.onTrack}
          </h3>
          <p className="text-[10px] font-bold text-emerald-500/80 mt-0.5">Healthy Velocity</p>
        </div>

        {/* At Risk */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">At Risk</span>
            <AlertOctagonIcon />
          </div>
          <h3 className="text-2xl font-black text-rose-400 mt-2.5">
            {summaryCounters.atRisk}
          </h3>
          <p className="text-[10px] font-bold text-rose-500/80 mt-0.5">Needs Attention</p>
        </div>

        {/* Delayed */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Delayed</span>
            <AlertTriangleIcon />
          </div>
          <h3 className="text-2xl font-black text-amber-400 mt-2.5">
            {summaryCounters.delayed}
          </h3>
          <p className="text-[10px] font-bold text-amber-500/80 mt-0.5">Behind Schedule</p>
        </div>

        {/* Completed */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Completed</span>
            <SparklesIcon />
          </div>
          <h3 className="text-2xl font-black text-cyan-400 mt-2.5">
            {summaryCounters.completed}
          </h3>
          <p className="text-[10px] font-bold text-cyan-500/80 mt-0.5">Final Defense Ready</p>
        </div>

        {/* Avg Velocity */}
        <div className={`p-4 border rounded-2xl shadow-xs ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Avg Progress</span>
            <span className="text-xs font-black text-purple-400">⚡</span>
          </div>
          <h3 className="text-2xl font-black text-purple-400 mt-2.5">
            {summaryCounters.avgProgress}%
          </h3>
          <p className="text-[10px] font-bold text-purple-500/80 mt-0.5">Cohort Average</p>
        </div>
      </div>

      {/* 3. Search Bar, Status Tabs & View Toggles */}
      <div className={`p-5 border rounded-2xl shadow-xs space-y-4 ${cardBg}`}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, project title, guide name, project ID (#12) or phase..."
              className={`w-full pl-10 pr-8 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector & View Toggle */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`py-2 px-3 border rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
              }`}
            >
              <option value="progress_desc">Sort: Highest Progress</option>
              <option value="progress_asc">Sort: Lowest Progress</option>
              <option value="name_asc">Sort: Student Name (A-Z)</option>
            </select>

            {/* Grid / Table View Switcher */}
            <div className={`flex items-center p-1 border rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid / Card View"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table / Spreadsheet View"
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All Teams (${summaryCounters.total})` },
            { id: 'on_track', label: `🟢 On Track (${summaryCounters.onTrack})` },
            { id: 'at_risk', label: `🔴 At Risk (${summaryCounters.atRisk})` },
            { id: 'delayed', label: `🟡 Delayed (${summaryCounters.delayed})` },
            { id: 'completed', label: `🔵 Completed (${summaryCounters.completed})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Teams Render (Grid vs Table) */}
      {loading ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-9 h-9 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading student capstone teams...</p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className={`p-12 rounded-2xl border text-center space-y-3 ${
          isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            No student teams matched your search or status filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID / CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((team) => {
            const statusConfig = {
              on_track: {
                label: 'On Track',
                badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                bar: 'from-emerald-500 to-teal-400'
              },
              at_risk: {
                label: 'At Risk',
                badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                bar: 'from-rose-500 to-pink-500'
              },
              delayed: {
                label: 'Delayed',
                badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                bar: 'from-amber-500 to-orange-500'
              },
              completed: {
                label: 'Completed',
                badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                bar: 'from-cyan-500 to-blue-500'
              }
            }[team.status] || {
              label: 'On Track',
              badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              bar: 'from-emerald-500 to-teal-400'
            };

            return (
              <div 
                key={team.uniqueId} 
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                  isDark ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Row: Student Name, Avatar & Status Dropdown */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Student Initials Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs">
                        {team.studentName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        {/* 1. Student Name */}
                        <h3 className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {team.studentName}
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-400 truncate">
                          Student ID: #{team.studentId} • {team.department}
                        </p>
                      </div>
                    </div>

                    {/* 8. Status Selector */}
                    <div className="shrink-0">
                      <select
                        value={team.status}
                        onChange={(e) => handleUpdateStatus(team.project_id, e.target.value)}
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border cursor-pointer focus:outline-none transition-all ${statusConfig.badge} ${
                          isDark ? 'bg-slate-800' : 'bg-slate-50'
                        }`}
                        title="Change Status"
                      >
                        <option value="on_track">🟢 On Track</option>
                        <option value="at_risk">🔴 At Risk</option>
                        <option value="delayed">🟡 Delayed</option>
                        <option value="completed">🔵 Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. Project Title */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                        isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                        Proj #{team.project_id || 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold truncate">
                        {team.domain || 'Engineering'}
                      </span>
                    </div>
                    <h4 className={`text-xs font-bold line-clamp-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {team.projectTitle}
                    </h4>
                  </div>

                  {/* 3. Project Guide & 6. Last Update */}
                  <div className={`p-2.5 rounded-xl border text-[11px] space-y-1.5 ${
                    isDark ? 'bg-slate-800/40 border-slate-800/80' : 'bg-slate-50/80 border-slate-200/70'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <UserCheckIcon />
                        <span>Guide:</span>
                      </span>
                      <span className={`font-bold truncate text-right ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {team.projectGuide}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <ClockIcon />
                        <span>Last Update:</span>
                      </span>
                      <span className="font-bold text-slate-400">
                        {team.lastUpdate}
                      </span>
                    </div>
                  </div>

                  {/* 4. Current Phase & 7. Next Milestone */}
                  <div className="space-y-2 pt-0.5 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-0.5">
                        <span className="uppercase tracking-wider">Current Phase</span>
                        <span className="text-indigo-400">{team.overallProgress}%</span>
                      </div>
                      <p className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {team.currentPhase}
                      </p>
                    </div>

                    {/* 5. Overall Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${statusConfig.bar} transition-all duration-700`}
                        style={{ width: `${team.overallProgress}%` }}
                      />
                    </div>

                    {/* Next Milestone */}
                    <div className={`p-2 rounded-lg border text-[10px] font-semibold flex items-start space-x-1.5 ${
                      isDark ? 'bg-slate-800/30 border-slate-800 text-slate-300' : 'bg-slate-100/70 border-slate-200 text-slate-700'
                    }`}>
                      <span className="text-indigo-400 font-bold shrink-0">Next:</span>
                      <span className="truncate">{team.nextMilestone}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTeamModal(team)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex-1 text-center ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Inspect Team Pod
                  </button>

                  {team.project_id && (
                    <button
                      onClick={() => onSelectProject && onSelectProject(team)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer flex items-center justify-center space-x-1"
                      title="Open Advisory Channel"
                    >
                      <span>Advisory</span>
                      <ArrowRightIcon />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className={`border rounded-2xl shadow-xs overflow-hidden ${cardBg}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${
                  isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <th className="py-3 px-4">Student Team</th>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Project Guide</th>
                  <th className="py-3 px-4">Current Phase</th>
                  <th className="py-3 px-4">Progress %</th>
                  <th className="py-3 px-4">Last Update</th>
                  <th className="py-3 px-4">Next Milestone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {filteredTeams.map((team) => {
                  const statusConfig = {
                    on_track: { label: 'On Track', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                    at_risk: { label: 'At Risk', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
                    delayed: { label: 'Delayed', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                    completed: { label: 'Completed', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
                  }[team.status] || { label: 'On Track', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };

                  return (
                    <tr 
                      key={team.uniqueId} 
                      className={`transition-all ${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* 1. Student Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200 truncate max-w-[140px]">
                          {team.studentName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ID: #{team.studentId} • {team.department}
                        </div>
                      </td>

                      {/* 2. Project Title */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-bold text-slate-200 truncate">
                          {team.projectTitle}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Proj #{team.project_id || 'N/A'} • {team.domain}
                        </div>
                      </td>

                      {/* 3. Project Guide */}
                      <td className="py-3.5 px-4 font-semibold text-slate-300 max-w-[150px] truncate">
                        {team.projectGuide}
                      </td>

                      {/* 4. Current Phase */}
                      <td className="py-3.5 px-4 font-semibold text-slate-300 max-w-[180px] truncate">
                        {team.currentPhase}
                      </td>

                      {/* 5. Overall Progress % */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-white w-7 text-right">{team.overallProgress}%</span>
                          <div className="w-16 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-500 h-full rounded-full" 
                              style={{ width: `${team.overallProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 6. Last Update */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                        {team.lastUpdate}
                      </td>

                      {/* 7. Next Milestone */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-300 max-w-[180px] truncate">
                        {team.nextMilestone}
                      </td>

                      {/* 8. Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={team.status}
                          onChange={(e) => handleUpdateStatus(team.project_id, e.target.value)}
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border cursor-pointer focus:outline-none transition-all ${statusConfig.badge} ${
                            isDark ? 'bg-slate-800' : 'bg-slate-50'
                          }`}
                        >
                          <option value="on_track">🟢 On Track</option>
                          <option value="at_risk">🔴 At Risk</option>
                          <option value="delayed">🟡 Delayed</option>
                          <option value="completed">🔵 Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedTeamModal(team)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-700 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer mr-1.5"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Team Inspection Detail Modal */}
      {selectedTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl border rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4 border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-xs">
                  {selectedTeamModal.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black">{selectedTeamModal.studentName}</h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    Student ID: #{selectedTeamModal.studentId} • {selectedTeamModal.department} • Year {selectedTeamModal.year}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeamModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Details */}
            <div className="space-y-4 text-xs">
              {/* Project Card */}
              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-400">Capstone Project Title</span>
                  <span className="text-[10px] font-bold text-slate-400">Proj #{selectedTeamModal.project_id || 'N/A'}</span>
                </div>
                <h4 className="text-sm font-bold">{selectedTeamModal.projectTitle}</h4>
                <p className="text-slate-400">{selectedTeamModal.domain} Domain</p>
              </div>

              {/* Grid of Key Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase text-slate-400">Project Guide</span>
                  <p className="font-bold text-slate-200 mt-1">{selectedTeamModal.projectGuide}</p>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase text-slate-400">Current Phase</span>
                  <p className="font-bold text-slate-200 mt-1">{selectedTeamModal.currentPhase}</p>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase text-slate-400">Next Milestone</span>
                  <p className="font-bold text-indigo-400 mt-1">{selectedTeamModal.nextMilestone}</p>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase text-slate-400">Overall Progress</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-bold text-white">{selectedTeamModal.overallProgress}%</span>
                    <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${selectedTeamModal.overallProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Check-in & Risk Analysis */}
              {selectedTeamModal.latest_checkin && (
                <div className={`p-3.5 rounded-xl border space-y-1 ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase text-cyan-400">Latest Sprint Check-In</span>
                  <p className="text-slate-300 leading-relaxed">{selectedTeamModal.latest_checkin}</p>
                </div>
              )}

              {selectedTeamModal.risk_analysis_summary && (
                <div className={`p-3.5 rounded-xl border space-y-1 ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase text-rose-400">AI Risk Assessment</span>
                  <p className="text-slate-300 leading-relaxed">{selectedTeamModal.risk_analysis_summary}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <button
                onClick={() => setSelectedTeamModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Pod
              </button>

              {selectedTeamModal.project_id && (
                <button
                  onClick={() => {
                    const t = selectedTeamModal;
                    setSelectedTeamModal(null);
                    if (onSelectProject) onSelectProject(t);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center space-x-1.5"
                >
                  <span>Open Advisory Channel</span>
                  <ArrowRightIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
