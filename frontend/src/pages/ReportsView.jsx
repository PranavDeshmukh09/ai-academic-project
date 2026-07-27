import React from 'react';

export default function ReportsView({ userProfile }) {
  const metricReport = [
    { title: 'Assessment Rating Matrix', value: '88% Score Vector', color: 'text-blue-600', desc: 'Baseline evaluation metric metrics calculated by audit modules.' },
    { title: 'Project Progress Tracker', value: 'Phase 1 Active', color: 'text-emerald-600', desc: 'Engineering milestone checkpoints mapping verification states.' },
    { title: 'AI Suggestions Output', value: '4 Actions Cached', color: 'text-amber-600', desc: 'Target optimizations flagged during runtime loops.' },
    { title: 'Tasks Completed Index', value: '2 of 6 Modules', color: 'text-violet-600', desc: 'Onboarding integration pipelines fully cleared.' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-200/60 pb-4">
        <h2 className="text-xl font-black text-[#0F172A]">Analytical Progress Report</h2>
        <p className="text-xs text-slate-400 font-medium">Auto-generated performance analysis from system telemetry logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {metricReport.map((rep, idx) => (
          <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{rep.title}</h3>
            <div className={`text-xl font-black ${rep.color}`}>{rep.value}</div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{rep.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Unified Skill Matrix Map</h3>
        <div className="space-y-3">
          {userProfile.skillsMatrix && userProfile.skillsMatrix.length > 0 ? (
            userProfile.skillsMatrix.map((sk, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-medium border-b border-slate-50 pb-2 last:border-0">
                <span className="text-slate-700 font-semibold">{sk.name}</span>
                <span className="bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[#0252CD] font-bold">Level {sk.level}/5</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 font-medium italic">No custom competencies audited yet. Default fallback values active.</p>
          )}
        </div>
      </div>
    </div>
  );
}