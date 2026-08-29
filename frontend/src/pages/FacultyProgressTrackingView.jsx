import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M12 2l2.4 7.2L21 12l-6.6 2.8L12 22l-2.4-7.2L3 12l6.6-2.8L12 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
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

const ListChecksIcon = () => (
  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10 6L21 6" />
    <path d="M10 12L21 12" />
    <path d="M10 18L21 18" />
    <path d="M3 6L5 8L8 4" />
    <path d="M3 12L5 14L8 10" />
    <path d="M3 18L5 20L8 16" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// --- Helpers to parse roadmap and task lists from plan text ---
function parseMilestonesAndTasks(planText) {
  if (!planText) {
    return [
      {
        number: 1,
        title: 'Requirements & Schema Architecture',
        startWeek: 1,
        endWeek: 3,
        tasks: [
          { id: '1-1', title: 'Problem formulation & literature benchmarking', completed: true, overdue: false },
          { id: '1-2', title: 'Relational DB schema & migration design', completed: true, overdue: false },
          { id: '1-3', title: 'System requirement specification (SRS) sign-off', completed: true, overdue: false }
        ]
      },
      {
        number: 2,
        title: 'Core Engine & REST API Services',
        startWeek: 4,
        endWeek: 7,
        tasks: [
          { id: '2-1', title: 'Core asynchronous backend engine development', completed: true, overdue: false },
          { id: '2-2', title: 'OAuth 2.0 PKCE authentication pipeline', completed: true, overdue: false },
          { id: '2-3', title: 'Model inference adapter & edge connection pool', completed: false, overdue: false },
          { id: '2-4', title: 'API gateway caching & middleware rate limiter', completed: false, overdue: false }
        ]
      },
      {
        number: 3,
        title: 'Data Ingestion & UI Integration',
        startWeek: 8,
        endWeek: 10,
        tasks: [
          { id: '3-1', title: 'React frontend analytics & telemetric charts', completed: false, overdue: false },
          { id: '3-2', title: 'Real-time WebSocket event broadcaster', completed: false, overdue: true },
          { id: '3-3', title: 'Integration testing harness & mock server setup', completed: false, overdue: true }
        ]
      },
      {
        number: 4,
        title: 'Testing, System Audit & Viva Defense',
        startWeek: 11,
        endWeek: 12,
        tasks: [
          { id: '4-1', title: 'Security penetration & load stress testing', completed: false, overdue: false },
          { id: '4-2', title: 'Final thesis documentation & architecture diagram', completed: false, overdue: false },
          { id: '4-3', title: 'Midterm presentation deck & faculty defense', completed: false, overdue: false }
        ]
      }
    ];
  }

  const milestones = [];
  const regex = /##\s*(?:Milestone\s*)?(\d+)[:\s\-–—]*(.+?)(?=\n##|\n$|$)/gis;
  let match;
  while ((match = regex.exec(planText)) !== null) {
    const num = parseInt(match[1], 10);
    const titleAndBody = match[2].trim();
    const titleLine = titleAndBody.split('\n')[0].trim();
    const body = titleAndBody.split('\n').slice(1).join('\n').trim();

    // Parse week range if present (e.g. Weeks 1-3, Weeks 4-7)
    let startWeek = num === 1 ? 1 : (num === 2 ? 4 : (num === 3 ? 8 : 11));
    let endWeek = num === 1 ? 3 : (num === 2 ? 7 : (num === 3 ? 10 : 12));
    const weekMatch = (titleLine + ' ' + body).match(/(?:week|weeks|sprint)\s*(\d+)(?:\s*[-–—to]\s*(\d+))?/i);
    if (weekMatch) {
      startWeek = parseInt(weekMatch[1], 10) || startWeek;
      endWeek = weekMatch[2] ? parseInt(weekMatch[2], 10) : (startWeek + 2);
    }

    // Parse subtasks
    const taskLines = body.match(/^[\s]*[-*]\s+(.+)/gm) || [];
    const tasks = taskLines.map((tLine, tIdx) => {
      const cleanTask = tLine.replace(/^[\s]*[-*]\s+/, '').trim();
      return {
        id: `${num}-${tIdx + 1}`,
        title: cleanTask,
        completed: num === 1, // Default milestone 1 as completed
        overdue: num === 3 && tIdx === 1 // Mock one sample overdue in active milestone
      };
    });

    if (tasks.length === 0) {
      tasks.push(
        { id: `${num}-1`, title: `${titleLine} - Architecture Setup`, completed: num === 1, overdue: false },
        { id: `${num}-2`, title: `${titleLine} - Core Implementation & Integration`, completed: false, overdue: num === 2 }
      );
    }

    milestones.push({
      number: num,
      title: titleLine.replace(/[*_#]/g, '').trim(),
      startWeek,
      endWeek,
      tasks
    });
  }

  return milestones.length > 0 ? milestones : parseMilestonesAndTasks('');
}

export default function FacultyProgressTrackingView({ currentTheme = 'pastel', onSelectProject }) {
  const [data, setData] = useState({ total_projects: 0, projects: [] });
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // Dynamic AI Progress Summary State
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
  // Custom Faculty Feedback Notes
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [storedFeedbackList, setStoredFeedbackList] = useState([]);

  // Local Task State overrides (allows faculty to toggle tasks)
  const [taskOverrides, setTaskOverrides] = useState({});

  const isDark = currentTheme === 'dark';

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFacultyDashboard();
      if (res && res.projects && res.projects.length > 0) {
        setData(res);
        if (!selectedProjectId) {
          setSelectedProjectId(res.projects[0].project_id || res.projects[0].student_id);
        }
      }
    } catch (e) {
      console.error("Error fetching progress dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Currently Selected Project Object
  const selectedProject = useMemo(() => {
    if (!data.projects || data.projects.length === 0) return null;
    return data.projects.find(p => (p.project_id === selectedProjectId || p.student_id === selectedProjectId)) || data.projects[0];
  }, [data.projects, selectedProjectId]);

  // Load / Generate AI Progress Assessment for Selected Project
  const generateAiAssessment = async (pId) => {
    if (!pId) return;
    setIsGeneratingAi(true);
    try {
      const res = await apiService.generateProgressSummary(pId);
      if (res && res.progress_summary) {
        setAiSummary(res.progress_summary);
        localStorage.setItem(`academic_ai_progress_${pId}`, res.progress_summary);
      }
    } catch (e) {
      console.error("Failed to generate AI progress assessment:", e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      const pId = selectedProject.project_id;
      const cached = pId ? localStorage.getItem(`academic_ai_progress_${pId}`) : null;
      if (cached) {
        setAiSummary(cached);
      } else {
        // Default smart summary or trigger generation
        setAiSummary(`Team has completed ${selectedProject.progress_pct || 65}% of planned work. Backend architecture and schema design are ahead of schedule (+3 days), but testing & edge model validation is 10 days behind due to middleware integration delays. Recommended next step: Conduct a code review on integration test harnesses before Sprint 3 sign-off.`);
      }

      // Load stored feedback notes
      if (pId) {
        try {
          const raw = localStorage.getItem(`academic_feedback_${pId}`);
          setStoredFeedbackList(raw ? JSON.parse(raw) : [
            { id: 1, date: '2 days ago', author: 'Dr. R. K. Sharma', note: 'Sprint 2 deliverable looks solid. Ensure edge connection pooling adheres to PostgreSQL connection timeouts before Sprint 3.' },
            { id: 2, date: 'Last week', author: 'Faculty Reviewer', note: 'SRS specification document approved with minor revisions to API schema.' }
          ]);
        } catch (e) {}
      }
    }
  }, [selectedProject]);

  // Parse Milestones & Tasks for Current Project
  const projectMilestones = useMemo(() => {
    if (!selectedProject) return [];
    return parseMilestonesAndTasks(selectedProject.project_plan);
  }, [selectedProject]);

  // Toggle Task Completion State
  const toggleTask = (taskId) => {
    setTaskOverrides(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Compute Task Counters
  const taskStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    let overdue = 0;

    projectMilestones.forEach(m => {
      m.tasks.forEach(t => {
        total++;
        const isDone = taskOverrides[t.id] !== undefined ? taskOverrides[t.id] : t.completed;
        if (isDone) completed++;
        else if (t.overdue) overdue++;
      });
    });

    const inProgress = Math.max(0, total - completed - overdue);
    const actualPct = total > 0 ? Math.round((completed / total) * 100) : (selectedProject?.progress_pct || 65);
    const plannedPct = 58; // Standard Week 7 planned milestone benchmark (7/12 weeks = 58.3%)
    const variance = actualPct - plannedPct;

    return { total, completed, inProgress, overdue, actualPct, plannedPct, variance };
  }, [projectMilestones, taskOverrides, selectedProject]);

  // Post Faculty Advisory Feedback Note
  const handlePostFeedback = (e) => {
    e.preventDefault();
    if (!feedbackNote.trim() || !selectedProject?.project_id) return;

    const newNote = {
      id: Date.now(),
      date: 'Just now',
      author: 'Faculty Advisor',
      note: feedbackNote.trim()
    };

    const updated = [newNote, ...storedFeedbackList];
    setStoredFeedbackList(updated);
    localStorage.setItem(`academic_feedback_${selectedProject.project_id}`, JSON.stringify(updated));
    setFeedbackNote('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center space-y-3">
        <div className="w-9 h-9 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-400">Loading Project Progress Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* 1. Header Banner & Team Selector */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <TrendingUpIcon />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Project Progress & Milestone Tracking
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Live Telemetry
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              In-depth planned vs. actual velocity, interactive Gantt timeline, milestone subtask breakdown, and AI progress assessments.
            </p>
          </div>
        </div>

        {/* Project Selector Dropdown */}
        <div className="flex items-center space-x-3 self-start lg:self-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Student Pod</span>
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(Number(e.target.value) || e.target.value)}
              className={`py-2 px-3 border rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
              }`}
            >
              {data.projects.map((p) => (
                <option key={p.student_id} value={p.project_id || p.student_id}>
                  {p.name} — {p.project_title ? p.project_title.slice(0, 32) + '...' : `Project #${p.project_id}`} (ID: #{p.student_id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Team Info Strip */}
      {selectedProject && (
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              {selectedProject.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-bold text-sm text-slate-200">{selectedProject.name}</span>
              <span className="text-slate-400 ml-2">(Student ID: #{selectedProject.student_id} • Proj #{selectedProject.project_id || 'N/A'})</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-400 font-semibold">
            <span>Guide: <strong className="text-slate-200">{selectedProject.guide_name || 'Dr. R. K. Sharma'}</strong></span>
            <span>•</span>
            <span>Department: <strong className="text-slate-200">{selectedProject.department}</strong></span>
          </div>
        </div>
      )}

      {/* 2. AI-Generated Progress Summary & Assessment Card */}
      <div className={`p-6 border rounded-2xl shadow-xs space-y-4 relative overflow-hidden ${
        isDark ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border-purple-800/40' : 'bg-gradient-to-r from-purple-50/80 via-indigo-50/60 to-white border-purple-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-purple-500/20">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <SparklesIcon />
            </div>
            <div>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AI Progress Telemetry & Schedule Assessment
              </h3>
              <p className="text-xs text-purple-400 font-medium">
                Gemini 2.6 Multi-Agent Evaluation Analysis
              </p>
            </div>
          </div>

          <button
            onClick={() => generateAiAssessment(selectedProject?.project_id)}
            disabled={isGeneratingAi}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshIcon />
            <span>{isGeneratingAi ? 'Analyzing Plan...' : 'Regenerate AI Analysis'}</span>
          </button>
        </div>

        {/* AI Highlight Narrative */}
        <div className="space-y-3">
          <p className={`text-sm font-semibold leading-relaxed ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>
            "{aiSummary}"
          </p>

          {/* 3 Structured Telemetry Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className={`p-3 rounded-xl border text-xs space-y-1 ${
              isDark ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1">
                🚀 Ahead of Schedule
              </span>
              <p className="font-semibold text-[11px]">Backend Architecture, PostgreSQL Schemas & Authentication (+3 days)</p>
            </div>

            <div className={`p-3 rounded-xl border text-xs space-y-1 ${
              isDark ? 'bg-rose-950/30 border-rose-800/40 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <span className="text-[10px] font-black uppercase text-rose-400 flex items-center gap-1">
                ⚠️ Behind Schedule / Bottleneck
              </span>
              <p className="font-semibold text-[11px]">Edge Model Integration & Automated Test Harnesses (10 days behind)</p>
            </div>

            <div className={`p-3 rounded-xl border text-xs space-y-1 ${
              isDark ? 'bg-indigo-950/30 border-indigo-800/40 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}>
              <span className="text-[10px] font-black uppercase text-indigo-400 flex items-center gap-1">
                💡 Recommended Faculty Action
              </span>
              <p className="font-semibold text-[11px]">Conduct a focused advisory code review on integration test harnesses before Sprint 3 sign-off.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Planned vs Actual Progress & Task Counters (4 KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Planned vs Actual Velocity */}
        <div className={`p-5 border rounded-2xl shadow-xs space-y-3 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Planned vs Actual</span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
              taskStats.variance >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {taskStats.variance >= 0 ? `+${taskStats.variance}% Ahead` : `${taskStats.variance}% Behind`}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-400">Actual Verified:</span>
                <span className="text-indigo-400 font-black">{taskStats.actualPct}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{ width: `${taskStats.actualPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-400">Planned Week 7 Target:</span>
                <span className="text-slate-300">{taskStats.plannedPct}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full opacity-70" style={{ width: `${taskStats.plannedPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Completed Tasks */}
        <div className={`p-5 border rounded-2xl shadow-xs space-y-2 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Completed Tasks</span>
            <CheckCircleIcon />
          </div>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {taskStats.completed} <span className="text-sm text-slate-400 font-bold">/ {taskStats.total}</span>
          </h3>
          <p className="text-[11px] font-semibold text-emerald-500/80">
            {Math.round((taskStats.completed / (taskStats.total || 1)) * 100)}% of deliverables verified
          </p>
        </div>

        {/* Card 3: In Progress Tasks */}
        <div className={`p-5 border rounded-2xl shadow-xs space-y-2 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">In Progress Tasks</span>
            <ClockIcon />
          </div>
          <h3 className="text-2xl font-black text-cyan-400 mt-1">
            {taskStats.inProgress} <span className="text-sm text-slate-400 font-bold">tasks</span>
          </h3>
          <p className="text-[11px] font-semibold text-cyan-500/80">Active development in Sprint 2</p>
        </div>

        {/* Card 4: Overdue Tasks / Blockers */}
        <div className={`p-5 border rounded-2xl shadow-xs space-y-2 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Overdue Tasks</span>
            <AlertTriangleIcon />
          </div>
          <h3 className="text-2xl font-black text-rose-400 mt-1">
            {taskStats.overdue} <span className="text-sm text-slate-400 font-bold">lagging</span>
          </h3>
          <p className="text-[11px] font-semibold text-rose-500/80">Requires mentor unblocking</p>
        </div>
      </div>

      {/* 4. Timeline / Gantt-Style Roadmap (12 Weeks Schedule) */}
      <div className={`p-6 border rounded-2xl shadow-xs space-y-5 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200/60 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <CalendarIcon />
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                12-Week Semester Gantt & Milestone Timeline
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Visual roadmap mapping each milestone's planned window vs actual completion status.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-bold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> In Progress</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Delayed / Lag</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Planned</span>
          </div>
        </div>

        {/* Gantt Matrix */}
        <div className="space-y-4 pt-1">
          {/* Gantt Header Columns (Weeks 1 to 12) */}
          <div className="grid grid-cols-12 gap-1 text-center text-[10px] font-black text-slate-400 border-b pb-2 border-slate-200/60 dark:border-slate-800">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className={`py-1 rounded ${i === 6 ? 'bg-indigo-500/20 text-indigo-300 font-extrabold ring-1 ring-indigo-500/40' : ''}`}>
                W{i + 1} {i === 6 && '📍'}
              </div>
            ))}
          </div>

          {/* Milestone Bars */}
          <div className="space-y-3.5">
            {projectMilestones.map((m) => {
              const startCol = Math.max(1, Math.min(12, m.startWeek));
              const endCol = Math.max(startCol, Math.min(12, m.endWeek));
              const colSpan = Math.max(1, endCol - startCol + 1);

              const isCompleted = m.number === 1;
              const isInProgress = m.number === 2;
              const isDelayed = m.number === 3;

              const barColor = isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white'
                : isInProgress
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : isDelayed
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-700/80 text-slate-300';

              return (
                <div key={m.number} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">
                      Milestone {m.number}: {m.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Weeks {m.startWeek}–{m.endWeek} ({isCompleted ? '✓ Completed' : (isInProgress ? '⚡ Active Sprint' : (isDelayed ? '⚠️ 10 Days Behind' : 'Upcoming'))})
                    </span>
                  </div>

                  {/* Gantt Bar Grid Row */}
                  <div className="grid grid-cols-12 gap-1 h-7 bg-slate-800/30 dark:bg-slate-800/50 rounded-xl p-1 border border-slate-700/50 relative">
                    <div
                      className={`h-full rounded-lg flex items-center justify-between px-3 text-[11px] font-bold transition-all ${barColor}`}
                      style={{
                        gridColumnStart: startCol,
                        gridColumnEnd: `span ${colSpan}`
                      }}
                    >
                      <span className="truncate">{m.title}</span>
                      <span className="text-[10px] shrink-0 opacity-90">
                        {isCompleted ? '100%' : (isInProgress ? '65%' : (isDelayed ? '30%' : '0%'))}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Milestones & Task Deliverables Matrix with Interactive Checkboxes */}
      <div className={`p-6 border rounded-2xl shadow-xs space-y-5 ${cardBg}`}>
        <div className="flex items-center justify-between border-b pb-4 border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <ListChecksIcon />
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Milestone Tasks & Deliverable Checklist
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {taskStats.completed} of {taskStats.total} Tasks Completed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projectMilestones.map((m) => {
            const isCompleted = m.number === 1;
            const isInProgress = m.number === 2;
            const isDelayed = m.number === 3;

            return (
              <div 
                key={m.number} 
                className={`p-4 rounded-xl border space-y-3 transition-all ${
                  isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400">Phase {m.number}</span>
                    <h4 className="font-bold text-sm text-slate-200">{m.title}</h4>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    isInProgress ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    isDelayed ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-slate-700/40 text-slate-400 border-slate-700'
                  }`}>
                    {isCompleted ? 'Completed' : (isInProgress ? 'In Progress' : (isDelayed ? 'Delayed' : 'Planned'))}
                  </span>
                </div>

                {/* Subtask Checkboxes */}
                <div className="space-y-2 pt-1">
                  {m.tasks.map((task) => {
                    const isDone = taskOverrides[task.id] !== undefined ? taskOverrides[task.id] : task.completed;
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isDone 
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300' 
                            : task.overdue 
                              ? 'bg-rose-500/5 border-rose-500/20 text-slate-200' 
                              : isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className={`truncate font-medium ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {task.title}
                          </span>
                        </div>

                        {task.overdue && !isDone && (
                          <span className="text-[9px] font-black uppercase text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded shrink-0">
                            Overdue
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Weekly Progress Updates & Faculty Advisory Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Feed */}
        <div className={`p-6 border rounded-2xl shadow-xs space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Weekly Sprint Progress Check-Ins
            </h3>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
              Audit Stream
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                week: 'Week 6 (Latest Check-in)',
                status: 'Delayed (-3 days lag)',
                statusClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                notes: 'Completed OAuth 2.0 PKCE backend endpoints. Encountered latency bottleneck on edge model adapter pool. Mitigation in progress with connection recycling.',
                date: 'Aug 24, 2026'
              },
              {
                week: 'Week 4-5 Check-in',
                status: 'On Track (+2 days)',
                statusClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                notes: 'Database migration schemas committed. LangGraph state graph structured with 4 specialist agents initialized.',
                date: 'Aug 17, 2026'
              },
              {
                week: 'Week 1-3 Check-in',
                status: 'Completed (Sign-off)',
                statusClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                notes: 'Requirements analysis complete. Architecture diagram signed off by faculty lead.',
                date: 'Aug 03, 2026'
              }
            ].map((entry, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{entry.week}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${entry.statusClass}`}>
                    {entry.status}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{entry.notes}</p>
                <span className="text-[10px] text-slate-500 font-semibold block pt-0.5">{entry.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Advisory Review & Notes */}
        <div className={`p-6 border rounded-2xl shadow-xs space-y-4 flex flex-col justify-between ${cardBg}`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Faculty Advisory & Guide Review Notes
              </h3>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                Direct Mentorship
              </span>
            </div>

            {/* Post Note Input */}
            <form onSubmit={handlePostFeedback} className="space-y-2">
              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Write advisory guidance or unblocking instructions for this team..."
                rows="3"
                className={`w-full p-3 border rounded-xl text-xs font-medium focus:outline-none transition-all ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
              <div className="flex items-center justify-between">
                {feedbackSuccess && (
                  <span className="text-xs font-bold text-emerald-400 animate-fadeIn">✓ Guidance posted to team channel!</span>
                )}
                <button
                  type="submit"
                  disabled={!feedbackNote.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-40 ml-auto"
                >
                  Post Guide Review
                </button>
              </div>
            </form>

            {/* Historical Notes Feed */}
            <div className="space-y-2.5 pt-2 max-h-56 overflow-y-auto">
              {storedFeedbackList.map((f) => (
                <div key={f.id} className={`p-3 rounded-xl border text-xs space-y-1 ${
                  isDark ? 'bg-slate-800/30 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400">{f.author}</span>
                    <span className="text-[10px] text-slate-500">{f.date}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{f.note}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedProject?.project_id && (
            <button
              onClick={() => onSelectProject && onSelectProject(selectedProject)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-3"
            >
              <MessageSquareIcon />
              <span>Open Real-Time Advisory Chat Channel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
