import React, { useState } from 'react';

// --- Premium Vector SVG Icons ---
const SlidersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
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

const PaletteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.71 1.7-1.63 0-.44-.18-.85-.46-1.15-.27-.3-.42-.7-.42-1.12 0-.92.75-1.67 1.67-1.67H17c2.76 0 5-2.24 5-5 0-4.42-4.48-8-10-8z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CpuIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M21 19c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <line x1="3" y1="5" x2="3" y2="19" />
    <line x1="21" y1="5" x2="21" y2="19" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export default function SettingsView({ userProfile, currentTheme = 'pastel', onThemeChange }) {
  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const isDark = currentTheme === 'dark';

  const [sysConfig, setSysConfig] = useState({
    apiEndpoint: 'http://localhost:8000',
    modelProvider: 'Gemini 3.6 Flash (High Reasoning)',
    temperature: 0.7,
    autoSqlMigrations: true,
    enableStream: true,
    vectorDbStatus: 'Active (Pinecone / Supabase RAG)',
    logRetention: '30 Days',
    mfaStatus: 'Disabled'
  });

  const themes = [
    {
      id: 'pastel',
      name: 'Pastel Gradient Vector',
      desc: 'Soft cyan, pink, and lavender mesh glow (Default)',
      preview: 'bg-gradient-to-r from-sky-200 via-indigo-100 to-pink-200 border-sky-300'
    },
    {
      id: 'dark',
      name: 'Dark Cyber Mesh',
      desc: 'Sleek dark slate with vibrant blue/purple glowing mesh',
      preview: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500'
    },
    {
      id: 'light',
      name: 'Light Minimalist',
      desc: 'Clean white background with slate accents',
      preview: 'bg-gradient-to-r from-slate-100 via-white to-slate-200 border-slate-300'
    }
  ];

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearCache = () => {
    setClearingCache(true);
    setTimeout(() => {
      setClearingCache(false);
      alert("AI Advisory Memory Cache cleared successfully.");
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* HEADER SECTION */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${isDark ? 'border-slate-800' : 'border-slate-200/70'}`}>
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 bg-[#0252CD] text-white rounded-xl shadow-md shadow-sky-500/20">
              <SlidersIcon />
            </span>
            <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>System Settings</h1>
          </div>
          <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Configure multi-agent gateway parameters, theme aesthetics, and vector store parameters.
          </p>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-gradient-to-r from-[#0252CD] to-indigo-600 hover:shadow-lg hover:shadow-sky-500/25 text-white font-bold rounded-2xl text-xs transition-all shrink-0 flex items-center space-x-2 shadow-md cursor-pointer self-start md:self-center"
        >
          <CheckIcon />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* SAVE SUCCESS BANNER */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2.5 shadow-sm animate-fadeIn">
          <CheckIcon />
          <span>System configuration parameters saved successfully.</span>
        </div>
      )}

      {/* SETTINGS MODULE TABS */}
      <div className={`flex space-x-2 border-b pb-2 overflow-x-auto ${isDark ? 'border-slate-800' : 'border-slate-200/70'}`}>
        {[
          { id: 'general', label: 'AI Model & Gateway', icon: <CpuIcon /> },
          { id: 'theme', label: 'Theme & Design', icon: <PaletteIcon /> },
          { id: 'database', label: 'Database & RAG Memory', icon: <DatabaseIcon /> },
          { id: 'security', label: 'Security & Auth', icon: <ShieldIcon /> },
          { id: 'audit', label: 'System Logs', icon: <TerminalIcon /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#0252CD] to-indigo-600 text-white shadow-md shadow-sky-500/20'
                : isDark
                  ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-white/60 hover:bg-white text-slate-600 hover:text-slate-900 border border-white/80'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: AI MODEL & GATEWAY */}
      {activeTab === 'general' && (
        <div className={`backdrop-blur-xl border rounded-3xl p-7 shadow-md space-y-6 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/40' : 'bg-white/75 border-white/80 text-slate-900 shadow-sky-950/5'
        }`}>
          <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Model & Gateway Parameters</h3>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Control execution limits and Gemini LLM provider settings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className={`block text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>FastAPI Service Endpoint</label>
              <input
                type="text"
                value={sysConfig.apiEndpoint}
                onChange={(e) => setSysConfig({ ...sysConfig, apiEndpoint: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0252CD] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white/90 border-slate-200/80 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`block text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>LLM Model Provider</label>
              <select
                value={sysConfig.modelProvider}
                onChange={(e) => setSysConfig({ ...sysConfig, modelProvider: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0252CD] cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white/90 border-slate-200/80 text-slate-900'
                }`}
              >
                <option value="Gemini 3.6 Flash (High Reasoning)">Gemini 3.6 Flash (High Reasoning)</option>
                <option value="Gemini 1.5 Pro (Deep Context)">Gemini 1.5 Pro (Deep Context)</option>
                <option value="Local Ollama Llama-3">Local Ollama Llama-3</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className={`flex justify-between items-center text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <span>Model Temperature ({sysConfig.temperature})</span>
                <span className="text-xs text-slate-400">Balancing technical precision and advisory creativity</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={sysConfig.temperature}
                onChange={(e) => setSysConfig({ ...sysConfig, temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0252CD]"
              />
            </div>

            <div className={`flex items-center justify-between p-4 border rounded-2xl md:col-span-2 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-200/60'
            }`}>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Auto-Generate SQL Migration Scripts</p>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Inject initial DDL migrations for PostgreSQL during documentation synthesis.</p>
              </div>
              <input
                type="checkbox"
                checked={sysConfig.autoSqlMigrations}
                onChange={(e) => setSysConfig({ ...sysConfig, autoSqlMigrations: e.target.checked })}
                className="w-4 h-4 text-[#0252CD] rounded cursor-pointer accent-[#0252CD]"
              />
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: THEME & DESIGN SWITCHER */}
      {activeTab === 'theme' && (
        <div className={`backdrop-blur-xl border rounded-3xl p-7 shadow-md space-y-6 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/40' : 'bg-white/75 border-white/80 text-slate-900 shadow-sky-950/5'
        }`}>
          <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-base font-black flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <PaletteIcon />
              <span>Theme & Visual Aesthetics</span>
            </h3>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Select your preferred application background theme topology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {themes.map((th) => {
              const isSelected = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onThemeChange && onThemeChange(th.id)}
                  className={`p-6 border-2 rounded-3xl text-left transition-all duration-300 relative cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? isDark 
                        ? 'border-[#0252CD] bg-slate-800/90 shadow-xl ring-2 ring-[#0252CD]/20' 
                        : 'border-[#0252CD] bg-white shadow-xl shadow-sky-500/15 ring-2 ring-[#0252CD]/20'
                      : isDark
                        ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700'
                        : 'border-slate-200/80 bg-white/60 hover:bg-white hover:border-sky-300'
                  }`}
                >
                  {/* Swatch Preview */}
                  <div className={`w-full h-20 rounded-2xl border ${th.preview} shadow-sm relative overflow-hidden flex items-center justify-center`}>
                    <span className="text-xs font-black text-slate-800 bg-white/80 px-3 py-1 rounded-full shadow-xs backdrop-blur-md">
                      Preview
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{th.name}</h4>
                      {isSelected && (
                        <span className="p-1 bg-[#0252CD] text-white rounded-full">
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{th.desc}</p>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full text-center ${
                    isSelected 
                      ? 'bg-blue-50 text-[#0252CD] border border-blue-100' 
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isSelected ? 'Active Theme' : 'Click to Apply'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE & RAG MEMORY */}
      {activeTab === 'database' && (
        <div className={`backdrop-blur-xl border rounded-3xl p-7 shadow-md space-y-6 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/40' : 'bg-white/75 border-white/80 text-slate-900 shadow-sky-950/5'
        }`}>
          <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Database & RAG Memory Vector Store</h3>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Manage vector embeddings, long-term memory, and Advisory Cache.</p>
          </div>

          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 border rounded-2xl ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-200/60'
            }`}>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>RAG Vector Database Status</p>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{sysConfig.vectorDbStatus}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                Connected
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 border rounded-2xl ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-200/60'
            }`}>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Flush Advisory Cache</p>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clear cached multi-agent advisor responses and refresh memory graph.</p>
              </div>
              <button
                onClick={handleClearCache}
                disabled={clearingCache}
                className={`px-4 py-2 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center space-x-2 cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <RefreshIcon />
                <span>{clearingCache ? 'Clearing Cache...' : 'Clear Cache'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & AUTH */}
      {activeTab === 'security' && (
        <div className={`backdrop-blur-xl border rounded-3xl p-7 shadow-md space-y-6 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/40' : 'bg-white/75 border-white/80 text-slate-900 shadow-sky-950/5'
        }`}>
          <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Security & Authentication Protocol</h3>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>JWT token lifetimes, CORS settings, and access control policies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`p-4 border rounded-2xl space-y-1 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-200/60'
            }`}>
              <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>JWT Access Bearer Protocol</p>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>HMAC-SHA256 Signed with 24-Hour Expiry</p>
            </div>
            <div className={`p-4 border rounded-2xl space-y-1 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-200/60'
            }`}>
              <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Multi-Factor Authentication (MFA)</p>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status: Disabled for Academic Sandbox</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM LOGS */}
      {activeTab === 'audit' && (
        <div className={`backdrop-blur-xl border rounded-3xl p-7 shadow-md space-y-4 ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/40' : 'bg-white/75 border-white/80 text-slate-900 shadow-sky-950/5'
        }`}>
          <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>System Audit Telemetry Logs</h3>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Live execution trajectory of multi-agent state graph events.</p>
          </div>

          <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-[11px] space-y-1.5 overflow-x-auto shadow-inner border border-slate-800">
            <p className="text-emerald-400">[INFO] 2026-08-10 20:38:12 - FastAPI Gateway initialized on port 8000</p>
            <p className="text-sky-400">[INFO] 2026-08-10 20:38:15 - LangGraph StateGraph initialized with 5 specialized nodes</p>
            <p className="text-purple-400">[INFO] 2026-08-10 20:38:20 - Gemini Flash rate-limiter check passed</p>
            <p className="text-amber-400">[WARN] 2026-08-10 20:38:25 - Risk Analyst Agent executed clean output without reasoning tags</p>
            <p className="text-emerald-400">[SUCCESS] 2026-08-10 20:38:30 - System telemetry synced with frontend canvas</p>
          </div>
        </div>
      )}

    </div>
  );
}