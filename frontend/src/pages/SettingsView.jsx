import React, { useState } from 'react';

export default function SettingsView({ userProfile, setUserProfile }) {
  const [activeTab, setActiveTab] = useState('general');
  const [sysConfig, setSysConfig] = useState({
    apiEndpoint: 'https://api.orchestra-ai.local/v1',
    logRetention: '30 Days',
    enableStream: true,
    mfaStatus: 'Disabled'
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fadeIn max-w-4xl mx-auto flex h-[500px]">
      {/* Settings Sub-Navigation Side Frame */}
      <div className="w-48 bg-slate-50 border-r border-slate-200/60 p-4 space-y-1.5 shrink-0">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-2">Industrial Criteria</span>
        {[
          { id: 'general', label: 'System Parameters', icon: '⚙️' },
          { id: 'security', label: 'Access Keys & MFA', icon: '🔒' },
          { id: 'logs', label: 'Telemetry Logs', icon: '📋' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-transparent cursor-pointer ${activeTab === tab.id ? 'bg-white border-slate-200 text-[#0252CD] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Action Content Frame Panel */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white">
        {activeTab === 'general' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-slate-800">System Parameters Core</h3>
              <p className="text-[11px] text-slate-400 font-medium">Verify production API routing endpoints and graph models.</p>
            </div>
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target API Endpoint Gateway</label>
                <input type="text" value={sysConfig.apiEndpoint} onChange={e=>setSysConfig({...sysConfig, apiEndpoint: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Log Ingestion Retention Scope</label>
                <select value={sysConfig.logRetention} onChange={e=>setSysConfig({...sysConfig, logRetention: e.target.value})} className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
                  <option>30 Days</option>
                  <option>90 Days</option>
                  <option>Indefinite Retention</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-slate-800">Access Control Registers</h3>
              <p className="text-[11px] text-slate-400 font-medium">Industrial standard zero-trust encryption parameters.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
              <div>
                <span className="block font-bold text-slate-700">Multi-Factor Authentication (MFA)</span>
                <span className="text-[10px] text-slate-400 font-medium">Enforce biometric validation check keys upon login bounds.</span>
              </div>
              <button onClick={() => setSysConfig({...sysConfig, mfaStatus: sysConfig.mfaStatus === 'Active' ? 'Disabled' : 'Active'})} className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide cursor-pointer border ${sysConfig.mfaStatus === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                {sysConfig.mfaStatus === 'Active' ? 'Enabled ✓' : 'Activate Node'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-slate-800">Telemetry Performance Logs</h3>
              <p className="text-[11px] text-slate-400 font-medium">Immutable audit trail traces verifying environment states.</p>
            </div>
            <div className="bg-slate-900 text-slate-200 font-mono text-[10px] p-4 rounded-xl space-y-1 block leading-normal shadow-inner max-h-56 overflow-y-auto">
              <div>[2026-07-21 20:58:34] SYS_INIT // Orchestration connection successful.</div>
              <div>[2026-07-21 20:59:01] AUTH_OK // Token signed with cryptographic keys.</div>
              <div>[2026-07-21 20:59:15] VECTOR_INGEST // Pinecone index matrices validated.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}