import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const FolderKanbanIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <path d="M8 10v4" />
    <path d="M12 10v2" />
    <path d="M16 10v6" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function FacultyProjectsView({ currentTheme = 'pastel', onSelectProject }) {
  const [data, setData] = useState({ total_projects: 0, projects: [] });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('progress_desc');

  // Inspection Modal
  const [inspectingProject, setInspectingProject] = useState(null);

  const isDark = currentTheme === 'dark';

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFacultyDashboard();
      if (res && res.projects) {
        setData(res);
      }
    } catch (e) {
      console.error("Error fetching projects directory:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Domains List
  const domains = useMemo(() => {
    const set = new Set();
    data.projects.forEach(p => {
      if (p.domain) set.add(p.domain);
    });
    return ['All', ...Array.from(set)];
  }, [data.projects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return data.projects.filter(p => {
      if (selectedDomain !== 'All' && p.domain !== selectedDomain) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = p.project_title?.toLowerCase().includes(q);
        const nameMatch = p.name?.toLowerCase().includes(q);
        const idMatch = String(p.project_id).includes(q) || String(p.student_id).includes(q);
        const domainMatch = p.domain?.toLowerCase().includes(q);
        if (!titleMatch && !nameMatch && !idMatch && !domainMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'progress_desc') return (b.progress_pct || 0) - (a.progress_pct || 0);
      if (selectedSort === 'progress_asc') return (a.progress_pct || 0) - (b.progress_pct || 0);
      if (selectedSort === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [data.projects, selectedDomain, selectedStatus, searchQuery, selectedSort]);

  // KPIs
  const kpis = useMemo(() => {
    const total = data.projects.length || 0;
    const active = data.projects.filter(p => (p.progress_pct || 0) < 100).length;
    const completed = data.projects.filter(p => (p.progress_pct || 0) >= 100).length;
    const onTrack = data.projects.filter(p => p.status === 'On Track').length;
    const delayed = data.projects.filter(p => p.status === 'Delayed' || p.status === 'At Risk').length;

    return { total, active, completed, onTrack, delayed };
  }, [data.projects]);

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center space-y-3">
        <div className="w-9 h-9 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-400">Loading Capstone Projects Directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <FolderKanbanIcon />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Capstone Projects Master Directory
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {kpis.total} Projects Registered
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Search, filter, audit technical stacks, and inspect live deliverable states across all department capstone projects.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Projects</span>
            <FolderKanbanIcon />
          </div>
          <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{kpis.total}</h3>
          <p className="text-[10px] font-bold text-slate-400">All Academic Cohorts</p>
        </div>

        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Projects On Track</span>
            <CheckCircleIcon />
          </div>
          <h3 className="text-2xl font-black text-emerald-400">{kpis.onTrack}</h3>
          <p className="text-[10px] font-bold text-emerald-500/80">Meeting Milestone Deadlines</p>
        </div>

        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Delayed / Lagging</span>
            <AlertTriangleIcon />
          </div>
          <h3 className="text-2xl font-black text-rose-400">{kpis.delayed}</h3>
          <p className="text-[10px] font-bold text-rose-500/80">Requires Faculty Unblocking</p>
        </div>

        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Active Sprints</span>
            <ClockIcon />
          </div>
          <h3 className="text-2xl font-black text-purple-400">{kpis.active}</h3>
          <p className="text-[10px] font-bold text-purple-500/80">In Development / Review</p>
        </div>
      </div>

      {/* 3. Filter Toolbar */}
      <div className={`p-4 border rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project title, student name, project ID..."
            className={`w-full pl-9 pr-3 py-2 text-xs font-medium border rounded-xl focus:outline-none transition-all ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Domain:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className={`py-1.5 px-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`py-1.5 px-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-bold text-[10px] uppercase">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className={`py-1.5 px-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="progress_desc">Highest Progress</option>
              <option value="progress_asc">Lowest Progress</option>
              <option value="name_asc">Student Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => {
          const progress = p.progress_pct || 65;
          const status = p.status || (progress >= 70 ? 'On Track' : (progress < 50 ? 'Delayed' : 'At Risk'));
          const statusClass = status === 'On Track' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : status === 'Delayed'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

          return (
            <div
              key={p.student_id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all shadow-xs ${cardBg}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {p.domain || 'Artificial Intelligence'}
                  </span>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${statusClass}`}>
                    {status}
                  </span>
                </div>

                <div>
                  <h3 className={`text-sm font-black leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {p.project_title || 'Capstone Project'}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    Lead: <strong className="text-slate-300">{p.name}</strong> (Student ID: #{p.student_id} • Proj #{p.project_id || 'N/A'})
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Overall Progress</span>
                    <span className="text-slate-200 font-black">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pt-1">
                  <span>Guide: <strong className="text-slate-300">{p.guide_name || 'Dr. R. K. Sharma'}</strong></span>
                  <span>Dept: <strong className="text-slate-300">{p.department}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectingProject(p)}
                  className="flex-1 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <EyeIcon />
                  <span>Inspect Details</span>
                </button>

                <button
                  onClick={() => onSelectProject && onSelectProject(p)}
                  className="p-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer"
                  title="Open Real-time Chat Channel"
                >
                  <MessageSquareIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Project Inspection Modal */}
      {inspectingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-400">{inspectingProject.domain}</span>
                <h3 className="text-base font-black">{inspectingProject.project_title}</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Student Lead: {inspectingProject.name} (ID: #{inspectingProject.student_id})
                </p>
              </div>
              <button onClick={() => setInspectingProject(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className={`p-4 rounded-xl border space-y-1.5 ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold text-slate-200">Project Telemetry & Plan Overview</h4>
                <div className="font-mono whitespace-pre-wrap max-h-48 overflow-y-auto text-[11px] text-slate-300 leading-relaxed">
                  {inspectingProject.project_plan || 'No detailed plan loaded.'}
                </div>
              </div>

              {inspectingProject.tech_stack && (
                <div className={`p-4 rounded-xl border space-y-1.5 ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="font-bold text-slate-200">Technical Architecture & Stack</h4>
                  <div className="font-mono whitespace-pre-wrap max-h-36 overflow-y-auto text-[11px] text-slate-300 leading-relaxed">
                    {inspectingProject.tech_stack}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <button
                onClick={() => setInspectingProject(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setInspectingProject(null);
                  if (onSelectProject) onSelectProject(inspectingProject);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Open Advisory Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
