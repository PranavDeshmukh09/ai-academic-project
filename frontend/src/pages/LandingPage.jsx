import React, { useState } from 'react';

export default function LandingPage({ onGetStarted }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [drafts, setDrafts] = useState(3);
  const [hours, setHours] = useState(8);

  const mockTabs = {
    pipeline: {
      title: "7-Agent Multi-Agent Pipeline",
      content: [
        { type: "sys", text: "⚡ Initiating Academic Verification Pipeline..." },
        { type: "agent", text: "🤖 [SkillAssessor] Analyzing candidate's React/Python proficiency..." },
        { type: "info", text: "✓ Found matching methodology in Ensembl DB" },
        { type: "agent", text: "🤖 [LinterAgent] Auditing code syntax and dependencies..." },
        { type: "success", text: "✓ 0 errors, all packages successfully verified" },
        { type: "sys", text: "🚀 Verification pipeline completed. Project ready." }
      ],
      status: "Pipeline: Passed",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    },
    code: {
      title: "Syntax & Quality Audit",
      content: [
        { type: "sys", text: "// AST Verification Flow" },
        { type: "info", text: "const project = await verifyAcademicWorkspace(submission);" },
        { type: "info", text: "if (project.hasValidLinter && project.score > 80) {" },
        { type: "success", text: "  return approvalStatus.APPROVE;" },
        { type: "info", text: "}" },
        { type: "sys", text: "// Quality: Excellent (Score: 92/100)" }
      ],
      status: "Quality: A+",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    score: {
      title: "Impact & Feasibility Metrics",
      content: [
        { type: "sys", text: "📊 AI Assessment Report Overview" },
        { type: "info", text: "• Feasibility Score: 94/100" },
        { type: "info", text: "• Research Innovation Rank: Top 5%" },
        { type: "success", text: "• Recommended Mentor Alignment: Matching..." },
        { type: "info", text: "• Key Area: Bioinformatics & Machine Learning" }
      ],
      status: "Grade: Ready",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    }
  };

  const calculatedHoursSaved = Math.round(drafts * hours * 0.8);

  const getLogClass = (type) => {
    if (isDarkMode) {
      if (type === 'sys') return 'text-slate-500 font-semibold';
      if (type === 'agent') return 'text-indigo-300 font-semibold';
      if (type === 'success') return 'text-emerald-400 font-semibold';
      return 'text-slate-300';
    } else {
      if (type === 'sys') return 'text-slate-400 font-semibold';
      if (type === 'agent') return 'text-purple-600 font-semibold';
      if (type === 'success') return 'text-emerald-600 font-semibold';
      return 'text-slate-600';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden font-sans antialiased transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-[#090b11] via-[#1a1230] via-[#101430] via-[#1f1030] to-[#0c0817] text-slate-100' 
        : 'bg-gradient-to-b from-white via-[#f3e8ff] via-[#e0e7ff] via-[#f5d0fe] to-[#d8b4fe] text-slate-900'
    }`}>
      
      {/* Subtle grid background pattern - fading out towards the bottom */}
      <div 
        className={`absolute inset-x-0 top-0 h-[650px] bg-[size:3rem_3rem] pointer-events-none transition-all duration-300`}
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          backgroundImage: isDarkMode 
            ? 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,58,237,0.15) 1px, transparent 1px)'
        }}
      ></div>

      {/* Dynamic Background Glow Elements - Spaced out throughout the page */}
      {isDarkMode ? (
        <>
          {/* Section 1: Hero Glows */}
          <div className="absolute top-[2%] left-[10%] w-[550px] h-[550px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute top-[12%] right-[5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          {/* Section 2: Comparison Glows */}
          <div className="absolute top-[25%] left-[5%] w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[150px] pointer-events-none"></div>

          {/* Section 3: Bento Features Glows */}
          <div className="absolute top-[42%] right-[5%] w-[650px] h-[650px] bg-purple-600/8 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute top-[52%] left-[10%] w-[500px] h-[500px] bg-fuchsia-600/8 rounded-full blur-[130px] pointer-events-none"></div>

          {/* Section 4: Workflow Glows */}
          <div className="absolute top-[68%] right-[10%] w-[550px] h-[550px] bg-blue-600/8 rounded-full blur-[140px] pointer-events-none"></div>

          {/* Section 5: Calculator Glows */}
          <div className="absolute top-[82%] left-[15%] w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none"></div>
        </>
      ) : (
        <>
          {/* Section 1: Hero Glows */}
          <div className="absolute top-[2%] left-[5%] w-[800px] h-[700px] bg-gradient-to-tr from-[#d8b4fe]/45 via-[#f5d0fe]/30 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute top-[12%] right-[2%] w-[700px] h-[700px] bg-gradient-to-br from-[#c7d2fe]/45 via-[#d8b4fe]/30 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

          {/* Section 2: Comparison Glows */}
          <div className="absolute top-[25%] left-[2%] w-[750px] h-[750px] bg-gradient-to-tr from-[#ddd6fe]/35 via-[#e0e7ff]/30 to-transparent rounded-full blur-[145px] pointer-events-none"></div>

          {/* Section 3: Bento Features Glows */}
          <div className="absolute top-[42%] right-[2%] w-[800px] h-[800px] bg-gradient-to-br from-[#f5d0fe]/35 via-[#ddd6fe]/30 to-transparent rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute top-[52%] left-[5%] w-[700px] h-[700px] bg-gradient-to-tr from-[#e0f2fe]/40 via-[#e0e7ff]/35 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

          {/* Section 4: Workflow Glows */}
          <div className="absolute top-[68%] right-[5%] w-[750px] h-[750px] bg-gradient-to-br from-[#c7d2fe]/40 via-[#f3e8ff]/35 to-transparent rounded-full blur-[145px] pointer-events-none"></div>

          {/* Section 5: Calculator Glows */}
          <div className="absolute top-[82%] left-[10%] w-[900px] h-[850px] bg-gradient-to-tr from-[#d8b4fe]/45 via-[#e0e7ff]/40 to-transparent rounded-full blur-[160px] pointer-events-none"></div>
        </>
      )}
      
      {/* Fixed Pill-Shaped Navigation Header with Glassmorphic design */}
      <div className="fixed top-5 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <header className={`w-full max-w-5xl backdrop-blur-xl rounded-full px-6 py-3 flex justify-between items-center shadow-lg transition-all duration-300 pointer-events-auto ${
          isDarkMode 
            ? 'bg-slate-950/40 border border-white/10 shadow-purple-500/5' 
            : 'bg-white/25 border border-white/45 shadow-purple-900/5'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-500/20">
              A
            </div>
            <span className={`font-extrabold text-base tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              AI Academic
            </span>
          </div>
          
          <nav className={`hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <a href="#features" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-purple-600'}`}>Features</a>
            <a href="#comparison" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-purple-600'}`}>Comparison</a>
            <a href="#workflow" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-purple-600'}`}>Workflow</a>
            <a href="#calculator" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-purple-600'}`}>Impact</a>
          </nav>

          <div className="flex items-center">
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative flex items-center p-0.5 rounded-full border transition-all duration-300 cursor-pointer mr-4 ${
                isDarkMode 
                  ? 'bg-slate-900/90 border-white/10' 
                  : 'bg-slate-200/50 border-slate-200'
              }`}
              title="Toggle theme"
            >
              {/* Sun Icon */}
              <span className={`px-2.5 py-1.5 text-[10px] font-bold rounded-full transition-all duration-300 flex items-center justify-center space-x-1 ${
                !isDarkMode 
                  ? 'bg-white text-amber-500 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}>
                <span>☀️</span>
                <span className="hidden sm:inline">Light</span>
              </span>
              {/* Moon Icon */}
              <span className={`px-2.5 py-1.5 text-[10px] font-bold rounded-full transition-all duration-300 flex items-center justify-center space-x-1 ${
                isDarkMode 
                  ? 'bg-slate-800 text-amber-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}>
                <span>🌙</span>
                <span className="hidden sm:inline">Dark</span>
              </span>
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-[size:200%_auto] hover:bg-[right_center] rounded-full transition-all duration-500 cursor-pointer shadow-md shadow-purple-500/10 hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </header>
      </div>

      {/* Main Content Hero */}
      <main className="flex-1 flex flex-col z-10 w-full max-w-7xl mx-auto px-6 pt-24 space-y-32">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8 relative">
          {/* Left Column: Headlines & Action buttons */}
          <div className="lg:col-span-6 space-y-6 text-left z-10">
            <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm transition-all duration-300 ${
              isDarkMode 
                ? 'bg-purple-950/30 border-purple-800/30 text-purple-400' 
                : 'bg-purple-50 border-purple-100 text-purple-700'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              7-Agent Mentor Pipeline is Live
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Assess. Evaluate.<br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Succeed with AI.
              </span>
            </h1>
            
            <p className={`text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Bridge the gap between raw concept ideation and formal development execution with our multi-agent verification, code linting, and academic scoring workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-[size:200%_auto] hover:bg-[right_center] text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-purple-500/15 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
              >
                Get Started Onboarding
              </button>

              <a
                href="#calculator"
                className={`font-bold text-sm px-8 py-4 border rounded-2xl shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Calculate Time Saved
              </a>
            </div>
          </div>

          {/* Right Column: Layered Dashboard Mockup */}
          <div className="lg:col-span-6 relative z-10">
            <div className={`rounded-[2.2rem] p-1 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-900/80 border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_35px_80px_rgba(168,85,247,0.15)]' 
                : 'bg-white border-slate-100 shadow-[0_30px_60px_rgba(168,85,247,0.20),_0_0_40px_rgba(168,85,247,0.08)] hover:shadow-[0_35px_70px_rgba(168,85,247,0.28),_0_0_50px_rgba(168,85,247,0.12)]'
            }`}>
              <div className={`rounded-[2rem] overflow-hidden border transition-colors duration-300 relative ${
                isDarkMode ? 'bg-[#090b16] border-white/5' : 'bg-white border-slate-200/40'
              }`}>
                
                {/* Floating Card 1 (Top Left) */}
                <div className={`absolute top-4 -left-6 border rounded-2xl p-4 shadow-lg max-w-[180px] hidden sm:flex items-center space-x-3 hover:translate-y-[-2px] transition-all duration-300 ${
                  isDarkMode ? 'bg-[#090b16]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200/60 text-slate-800'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    isDarkMode ? 'bg-emerald-950/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>✓</div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Linter Check</div>
                    <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Passed 100%</div>
                  </div>
                </div>

                {/* Floating Card 2 (Bottom Right) */}
                <div className={`absolute -bottom-4 -right-6 border rounded-2xl p-4 shadow-lg max-w-[200px] hidden sm:flex items-center space-x-3 hover:translate-y-[-2px] transition-all duration-300 ${
                  isDarkMode ? 'bg-[#090b16]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200/60 text-slate-800'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    isDarkMode ? 'bg-purple-950/50 text-purple-400' : 'bg-purple-50 text-purple-600'
                  }`}>📊</div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Feasibility Score</div>
                    <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>94/100 (A+)</div>
                  </div>
                </div>

                {/* Showcase Header Tabs */}
                <div className={`border-b px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-300 ${
                  isDarkMode ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`flex items-center space-x-1 p-1 rounded-xl border transition-colors duration-300 ${
                    isDarkMode ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-slate-200/60 border-slate-200/40'
                  }`}>
                    {Object.keys(mockTabs).map((tabKey) => (
                      <button
                        key={tabKey}
                        onClick={() => setActiveTab(tabKey)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer uppercase tracking-wide ${
                          activeTab === tabKey
                            ? (isDarkMode ? "bg-white/[0.08] text-white" : "bg-white text-slate-900 shadow-sm")
                            : "text-slate-500 hover:text-slate-350"
                        }`}
                      >
                        {tabKey === 'pipeline' && '🔗 Pipeline'}
                        {tabKey === 'code' && '💻 Audit'}
                        {tabKey === 'score' && '📊 Metrics'}
                      </button>
                    ))}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${mockTabs[activeTab].color}`}>
                    {mockTabs[activeTab].status}
                  </div>
                </div>

                {/* Showcase Terminal/Workspace Preview */}
                <div className={`p-6 text-left font-mono text-xs min-h-[220px] transition-colors duration-300 ${
                  isDarkMode ? 'bg-slate-950/20' : 'bg-slate-50/50'
                } space-y-3 overflow-x-auto`}>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {mockTabs[activeTab].title}
                  </div>
                  {mockTabs[activeTab].content.map((line, idx) => (
                    <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                      <span className="text-slate-300 shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className={getLogClass(line.type)}>
                        {line.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparative Layouts */}
        <section id="comparison" className="space-y-12 relative">
          <div className="text-center space-y-4 z-10 relative">
            <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Redefining Academic Project Verification
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto">
              Compare the traditional drafting process against our automated, multi-agent evaluation platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto z-10 relative">
            {/* Without AI Mentor */}
            <div className={`border rounded-3xl p-8 transition-all duration-300 relative overflow-hidden group ${
              isDarkMode 
                ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)]' 
                : 'bg-white border-slate-200/40 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)]'
            }`}>
              <div className="absolute top-0 left-0 w-2 h-full bg-red-400"></div>
              <h3 className={`text-lg font-bold mb-6 flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <span>Without AI Academic Mentor</span>
                <span className="text-red-500 font-bold text-xs uppercase bg-red-50 px-2.5 py-1 rounded-md">Manual</span>
              </h3>
              
              <ul className="space-y-4 text-left">
                {[
                  "Slow advisor response loops taking weeks",
                  "Risk of mismatched tech stack & outdated dependencies",
                  "Time-consuming manual citation and rubric checks",
                  "Undetected architectural flaws or scope-creep risks",
                  "Complex manual proposal formatting & outline creation"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-red-500 shrink-0 mt-0.5 font-bold">✕</span>
                    <span className={`text-xs font-semibold leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With AI Mentor */}
            <div className={`border rounded-3xl p-8 transition-all duration-300 relative overflow-hidden group ${
              isDarkMode 
                ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(168,85,247,0.1)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.2)]' 
                : 'bg-white border-purple-100/60 shadow-[0_15px_40px_rgba(168,85,247,0.08),_0_0_30px_rgba(168,85,247,0.04)] hover:shadow-[0_25px_50px_rgba(168,85,247,0.20),_0_0_40px_rgba(168,85,247,0.1)]'
            }`}>
              <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
              <h3 className={`text-lg font-bold mb-6 flex items-center justify-between transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <span>With AI Academic Mentor</span>
                <span className="text-purple-600 font-bold text-xs uppercase bg-purple-50 px-2.5 py-1 rounded-md">Automated</span>
              </h3>
              
              <ul className="space-y-4 text-left">
                {[
                  "Instant multi-agent pipeline audits (under 60s)",
                  "Optimal stack verification matching Ensembl & ChEMBL databases",
                  "Automated academic linter code & grading assessment",
                  "Proactive risk assessment and feasibility scoring reports",
                  "Single-click structural markdown and proposal compiler"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-emerald-500 shrink-0 mt-0.5 font-bold">✓</span>
                    <span className={`text-xs font-semibold leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Grid (Bento/Modular Style) */}
        <section id="features" className="space-y-12 relative">
          <div className="text-center space-y-4 z-10 relative">
            <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Complete Mentorship Ecosystem
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto">
              Our 7 specialized agents analyze, design, and plan your development milestones automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto z-10 relative">
            {/* Feature 1 */}
            <div className={`border rounded-3xl p-8 transition-all hover:translate-y-[-4px] duration-300 md:col-span-7 flex flex-col justify-between text-left ${
              isDarkMode 
                ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]' 
                : 'bg-white border-slate-200/40 shadow-[0_15px_40px_rgba(168,85,247,0.08),_0_0_30px_rgba(168,85,247,0.04)] hover:shadow-[0_25px_50px_rgba(168,85,247,0.20),_0_0_40px_rgba(168,85,247,0.1)]'
            }`}>
              <div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                  isDarkMode ? 'bg-purple-950/50 text-purple-400' : 'bg-purple-50 text-purple-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Interactive Skill Assessor</h3>
                <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Evaluate your expertise across specific technologies and academic domains. Map your capabilities dynamically to reveal custom learning paths before embarking on complex architectures.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-[11px] font-bold text-purple-600 uppercase">
                <span>Self-Assessment Quizzes</span>
                <span>→</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`border rounded-3xl p-8 transition-all hover:translate-y-[-4px] duration-300 md:col-span-5 flex flex-col justify-between text-left ${
              isDarkMode 
                ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]' 
                : 'bg-white border-slate-200/40 shadow-[0_15px_40px_rgba(168,85,247,0.08),_0_0_30px_rgba(168,85,247,0.04)] hover:shadow-[0_25px_50px_rgba(168,85,247,0.20),_0_0_40px_rgba(168,85,247,0.1)]'
            }`}>
              <div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                  isDarkMode ? 'bg-indigo-950/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Project Feasibility Review</h3>
                <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Our system evaluates project depth, resource constraints, and scientific feasibility based on database benchmarks.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-[11px] font-bold text-indigo-600 uppercase">
                <span>Score metrics</span>
                <span>→</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`border rounded-3xl p-8 transition-all hover:translate-y-[-4px] duration-300 md:col-span-5 flex flex-col justify-between text-left ${
              isDarkMode 
                ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]' 
                : 'bg-white border-slate-200/40 shadow-[0_15px_40px_rgba(168,85,247,0.08),_0_0_30px_rgba(168,85,247,0.04)] hover:shadow-[0_25px_50px_rgba(168,85,247,0.20),_0_0_40px_rgba(168,85,247,0.1)]'
            }`}>
              <div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                  isDarkMode ? 'bg-blue-950/50 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tech Stack Advisor</h3>
                <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Receive system-tailored structural recommendations for databases, cloud tooling, and backend API architectures.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-[11px] font-bold text-blue-600 uppercase">
                <span>Dependency validation</span>
                <span>→</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className={`border rounded-3xl p-8 transition-all hover:translate-y-[-4px] duration-300 md:col-span-7 flex flex-col justify-between text-left ${
              isDarkMode 
                ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]' 
                : 'bg-white border-slate-200/40 shadow-[0_15px_40px_rgba(168,85,247,0.08),_0_0_30px_rgba(168,85,247,0.04)] hover:shadow-[0_25px_50px_rgba(168,85,247,0.20),_0_0_40px_rgba(168,85,247,0.1)]'
            }`}>
              <div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                  isDarkMode ? 'bg-emerald-950/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>RAG Chat Workspace</h3>
                <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Interact dynamically with a context-aware AI academic mentor. Securely upload grading rubrics, scientific literature PDFs, or reference templates to configure tailored feedback parameters.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-[11px] font-bold text-emerald-600 uppercase">
                <span>Context-Aware RAG</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow / Step-by-Step Containers */}
        <section id="workflow" className="space-y-12 relative">
          <div className="text-center space-y-4 z-10 relative">
            <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              The Scoping & Evaluation Process
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto">
              Follow these simple sequential milestones to audit and compile your project proposal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left relative z-10">
            
            {/* Step 1 */}
            <div className={`border rounded-3xl p-8 transition-shadow relative ${
              isDarkMode ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md'
            }`}>
              <div className={`absolute top-6 right-6 font-black text-4xl leading-none transition-colors duration-300 ${
                isDarkMode ? 'text-slate-800' : 'text-slate-100'
              }`}>01</div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs mb-6 ${
                isDarkMode ? 'bg-purple-950/50 text-purple-400' : 'bg-purple-50 text-purple-600'
              }`}>
                STEP
              </div>
              <h3 className={`text-base font-extrabold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Configure Onboarding</h3>
              <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Setup your profile details. Specify your academic department, current experience level, and draft a high-level description of your proposed software/scientific project.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`border rounded-3xl p-8 transition-shadow relative ${
              isDarkMode ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md'
            }`}>
              <div className={`absolute top-6 right-6 font-black text-4xl leading-none transition-colors duration-300 ${
                isDarkMode ? 'text-slate-800' : 'text-slate-100'
              }`}>02</div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs mb-6 ${
                isDarkMode ? 'bg-indigo-950/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
              }`}>
                STEP
              </div>
              <h3 className={`text-base font-extrabold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Execute Agent Audit</h3>
              <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Launch the 7-Agent verification pipeline. The autonomous network evaluates logic consistency, audits syntax alignment, models potential project risks, and maps feasibility constraints.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`border rounded-3xl p-8 transition-shadow relative ${
              isDarkMode ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md'
            }`}>
              <div className={`absolute top-6 right-6 font-black text-4xl leading-none transition-colors duration-300 ${
                isDarkMode ? 'text-slate-800' : 'text-slate-100'
              }`}>03</div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs mb-6 ${
                isDarkMode ? 'bg-blue-950/50 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                STEP
              </div>
              <h3 className={`text-base font-extrabold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Compile Formal Proposal</h3>
              <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Review your feasibility dashboard metrics, evaluate week-by-week sprint logs, and compile your final structured proposal into downloadable Markdown ready for institutional submission.
              </p>
            </div>

          </div>
        </section>

        {/* Data & Metrics Showcase */}
        <section className={`rounded-[2.5rem] p-12 shadow-xl text-center space-y-8 relative overflow-hidden transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950 border border-white/5 shadow-purple-950/20' 
            : 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white'
        }`}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>
          
          <div className="max-w-xl mx-auto space-y-4">
            <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
              isDarkMode ? 'bg-white/5 text-purple-300' : 'bg-white/10 text-purple-200'
            }`}>
              Measurable Performance
            </span>
            <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-white'}`}>
              Driving Student Project Success Rates
            </h2>
            <p className={`text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-300'}`}>
              We leverage multi-agent pipelines and vector indexing to deliver highly structured, reliable academic audits.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto pt-6">
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent">94/100</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Feasibility Score</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent">7</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialized AI Agents</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent">80%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review Time Saved</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent">24/7</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Mentor Availability</div>
            </div>
          </div>
        </section>

        {/* Academic Success Calculator (Interactive Widget) */}
        <section id="calculator" className="space-y-12 relative">
          <div className="text-center space-y-4 z-10 relative">
            <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Academic Success Calculator
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto">
              Slide to input your current drafting workload and estimate the time you will save using AI Academic Mentor.
            </p>
          </div>

          <div className={`border rounded-[2.5rem] max-w-4xl mx-auto overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all duration-300 z-10 relative ${
            isDarkMode 
              ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)]' 
              : 'bg-white border-slate-200/60 shadow-sm hover:shadow-md'
          }`}>
            {/* Sliders Input */}
            <div className="p-8 md:p-12 md:col-span-7 space-y-8 text-left">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Research Proposals/Ideas Drafted</label>
                  <span className={`text-sm font-black px-3 py-1 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-purple-950/50 text-purple-400' : 'bg-purple-50 text-purple-600'
                  }`}>{drafts} Proposals</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={drafts} 
                  onChange={(e) => setDrafts(parseInt(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-purple-600 transition-colors duration-300 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
                  }`}
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>1 Proposal</span>
                  <span>10 Proposals</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Manual Hours Spent Per Draft</label>
                  <span className={`text-sm font-black px-3 py-1 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-indigo-950/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  }`}>{hours} Hours</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="20" 
                  value={hours} 
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-colors duration-300 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
                  }`}
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>2 Hours</span>
                  <span>20 Hours</span>
                </div>
              </div>
            </div>

            {/* Calculations Result */}
            <div className={`p-8 md:p-12 md:col-span-5 flex flex-col justify-between text-left space-y-8 border-t md:border-t-0 md:border-l transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-950/50 border-white/[0.04]' : 'bg-slate-50 border-slate-200/60'
            }`}>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Scoping Savings</div>
                <div className={`text-5xl font-black flex items-baseline transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <span>{calculatedHoursSaved}</span>
                  <span className="text-lg font-bold text-slate-500 ml-2">Hours Saved</span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-4">
                  Based on automating up to 80% of methodology alignment checks, formatting syntax, and literature mapping parameters.
                </p>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center space-x-3 text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isDarkMode ? 'bg-purple-950/50 text-purple-400' : 'bg-purple-100 text-purple-600'
                  }`}>✓</span>
                  <span>5x Faster Project Review Cycle</span>
                </div>
                <div className={`flex items-center space-x-3 text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isDarkMode ? 'bg-indigo-950/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                  }`}>✓</span>
                  <span>Institutional Blueprint Grade: A+</span>
                </div>
              </div>


            </div>
          </div>
        </section>

        {/* Target Segments */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Designed For Academic Excellence
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto">
              Our workspace accommodates various user groups inside institutional academic frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <div className={`border rounded-3xl p-8 transition-colors duration-300 ${
              isDarkMode ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200/60 shadow-sm'
            }`}>
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Undergraduates</h3>
              <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Fulfill final year Capstone formatting requirements. Check logical feasibility, resolve package conflicts, and generate blueprint-grade thesis outlines easily.
              </p>
            </div>

            <div className={`border rounded-3xl p-8 transition-colors duration-300 ${
              isDarkMode ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200/60 shadow-sm'
            }`}>
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Graduate Researchers</h3>
              <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Validate advanced methodology architectures. Audit alignment indexes using external bioinformatic resources and cross-validate dependencies automatically.
              </p>
            </div>

            <div className={`border rounded-3xl p-8 transition-colors duration-300 ${
              isDarkMode ? 'bg-[#090b16]/70 border-white/[0.04] shadow-[0_15px_40px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200/60 shadow-sm'
            }`}>
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Capstone Coordinators</h3>
              <p className={`text-xs leading-relaxed font-semibold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Standardize grading checkpoints. Utilize automated multi-agent grading checklists to evaluate hundreds of code bases synchronously at scale.
              </p>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connected Infrastructure</h3>
            <h2 className={`text-2xl font-extrabold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System-Wide Integrations</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {["Google Gemini API", "Supabase DB", "Pinecone Index", "Ensembl DB", "ChEMBL DB", "Vite JS", "FastAPI Gateway"].map((tech, idx) => (
              <span key={idx} className={`border px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 shadow-sm ${
                isDarkMode 
                  ? 'bg-[#090b16] border-white/10 text-slate-300 hover:border-purple-500' 
                  : 'bg-white border-slate-200/60 text-slate-600 hover:border-purple-300'
              }`}>
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-8">
          <div className={`rounded-[2.5rem] p-12 md:p-16 shadow-xl text-center space-y-6 max-w-4xl mx-auto relative overflow-hidden transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950 border border-white/5 shadow-purple-950/20' 
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white'
          }`}>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight max-w-xl mx-auto">
              Ready to verify your next academic project?
            </h2>
            <p className={`text-xs md:text-sm font-medium max-w-md mx-auto transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-purple-100'}`}>
              Get detailed scoping feedback, structural pipeline reports, and instant proposal drafts today.
            </p>
            
            <div className="pt-4">
              <button
                onClick={onGetStarted}
                className="bg-white hover:bg-slate-50 text-slate-950 font-bold text-sm px-8 py-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                Launch Platform Portal
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Comprehensive Footer */}
      <footer className={`w-full border-t py-16 z-10 mt-32 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-8 text-left">
          
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                A
              </div>
              <span className={`font-extrabold text-base tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                AI Academic
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs">
              Automating academic scoping, system engineering, and linter audits with multi-agent orchestration structures.
            </p>
            <div className="text-[10px] text-slate-400 font-bold">
              © 2026 AI Academic Mentor. All rights reserved.
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isDarkMode ? 'text-slate-250' : 'text-slate-800'}`}>Product</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><a href="#features" className="hover:text-slate-700 transition-colors">Features</a></li>
              <li><a href="#workflow" className="hover:text-slate-700 transition-colors">Pipeline</a></li>
              <li><a href="#calculator" className="hover:text-slate-700 transition-colors">Impact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isDarkMode ? 'text-slate-250' : 'text-slate-800'}`}>Platform</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><a href="#" className="hover:text-slate-700 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-slate-700 transition-colors">API References</a></li>
              <li><a href="#" className="hover:text-slate-700 transition-colors">Relational Check</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isDarkMode ? 'text-slate-250' : 'text-slate-800'}`}>Company</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><a href="#" className="hover:text-slate-700 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}