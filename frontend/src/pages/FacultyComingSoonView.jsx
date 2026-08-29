import React, { useState } from 'react';

// --- SVG Icons ---
const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FolderKanbanIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <path d="M8 10v4" />
    <path d="M12 10v2" />
    <path d="M16 10v6" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const MODULE_DATA = {
  'faculty-teams': {
    title: 'My Teams & Capstone Pods',
    tagline: 'Team formation, leader assignment, cross-project repo syncing, and workload balancing.',
    icon: <UsersIcon />,
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    accentColor: 'blue',
    features: [
      'Automated student team formation based on complementary skill matrices',
      'Team Lead, Scrum Master & GitHub repository collaborator mapping',
      'Live sprint velocity & individual student contribution scoring',
      'Team office hours booking and direct faculty advisory channels'
    ],
    roadmapStage: 'Sprint 2 · In Active Design'
  },
  'faculty-projects': {
    title: 'Projects Portfolio & Approval Matrix',
    tagline: 'Capstone proposal evaluation, scope adjustment approvals, and cross-department allocation.',
    icon: <FolderKanbanIcon />,
    gradient: 'from-purple-600 via-indigo-600 to-pink-500',
    accentColor: 'purple',
    features: [
      'One-click project proposal approval, revision requests, and scope locking',
      'Multi-department domain tagging (AI/ML, FinTech, IoT, Cloud, BioTech)',
      'Industry partner, research lab & faculty sponsor allocation matrix',
      'Project milestone versioning and change audit trail'
    ],
    roadmapStage: 'Sprint 2 · Architecture Phase'
  },
  'faculty-progress': {
    title: 'Progress Tracking & Sprint Telemetry',
    tagline: 'Granular milestone velocity, schedule delay detection, and automated blocker triage.',
    icon: <TrendingUpIcon />,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    accentColor: 'emerald',
    features: [
      'Live 12-week semester burndown chart across all active cohorts',
      'Automated roadblock & schedule delay alerts triggered by AI models',
      'GitHub / GitLab CI/CD and commit activity integration',
      'Weekly student check-in completion audit logs and streak tracking'
    ],
    roadmapStage: 'Sprint 3 · Data Modeling'
  },
  'faculty-insights': {
    title: 'AI Insights & Anomaly Intelligence',
    tagline: 'Cross-project LLM analytics, learning curve diagnostics, and skill gap predictions.',
    icon: <SparklesIcon />,
    gradient: 'from-amber-500 via-orange-600 to-purple-600',
    accentColor: 'amber',
    features: [
      'Cross-project technical blocker and risk anomaly clustering',
      'AI-powered code originality and plagiarism verification',
      'Tech stack suitability & student background alignment analytics',
      'Longitudinal skill growth predictions for academic portfolios'
    ],
    roadmapStage: 'Sprint 3 · Agent Logic'
  },
  'faculty-mentorship': {
    title: 'Faculty Mentorship & Advisory Logs',
    tagline: '1-on-1 advisory scheduling, tailored study paths, and faculty guidance records.',
    icon: <GraduationCapIcon />,
    gradient: 'from-pink-600 via-rose-600 to-indigo-600',
    accentColor: 'rose',
    features: [
      'Faculty office hours calendar synchronization and appointment booking',
      'Personalized technical action plans assigned to student profiles',
      'Direct faculty-to-student mentor messaging & meeting notes',
      'Teaching assistant & peer mentor assignment delegation'
    ],
    roadmapStage: 'Sprint 4 · Feature Pipeline'
  },
  'faculty-reviews': {
    title: 'Reviews & Defense Evaluation Board',
    tagline: 'Rubric-based grading, jury scoring sheets, presentation feedback, and grade books.',
    icon: <ClipboardCheckIcon />,
    gradient: 'from-indigo-600 via-blue-600 to-purple-600',
    accentColor: 'indigo',
    features: [
      'Interactive ABET / University rubric grading sheets for milestones',
      'External examiner & jury board scoring portal with blind review option',
      'Live capstone presentation evaluation & instant feedback submission',
      'Automated weighted final grade computation and LMS gradebook export'
    ],
    roadmapStage: 'Sprint 4 · Evaluation Engine'
  },
  'faculty-documents': {
    title: 'Capstone Documents & Compliance Center',
    tagline: 'Automated verification of SRS, Synopsis, Methodology, and final thesis submissions.',
    icon: <FileTextIcon />,
    gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    accentColor: 'cyan',
    features: [
      'IEEE, ACM, and Institutional format automated document validation',
      'Batch document export (PDF, Markdown, LaTeX, and ZIP archives)',
      'Digital signature, faculty sign-off, and formal approval workflow',
      'Searchable digital archive for institutional capstone publications'
    ],
    roadmapStage: 'Sprint 5 · Compliance Core'
  },
  'faculty-analytics': {
    title: 'Departmental Reports & Accreditation Analytics',
    tagline: 'Aggregated performance metrics, outcome fulfillment, and accreditation data export.',
    icon: <BarChartIcon />,
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    accentColor: 'purple',
    features: [
      'Department-wide capstone project health heatmap & risk overview',
      'Program Learning Outcomes (PLO/CLO) fulfillment metrics',
      'Multi-year historical cohort benchmark comparisons',
      'One-click NBA, NAAC, and ABET accreditation compliance reporting'
    ],
    roadmapStage: 'Sprint 5 · Analytics Suite'
  },
  'faculty-notifications': {
    title: 'Faculty Notification & Alert Center',
    tagline: 'Real-time alerts for delayed milestones, check-in submissions, and defense scheduling.',
    icon: <BellIcon />,
    gradient: 'from-red-500 via-rose-600 to-orange-500',
    accentColor: 'rose',
    features: [
      'Critical alerts for high-risk blockers and milestone schedule slippages',
      'Weekly automated digest of pending student reviews and approvals',
      'Slack, Microsoft Teams, and email webhook integration',
      'Custom alert rules based on student activity frequency'
    ],
    roadmapStage: 'Sprint 6 · Notification Hub'
  }
};

