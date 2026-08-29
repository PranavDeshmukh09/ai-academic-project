import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const SparklesIcon = () => (
  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M12 2l2.4 7.2L21 12l-6.6 2.8L12 22l-2.4-7.2L3 12l6.6-2.8L12 2z" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const ZapIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const AwardIcon = () => (
  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export default function FacultyAiInsightsView({ currentTheme = 'pastel', onSelectProject }) {
  const [data, setData] = useState({ total_projects: 0, projects: [] });
  const [loading, setLoading] = useState(true);
  const [isRefreshingAi, setIsRefreshingAi] = useState(false);

  const isDark = currentTheme === 'dark';

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFacultyDashboard();
      if (res && res.projects) {
        setData(res);
      }
    } catch (e) {
      console.error("Error fetching AI insights data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleRefreshInsights = () => {
    setIsRefreshingAi(true);
    setTimeout(() => {
      setIsRefreshingAi(false);
    }, 1200);
  };

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center space-y-3">
        <div className="w-9 h-9 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-400">Synthesizing Multi-Agent Telemetry & Skill Gaps...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <SparklesIcon />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AI Intelligence & Risk Telemetry Hub
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Gemini 2.6 Multi-Agent Core
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Cohort skill-gap syntheses, automated schedule risk forecasting, cross-project recommendations, and LLM telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshInsights}
          disabled={isRefreshingAi}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 self-start lg:self-auto shrink-0"
        >
          <RefreshIcon />
          <span>{isRefreshingAi ? 'Re-analyzing Cohort...' : 'Re-synthesize AI Insights'}</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">AI Health Index</span>
            <SparklesIcon />
          </div>
          <h3 className="text-2xl font-black text-purple-400">89.2%</h3>
          <p className="text-[10px] font-bold text-purple-500/80">Cohort Model Quality Score</p>
        </div>

        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Bottlenecks Flagged</span>
            <AlertTriangleIcon />
          </div>
          <h3 className="text-2xl font-black text-rose-400">2 Teams</h3>
          <p className="text-[10px] font-bold text-rose-500/80">Schedule Variance &gt; 5 Days</p>
        </div>

        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Velocity Surge</span>
            <TrendingUpIcon />
          </div>
          <h3 className="text-2xl font-black text-emerald-400">+12%</h3>
          <p className="text-[10px] font-bold text-emerald-500/80">Phase 2 Sprint Acceleration</p>
        </div>

        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Skill Gap Alerts</span>
            <ZapIcon />
          </div>
          <h3 className="text-2xl font-black text-amber-400">3 Topics</h3>
          <p className="text-[10px] font-bold text-amber-500/80">Async Pooling, Quantization</p>
        </div>
      </div>

      {/* 3. Deep AI Intelligence Synthesis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section A: Multi-Agent Risk Forecasts */}
        <div className={`p-6 border rounded-2xl shadow-xs space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Automated Schedule & Bottleneck Forecasts
              </h3>
              <p className="text-xs text-slate-400 font-medium">Multi-agent timeline projections across active sprints.</p>
            </div>
            <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Live Alert
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Team Pranav — Model Quantization & Edge Inference Lag',
                desc: 'AI Risk Engine detected an 8-day schedule delay in edge inference benchmarking. Reason: INT8 quantization integration challenges.',
                action: 'Recommend advising team to use ONNX runtime pre-quantized models.',
                severity: 'High'
              },
              {
                title: 'Team Test Student 5 — Phase 3 Test Harness Lag',
                desc: 'Integration test suites delayed by 4 days due to mock API gateway authentication dependencies.',
                action: 'Provide pre-configured FastAPI test client mock harness.',
                severity: 'Moderate'
              }
            ].map((risk, idx) => (
              <div key={idx} className={`p-4 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-200">{risk.title}</h4>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    risk.severity === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>{risk.severity} Risk</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{risk.desc}</p>
                <div className="text-[11px] font-bold text-indigo-400 pt-1">
                  💡 Faculty Mitigation: <span className="font-medium text-slate-300">{risk.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Cohort Skill Gap & Tech Distribution */}
        <div className={`p-6 border rounded-2xl shadow-xs space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Cohort Technical Competency & Skill Gap Analysis
              </h3>
              <p className="text-xs text-slate-400 font-medium">Aggregated across skill assessment evaluations.</p>
            </div>
            <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Audit
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { skill: 'Python / FastAPI Microservices', mastery: 88, status: 'Strong Mastery' },
              { skill: 'Relational DB & PostgreSQL Schema Design', mastery: 82, status: 'Strong Mastery' },
              { skill: 'Multi-Agent LLM Orchestration (LangGraph)', mastery: 74, status: 'Proficient' },
              { skill: 'Edge Model Quantization (TFLite / ONNX)', mastery: 52, status: 'Needs Workshop' },
              { skill: 'Integration Test Coverage & CI/CD', mastery: 48, status: 'Needs Review' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">{item.skill}</span>
                  <span className={item.mastery >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                    {item.mastery}% • {item.status}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      item.mastery >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`} 
                    style={{ width: `${item.mastery}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Cross-Project Academic Recommendations */}
      <div className={`p-6 border rounded-2xl shadow-xs space-y-4 ${cardBg}`}>
        <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <AwardIcon />
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Cross-Project Synergies & Recommendations
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Gemini 2.6 Cohort Synthesis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border space-y-2 ${
            isDark ? 'bg-indigo-950/20 border-indigo-800/40' : 'bg-indigo-50/70 border-indigo-200'
          }`}>
            <span className="text-[10px] font-black uppercase text-indigo-400">Architecture Recommendation</span>
            <h4 className="font-bold text-xs text-slate-200">Standardize Asynchronous Connection Pooling</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              3 teams are facing similar timeout errors. Recommending a shared asyncpg pool module across the department repository.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-2 ${
            isDark ? 'bg-purple-950/20 border-purple-800/40' : 'bg-purple-50/70 border-purple-200'
          }`}>
            <span className="text-[10px] font-black uppercase text-purple-400">Collaboration Synergy</span>
            <h4 className="font-bold text-xs text-slate-200">Joint Testing Session: Team 1 & Team 4</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Both pods are implementing model inference pipelines. A peer code-review sprint will accelerate validation velocity by 25%.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-2 ${
            isDark ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <span className="text-[10px] font-black uppercase text-emerald-400">Upcoming Milestone Tip</span>
            <h4 className="font-bold text-xs text-slate-200">Prepare Early for Midterm Viva Defense</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Over 75% of teams have working prototypes. Encourage teams to record live latency telemetry before the midterm defense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
