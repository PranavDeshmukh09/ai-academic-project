import React, { useState } from 'react';

export default function LandingPage({ onGetStarted }) {
  const [activeTab, setActiveTab] = useState('pipeline');

  const mockTabs = {
    pipeline: {
      title: "Multi-Agent Log Stream",
      content: [
        { type: "sys", text: "⚡ Initiating Academic Verification Pipeline..." },
        { type: "agent", text: "🤖 [AdvisorAgent] Reviewing project description structure..." },
        { type: "info", text: "✓ Found matching methodology in Ensembl DB" },
        { type: "agent", text: "🤖 [LinterAgent] Auditing code syntax and dependencies..." },
        { type: "success", text: "✓ 0 errors, all packages successfully verified" },
        { type: "sys", text: "🚀 Verification pipeline completed. Project ready." }
      ],
      status: "Pipeline: Passed",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
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
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
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
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col relative overflow-x-hidden font-sans antialiased">
      
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      
      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center z-10 border-b border-white/[0.04] backdrop-blur-md bg-[#070913]/30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0252CD] to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            A
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            AI Academic
          </span>
        </div>
        
        {/* Navigation Items (AI Site Look) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
          <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          <a href="#pricing" className="hover:text-white transition-colors">API Spec</a>
        </nav>

        <div>
          <button 
            onClick={onGetStarted}
            className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Launch Platform
          </button>
        </div>
      </header>

      {/* Main Content Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center z-10 max-w-7xl mx-auto space-y-16">
        
        <div className="space-y-6 max-w-3xl">
          {/* Decorative Badge */}
          <div className="inline-flex items-center gap-2 bg-[#0252CD]/10 border border-[#0252CD]/20 text-[#3b82f6] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
            Agentic Pipeline v1.0.4 is Live
          </div>

          {/* Hero Headlines */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Verify academic code.<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0252CD] via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Automate assessment.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Bridge the gap between raw concept ideation and formal development execution with our multi-agent verification and scoring workspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md pt-2">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-white/5 transition-all cursor-pointer"
          >
            Get Started Onboarding
          </button>

          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-bold text-sm px-8 py-4 border border-white/[0.08] rounded-xl transition-all cursor-pointer"
          >
            Sign In to Profile
          </button>
        </div>

        {/* Interactive Dashboard Showcase (Crucial AI-platform feature) */}
        <div className="w-full max-w-4xl pt-6">
          <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 p-[1px] rounded-2xl shadow-2xl shadow-blue-500/5">
            <div className="bg-[#090b16] rounded-2xl overflow-hidden border border-white/[0.02]">
              {/* Showcase Header Tabs */}
              <div className="bg-slate-950/60 border-b border-white/[0.04] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-1.5 bg-white/[0.02] p-1 rounded-xl border border-white/[0.04]">
                  {Object.keys(mockTabs).map((tabKey) => (
                    <button
                      key={tabKey}
                      onClick={() => setActiveTab(tabKey)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeTab === tabKey
                          ? "bg-white/[0.08] text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tabKey === 'pipeline' && '🔗 Multi-Agent Pipeline'}
                      {tabKey === 'code' && '💻 Code Audit'}
                      {tabKey === 'score' && '📊 Academic Score'}
                    </button>
                  ))}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${mockTabs[activeTab].color}`}>
                  {mockTabs[activeTab].status}
                </div>
              </div>

              {/* Showcase Terminal/Workspace Preview */}
              <div className="p-6 text-left font-mono text-sm min-h-[220px] bg-slate-950/20 space-y-3 overflow-x-auto">
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  {mockTabs[activeTab].title}
                </div>
                {mockTabs[activeTab].content.map((line, idx) => (
                  <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                    <span className="text-slate-700 shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
                    <span className={
                      line.type === 'sys' ? 'text-slate-500' :
                      line.type === 'agent' ? 'text-indigo-300' :
                      line.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                    }>
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-16 text-left">
          
          <div className="bg-[#090b16]/40 border border-white/[0.03] backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:bg-slate-900/10 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-[#0252CD]/20 transition-all">
              📊
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interactive Skill Mapping</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Assess your expertise dynamically across technologies and research domains to map development pathways.
            </p>
          </div>

          <div className="bg-[#090b16]/40 border border-white/[0.03] backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:bg-slate-900/10 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-500/20 transition-all">
              📝
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Project Submission</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Submit your academic research proposals, codebases, and ideas with automated evaluation and scoring tracking.
            </p>
          </div>

          <div className="bg-[#090b16]/40 border border-white/[0.03] backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:bg-slate-900/10 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-500/20 transition-all">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Verification Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Trigger deep multi-agent validation loops to verify research methodologies, consistency, and syntax validity.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.02] py-8 text-center text-xs text-slate-500 z-10 bg-[#070913]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© 2026 AI Academic Mentor Portal. All rights reserved.</div>
          <div className="flex space-x-6 text-slate-600">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}