export default function FacultyComingSoonView({ tabId, onNavigate, currentTheme = 'pastel' }) {
  const isDark = currentTheme === 'dark';
  const [notified, setNotified] = useState(false);

  const mod = MODULE_DATA[tabId] || {
    title: 'Faculty Module',
    tagline: 'This feature is currently under active development as part of the Faculty Workspace redesign.',
    icon: <SparklesIcon />,
    gradient: 'from-indigo-600 to-purple-600',
    accentColor: 'indigo',
    features: [
      'Enterprise role-based access control for faculty evaluators',
      'Real-time student progress telemetry and AI analysis synchronization',
      'Custom rubric evaluation and institutional grade book integration'
    ],
    roadmapStage: 'In Active Development'
  };

  const cardBg = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/85 border-slate-200/80';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const textMuted = isDark ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-2 pb-16 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-bold">
        <button 
          onClick={() => onNavigate('faculty')} 
          className={`cursor-pointer hover:underline ${textSecondary}`}
        >
          Faculty Workspace
        </button>
        <span className={textMuted}><ChevronRightIcon /></span>
        <span className="text-purple-500 font-extrabold">{mod.title}</span>
      </div>

      {/* Main Hero Card */}
      <div className={`relative overflow-hidden rounded-3xl border p-8 md:p-10 backdrop-blur-xl shadow-xl ${cardBg}`}>
        {/* Glowing Background Radial */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30">
                🚀 Coming Soon
              </span>
              <span className={`text-xs font-bold ${textMuted}`}>
                {mod.roadmapStage}
              </span>
            </div>

            <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${textPrimary}`}>
              {mod.title}
            </h1>

            <p className={`text-sm md:text-base font-medium leading-relaxed ${textSecondary}`}>
              {mod.tagline}
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onNavigate('faculty')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                ← Back to Faculty Dashboard
              </button>
              
              <button
                onClick={() => setNotified(!notified)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  notified 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : isDark 
                      ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {notified ? '✓ Priority Access Requested' : 'Notify Me on Release'}
              </button>
            </div>
          </div>

          {/* Glowing Icon Badge */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            <div className={`w-28 h-28 rounded-3xl bg-gradient-to-tr ${mod.gradient} flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300`}>
              {mod.icon}
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider border border-white/20">
              V2.0
            </div>
          </div>
        </div>
      </div>

      {/* Feature Blueprint Checklist */}
      <div className={`rounded-3xl border p-8 backdrop-blur-xl ${cardBg}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-base font-black ${textPrimary}`}>Feature Specification & Architecture Blueprint</h3>
            <p className={`text-xs font-medium ${textSecondary}`}>What is being engineered for this module</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
            In Design
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mod.features.map((feat, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl border flex items-start space-x-3.5 transition-all ${
                isDark 
                  ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700' 
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="mt-0.5 w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckIcon />
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs font-bold leading-relaxed ${textPrimary}`}>
                  {feat}
                </span>
                <p className={`text-[10px] ${textMuted}`}>Phase 1 Deliverable</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
