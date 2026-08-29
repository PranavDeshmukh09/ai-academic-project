import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const ClipboardCheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const SlidersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
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

const AwardIcon = () => (
  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// --- The 7 Academic Evaluation Stages ---
const EVALUATION_STAGES = [
  { id: 'proposal', name: 'Proposal Review', subtitle: 'Synopsis, Scope & Problem Statement', phaseNum: 1 },
  { id: 'requirements', name: 'Requirement Analysis', subtitle: 'SRS Document & Technical Feasibility', phaseNum: 2 },
  { id: 'design', name: 'Design Review', subtitle: 'Architecture, Schemas & UI Wireframes', phaseNum: 3 },
  { id: 'midterm', name: 'Mid-Term Review', subtitle: 'Midterm Defense & Prototype Demonstration', phaseNum: 4 },
  { id: 'implementation', name: 'Implementation Review', subtitle: 'Codebase, APIs & Algorithm Execution', phaseNum: 5 },
  { id: 'testing', name: 'Testing Review', subtitle: 'Test Coverage, Benchmarking & Edge Cases', phaseNum: 6 },
  { id: 'final', name: 'Final Review', subtitle: 'Final Thesis Defense & System Sign-Off', phaseNum: 7 },
];

// --- Default 6 Evaluation Parameters / Rubric ---
const DEFAULT_RUBRIC_PARAMETERS = [
  { id: 'tech_impl', name: 'Technical Implementation', maxMarks: 20, desc: 'Code quality, system architecture, API design, efficiency and error handling.' },
  { id: 'progress', name: 'Progress & Timeline Adherence', maxMarks: 20, desc: 'Milestone deliverables completion velocity and sprint schedule compliance.' },
  { id: 'doc', name: 'Documentation Quality', maxMarks: 15, desc: 'SRS, architecture diagrams, inline comments, research citations and thesis.' },
  { id: 'innovation', name: 'Innovation & Originality', maxMarks: 15, desc: 'Novelty of approach, creativity, edge integration and academic value.' },
  { id: 'participation', name: 'Team Participation & Collaboration', maxMarks: 15, desc: 'Individual contribution, peer collaboration and sprint engagement.' },
  { id: 'problem_solving', name: 'Problem Solving & Critical Thinking', maxMarks: 15, desc: 'Handling architectural bottlenecks, debugging and adaptive resolution.' },
];

export default function FacultyReviewsView({ currentTheme = 'pastel', onSelectProject }) {
  const [data, setData] = useState({ total_projects: 0, projects: [] });
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // Selected Stage
  const [selectedStageId, setSelectedStageId] = useState('design');

  // Configurable Rubric Parameters
  const [rubricParams, setRubricParams] = useState(() => {
    const saved = localStorage.getItem('academic_eval_rubric_params');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_RUBRIC_PARAMETERS;
  });
  const [showRubricConfigModal, setShowRubricConfigModal] = useState(false);

  // Scores State per project & stage: { [projId_stageId]: { scores: {}, feedback: '', verdict: 'approved', signedAt: '' } }
  const [evaluationsStore, setEvaluationsStore] = useState(() => {
    const saved = localStorage.getItem('academic_project_evaluations_store');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      '12_proposal': {
        scores: { tech_impl: 19, progress: 18, doc: 14, innovation: 14, participation: 15, problem_solving: 14 },
        verdict: 'approved',
        feedback: 'Excellent problem formulation and clear architectural boundaries for multi-agent LLM pipeline.',
        signedAt: 'Aug 04, 2026'
      },
      '12_requirements': {
        scores: { tech_impl: 18, progress: 19, doc: 15, innovation: 13, participation: 14, problem_solving: 15 },
        verdict: 'approved',
        feedback: 'SRS document thoroughly covers functional and non-functional requirements. PostgreSQL schema approved.',
        signedAt: 'Aug 18, 2026'
      },
      '12_design': {
        scores: { tech_impl: 18, progress: 16, doc: 13, innovation: 14, participation: 14, problem_solving: 13 },
        verdict: 'approved',
        feedback: 'Architecture and data flow diagrams are comprehensive. Recommended adding connection pooling failover.',
        signedAt: 'Aug 24, 2026'
      }
    };
  });

  // Current Form Marks
  const [currentMarks, setCurrentMarks] = useState({
    tech_impl: 18,
    progress: 17,
    doc: 14,
    innovation: 13,
    participation: 14,
    problem_solving: 14
  });
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [currentVerdict, setCurrentVerdict] = useState('approved'); // 'approved', 'needs_revision', 'pending'
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      console.error("Error fetching dashboard for reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const selectedProject = useMemo(() => {
    if (!data.projects || data.projects.length === 0) return null;
    return data.projects.find(p => (p.project_id === selectedProjectId || p.student_id === selectedProjectId)) || data.projects[0];
  }, [data.projects, selectedProjectId]);

  // Load existing evaluation data when Project or Stage changes
  useEffect(() => {
    if (selectedProject) {
      const pId = selectedProject.project_id || selectedProject.student_id;
      const key = `${pId}_${selectedStageId}`;
      const savedEval = evaluationsStore[key];

      if (savedEval) {
        setCurrentMarks(savedEval.scores || {});
        setCurrentFeedback(savedEval.feedback || '');
        setCurrentVerdict(savedEval.verdict || 'approved');
      } else {
        // Defaults based on rubric
        const initial = {};
        rubricParams.forEach(p => {
          initial[p.id] = Math.round(p.maxMarks * 0.85);
        });
        setCurrentMarks(initial);
        setCurrentFeedback('');
        setCurrentVerdict('approved');
      }
    }
  }, [selectedProject, selectedStageId, evaluationsStore, rubricParams]);

  // Compute Total Marks & Grade
  const totalMaxMarks = useMemo(() => {
    return rubricParams.reduce((sum, p) => sum + (Number(p.maxMarks) || 0), 0);
  }, [rubricParams]);

  const totalScore = useMemo(() => {
    return rubricParams.reduce((sum, p) => sum + (Number(currentMarks[p.id]) || 0), 0);
  }, [rubricParams, currentMarks]);

  const scorePercentage = totalMaxMarks > 0 ? Math.round((totalScore / totalMaxMarks) * 100) : 0;

  const gradeInfo = useMemo(() => {
    if (scorePercentage >= 90) return { grade: 'A+', label: 'Outstanding / Honors', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (scorePercentage >= 80) return { grade: 'A', label: 'Excellent / Distinction', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    if (scorePercentage >= 70) return { grade: 'B+', label: 'Very Good / Commendable', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    if (scorePercentage >= 60) return { grade: 'B', label: 'Satisfactory / On Track', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    return { grade: 'C', label: 'Needs Improvement / Re-eval', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  }, [scorePercentage]);

  // Handle Mark Slider Change
  const handleScoreChange = (paramId, val, maxMarks) => {
    const num = Math.max(0, Math.min(maxMarks, Number(val) || 0));
    setCurrentMarks(prev => ({
      ...prev,
      [paramId]: num
    }));
  };

  // Save / Sign-off Evaluation
  const handleSaveEvaluation = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    const pId = selectedProject.project_id || selectedProject.student_id;
    const key = `${pId}_${selectedStageId}`;

    const newEval = {
      scores: currentMarks,
      totalScore,
      scorePercentage,
      grade: gradeInfo.grade,
      verdict: currentVerdict,
      feedback: currentFeedback.trim(),
      signedAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updatedStore = {
      ...evaluationsStore,
      [key]: newEval
    };

    setEvaluationsStore(updatedStore);
    localStorage.setItem('academic_project_evaluations_store', JSON.stringify(updatedStore));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Save Custom Rubric Parameters
  const handleSaveRubric = (newParams) => {
    setRubricParams(newParams);
    localStorage.setItem('academic_eval_rubric_params', JSON.stringify(newParams));
    setShowRubricConfigModal(false);
  };

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center space-y-3">
        <div className="w-9 h-9 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-400">Loading Evaluation Matrix...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* 1. Header Banner & Team Selector */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <ClipboardCheckIcon />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Reviews & Project Evaluation Board
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Configurable Rubric Matrix
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Conduct multi-stage academic sign-offs, grade deliverables across 6 evaluation parameters, configure rubrics, and log faculty feedback.
            </p>
          </div>
        </div>

        {/* Project Selector & Configure Rubric Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <div className="space-y-0.5">
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
                  {p.name} — {p.project_title ? p.project_title.slice(0, 30) + '...' : `Project #${p.project_id}`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowRubricConfigModal(true)}
            className={`px-3 py-2 border text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Configure Evaluation Rubric Parameters & Weights"
          >
            <SlidersIcon />
            <span>Configure Rubric</span>
          </button>
        </div>
      </div>

      {/* 2. Seven Academic Review Stages Bar */}
      <div className={`p-4 border rounded-2xl shadow-xs space-y-3 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Lifecycle Evaluation Stages (7 Milestones)
          </span>
          <span className="text-xs font-bold text-indigo-400">
            Selected: {EVALUATION_STAGES.find(s => s.id === selectedStageId)?.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {EVALUATION_STAGES.map((stage) => {
            const pId = selectedProject?.project_id || selectedProject?.student_id;
            const stageEval = evaluationsStore[`${pId}_${stage.id}`];
            const isApproved = stageEval?.verdict === 'approved';
            const isSelected = selectedStageId === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/10'
                    : isApproved
                      ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                      : isDark ? 'border-slate-800 bg-slate-800/30 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase">
                    <span className="text-slate-400">Stage {stage.phaseNum}</span>
                    {isApproved && <span className="text-emerald-400">✓ Signed</span>}
                  </div>
                  <h4 className={`text-xs font-black leading-tight mt-0.5 ${isSelected ? 'text-indigo-400' : isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {stage.name}
                  </h4>
                </div>

                <div className="text-[10px] font-bold">
                  {stageEval ? (
                    <span className="text-emerald-400">{stageEval.scorePercentage}% ({stageEval.grade})</span>
                  ) : (
                    <span className="text-slate-500">Pending Eval</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Review Scoring Form & Live Grade Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 6 Configurable Evaluation Parameters Scoring Sheet */}
        <div className={`lg:col-span-2 p-6 border rounded-2xl shadow-xs space-y-5 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200/60 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <AwardIcon />
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {EVALUATION_STAGES.find(s => s.id === selectedStageId)?.name} — Evaluation Sheet
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {EVALUATION_STAGES.find(s => s.id === selectedStageId)?.subtitle}
              </p>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 self-start sm:self-auto">
              Total Weight: {totalMaxMarks} Marks
            </span>
          </div>

          <form onSubmit={handleSaveEvaluation} className="space-y-5">
            {/* The 6 Evaluation Parameters Matrix */}
            <div className="space-y-4">
              {rubricParams.map((param) => {
                const score = currentMarks[param.id] !== undefined ? currentMarks[param.id] : Math.round(param.maxMarks * 0.85);
                const pct = Math.round((score / param.maxMarks) * 100);

                return (
                  <div
                    key={param.id}
                    className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                      isDark ? 'bg-slate-800/40 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50 border-slate-200/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {param.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold">
                            (Max: {param.maxMarks} Marks)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {param.desc}
                        </p>
                      </div>

                      {/* Marks Stepper / Input */}
                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                        <input
                          type="number"
                          min="0"
                          max={param.maxMarks}
                          value={score}
                          onChange={(e) => handleScoreChange(param.id, e.target.value, param.maxMarks)}
                          className={`w-14 p-1.5 text-center text-xs font-black rounded-lg border focus:outline-none ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-400">/ {param.maxMarks}</span>
                      </div>
                    </div>

                    {/* Interactive Range Slider */}
                    <div className="flex items-center space-x-3 pt-1">
                      <input
                        type="range"
                        min="0"
                        max={param.maxMarks}
                        value={score}
                        onChange={(e) => handleScoreChange(param.id, e.target.value, param.maxMarks)}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <span className="text-[10px] font-black text-indigo-400 w-9 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Qualitative Feedback & Action Items */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <label className="text-xs font-black uppercase text-slate-300 block">
                Faculty Review Comments, Commendations & Mandatory Action Items
              </label>
              <textarea
                value={currentFeedback}
                onChange={(e) => setCurrentFeedback(e.target.value)}
                placeholder="Document specific strengths, architectural bottlenecks, testing gaps, and requirements for the next stage..."
                rows="3"
                className={`w-full p-3 border rounded-xl text-xs font-medium focus:outline-none transition-all ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Verdict & Submit Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400">Stage Verdict:</span>
                <select
                  value={currentVerdict}
                  onChange={(e) => setCurrentVerdict(e.target.value)}
                  className={`py-1.5 px-3 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                    currentVerdict === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  <option value="approved">✅ Sign-Off & Approve Stage</option>
                  <option value="needs_revision">⚠️ Needs Revision (Resubmit)</option>
                  <option value="pending">⏳ Pending Further Evidence</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-400 animate-fadeIn">
                    ✓ Stage Evaluation Signed Off!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <ClipboardCheckIcon />
                  <span>Save & Sign-off Stage</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Live Grade Summary & Evaluation History */}
        <div className="space-y-5">
          {/* Live Scorecard Card */}
          <div className={`p-6 border rounded-2xl shadow-xs space-y-4 text-center ${cardBg}`}>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Cumulative Stage Grade
            </span>

            {/* Big Grade Badge */}
            <div className="py-2">
              <div className="text-5xl font-black text-indigo-400 tracking-tight">
                {totalScore} <span className="text-lg text-slate-400 font-bold">/ {totalMaxMarks}</span>
              </div>
              <div className="mt-2">
                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${gradeInfo.color}`}>
                  Grade {gradeInfo.grade} • {gradeInfo.label}
                </span>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Normalized Percentage</span>
                <span className="text-slate-200 font-black">{scorePercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${scorePercentage}%` }}
                />
              </div>
            </div>

            {/* Student & Project Details */}
            {selectedProject && (
              <div className={`p-3 rounded-xl border text-left text-xs space-y-1 ${
                isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="font-bold text-slate-200">{selectedProject.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{selectedProject.project_title}</div>
                <div className="text-[10px] text-indigo-400 font-semibold">Guide: {selectedProject.guide_name || 'Dr. R. K. Sharma'}</div>
              </div>
            )}
          </div>

          {/* Evaluated Stages Ledger */}
          <div className={`p-6 border rounded-2xl shadow-xs space-y-3.5 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Signed-Off Stages Ledger
              </h4>
              <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                Semester Transcript
              </span>
            </div>

            <div className="space-y-2.5">
              {EVALUATION_STAGES.map((stg) => {
                const pId = selectedProject?.project_id || selectedProject?.student_id;
                const ev = evaluationsStore[`${pId}_${stg.id}`];

                return (
                  <div
                    key={stg.id}
                    onClick={() => setSelectedStageId(stg.id)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      selectedStageId === stg.id 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : isDark ? 'border-slate-800 bg-slate-800/30 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-200 block">{stg.name}</span>
                      <span className="text-[10px] text-slate-400">{ev?.signedAt || 'Not evaluated yet'}</span>
                    </div>

                    <div className="text-right shrink-0">
                      {ev ? (
                        <div>
                          <span className="font-black text-emerald-400">{ev.scorePercentage}%</span>
                          <span className="text-[10px] text-slate-400 block">Grade {ev.grade}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Configurable Rubric Modal */}
      {showRubricConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl border rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <SlidersIcon />
                <h3 className="text-base font-black">Configure Evaluation Rubric & Parameter Weights</h3>
              </div>
              <button
                onClick={() => setShowRubricConfigModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Customize maximum marks and descriptions for the 6 core evaluation parameters according to your department's grading syllabus.
            </p>

            <div className="space-y-3 text-xs">
              {rubricParams.map((p, idx) => (
                <div key={p.id} className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => {
                        const updated = [...rubricParams];
                        updated[idx].name = e.target.value;
                        setRubricParams(updated);
                      }}
                      className={`font-bold p-1 border rounded-lg text-xs ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span className="text-slate-400 text-[10px] font-bold">Max Marks:</span>
                      <input
                        type="number"
                        min="5"
                        max="50"
                        value={p.maxMarks}
                        onChange={(e) => {
                          const updated = [...rubricParams];
                          updated[idx].maxMarks = Number(e.target.value) || 10;
                          setRubricParams(updated);
                        }}
                        className={`w-14 p-1 text-center font-bold border rounded-lg text-xs ${
                          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={p.desc}
                    onChange={(e) => {
                      const updated = [...rubricParams];
                      updated[idx].desc = e.target.value;
                      setRubricParams(updated);
                    }}
                    placeholder="Rubric grading criteria description..."
                    className={`w-full p-1.5 border rounded-lg text-[11px] ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSaveRubric(DEFAULT_RUBRIC_PARAMETERS)}
                className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
              >
                Reset to University Default Rubric
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRubricConfigModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveRubric(rubricParams)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Save Rubric Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
