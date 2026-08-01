import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function AIPipelineDemoView() {
  const [phase, setPhase] = useState('dashboard'); // 'dashboard', 'loading', 'results'
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('skill_report');
  const [planViewMode, setPlanViewMode] = useState('visual'); // 'visual' or 'markdown'
  
  // Projects dynamic state
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [fetchingProjects, setFetchingProjects] = useState(true);

  // Chat state
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: "Your project has been analyzed! I've reviewed your skills, evaluated your idea, and mapped out a timeline. What would you like to discuss first?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef(null);

  const tabs = [
    { id: 'skill_report', label: 'Skill Report' },
    { id: 'project_evaluation', label: 'Evaluation' },
    { id: 'project_plan', label: 'Plan' },
    { id: 'tech_stack', label: 'Tech Stack' },
    { id: 'risk_analysis', label: 'Risk Analysis' },
    { id: 'mentor_advice', label: 'Mentor Advice' },
    { id: 'final_documentation', label: 'Final Docs' },
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Fetch logged in student's projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) {
        setFetchingProjects(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/projects/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json().catch(() => null);
        if (response.ok && result && result.length > 0) {
          setProjects(result);
          setSelectedProjectId(result[0].project_id);
        }
      } catch (err) {
        console.error('Failed to fetch projects for pipeline view:', err);
      } finally {
        setFetchingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleInitialize = async () => {
    if (!selectedProjectId) {
      setError('Please select a project to initialize.');
      return;
    }
    setPhase('loading');
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: selectedProjectId })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setData(result);
        setPhase('results');
      } else {
        setError(result.detail || 'The AI pipeline encountered an error (potentially rate limits). Please try again in a minute.');
        setPhase('dashboard');
      }
    } catch (err) {
      setError('Failed to connect to the backend server. Is it running?');
      setPhase('dashboard');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting || !selectedProjectId) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatting(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: selectedProjectId, message: userMessage })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        let cleanReply = result.chat_reply || "";
        try {
          const parsed = JSON.parse(cleanReply);
          cleanReply = parsed.reply || cleanReply;
        } catch (e) {
          // not json
        }
        
        setChatHistory(prev => [...prev, { role: 'ai', content: cleanReply || "I didn't generate a response." }]);
        
        // Sync tabs with updated specialist agent knowledge bases
        setData(prevData => {
          if (!prevData) return result;
          return {
            ...prevData,
            skill_report: result.skill_report || prevData.skill_report,
            project_evaluation: result.project_evaluation || prevData.project_evaluation,
            project_plan: result.project_plan || prevData.project_plan,
            tech_stack: result.tech_stack || prevData.tech_stack,
            risk_analysis: result.risk_analysis || prevData.risk_analysis,
            mentor_advice: result.mentor_advice || prevData.mentor_advice,
            final_documentation: result.final_documentation || prevData.final_documentation
          };
        });
      } else {
        setChatHistory(prev => [...prev, { role: 'error', content: result.detail || "Error connecting to AI." }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'error', content: "Network error." }]);
    } finally {
      setIsChatting(false);
    }
  };

  if (fetchingProjects) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-slate-500 italic">
        Loading your active projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-4xl border border-amber-100 shadow-sm">
          🚀
        </div>
        <h2 className="text-2xl font-bold text-slate-800">No project proposal found</h2>
        <p className="text-slate-500 max-w-sm">
          Please submit a project proposal from the **Submit Project** dashboard tab first before launching the AI mentor pipeline.
        </p>
      </div>
    );
  }

  if (phase === 'dashboard') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4 max-w-2xl">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-sm">
            🤖
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Mentor Pipeline</h1>
          <p className="text-lg text-slate-600">
            Welcome to your project workspace. Our 7-agent AI team is ready to analyze your skills, evaluate your project idea, and generate a complete project roadmap.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 max-w-lg text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full max-w-md text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-xl">Ready to begin?</h3>
              <p className="text-xs text-slate-500">Select a project below to initiate analysis (takes 30-40 seconds).</p>
            </div>

            <div className="text-left space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Project</label>
              <select
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0252CD] bg-white cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.project_id} value={p.project_id}>
                    {p.title} ({p.domain})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleInitialize}
            className="w-full py-4 bg-gradient-to-r from-[#0252CD] to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-base flex items-center justify-center space-x-3 cursor-pointer"
          >
            <span>🚀</span>
            <span>Initialize AI Mentor Pipeline</span>
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping opacity-75 scale-150"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-[#0252CD] rounded-full flex items-center justify-center shadow-xl relative z-10 animate-pulse">
            <span className="text-4xl text-white">✨</span>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Agents are working...</h2>
          <p className="text-slate-500 font-medium">Orchestrating the 7-agent LangGraph pipeline.</p>
        </div>

        <div className="w-full max-w-sm space-y-4 mt-8">
          <div className="flex items-center space-x-3 text-slate-700">
            <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
            <span className="font-medium animate-pulse">Assessing Skills & Tech Stack...</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
            <span>Evaluating Project Feasibility...</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
            <span>Generating Architecture...</span>
          </div>
        </div>
      </div>
    );
  }

  const parseMilestones = (markdownText) => {
    if (!markdownText) return [];
    const lines = markdownText.split('\n');
    const milestones = [];
    let currentMilestone = null;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check if it's a milestone header
      const isHeader = trimmed.startsWith('#') || 
                       /^(?:milestone|week|phase|step|sprint|checkpoint)\b/i.test(trimmed);

      if (isHeader) {
        const match = trimmed.match(/^(?:#+\s*)?(?:Milestone|Week|Phase|Step|Sprint|Checkpoint)?\s*(\d+)[\.\s]*[:\-\s]*(.*)/i);
        if (match) {
          if (currentMilestone) {
            milestones.push(currentMilestone);
          }
          currentMilestone = {
            number: match[1],
            title: match[2].trim() || `Phase ${match[1]}`,
            description: '',
            tasks: []
          };
          continue;
        }
      }

      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
        if (currentMilestone) {
          currentMilestone.tasks.push(trimmed.replace(/^[-*•]\s*/, '').trim());
        }
      } else if (currentMilestone && currentMilestone.tasks.length === 0) {
        if (!trimmed.startsWith('#')) {
          currentMilestone.description = (currentMilestone.description ? currentMilestone.description + ' ' : '') + trimmed;
        }
      }
    }

    if (currentMilestone) {
      milestones.push(currentMilestone);
    }
    return milestones;
  };

  const renderProjectPlanTab = () => {
    const rawPlan = data.project_plan;
    const milestones = parseMilestones(rawPlan);

    if (milestones.length === 0) {
      return (
        <div className="markdown-content">
          <ReactMarkdown>{rawPlan}</ReactMarkdown>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center space-x-2">
            <span>📅</span>
            <span>Project Roadmap & Milestone Timeline</span>
          </h3>
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setPlanViewMode('visual')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                planViewMode === 'visual'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Visual Roadmap
            </button>
            <button
              onClick={() => setPlanViewMode('markdown')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                planViewMode === 'markdown'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Detailed Plan
            </button>
          </div>
        </div>

        {planViewMode === 'visual' ? (
          <div className="relative pl-8 border-l-2 border-dashed border-purple-200 py-2 space-y-6 ml-4">
            {milestones.map((ms, index) => (
              <div key={index} className="relative group animate-in fade-in duration-300">
                {/* Milestone Node Badge */}
                <div className="absolute -left-[49px] top-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-[#0252CD] text-white font-extrabold flex items-center justify-center shadow-md ring-4 ring-white group-hover:scale-110 transition-transform text-xs">
                  M{ms.number}
                </div>

                {/* Milestone Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-purple-300 transition-all duration-300 relative">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-purple-700 transition-colors">
                      {ms.title}
                    </h4>
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[9px] font-bold rounded-full uppercase tracking-wider">
                      Phase {ms.number}
                    </span>
                  </div>

                  {ms.description && (
                    <p className="text-slate-500 text-xs mb-3 italic">
                      {ms.description}
                    </p>
                  )}

                  {ms.tasks.length > 0 && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {ms.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start space-x-2.5 text-xs text-slate-600 bg-slate-50/55 p-2 rounded-xl border border-slate-100 hover:border-purple-100 hover:bg-white transition-all">
                          <span className="text-purple-500 font-extrabold mt-0.5">✓</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{rawPlan}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  // phase === 'results'
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4 animate-in fade-in duration-500 pb-4">
      <style>{`
        .markdown-content h1 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.25rem;
        }
        .markdown-content h2 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
          color: #334155;
        }
        .markdown-content ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .markdown-content ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .markdown-content li {
          margin-bottom: 0.25rem;
          line-height: 1.5;
          color: #475569;
        }
        .markdown-content strong {
          font-weight: 700;
          color: #0f172a;
        }
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
          font-size: 0.8rem;
        }
        .markdown-content th, .markdown-content td {
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          text-align: left;
        }
        .markdown-content th {
          background-color: #f8fafc;
          font-weight: 700;
          color: #1e293b;
        }
        .markdown-content pre {
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
        }
        .markdown-content code {
          font-family: monospace;
          font-size: 0.85em;
          background-color: #f1f5f9;
          padding: 2px 4px;
          border-radius: 4px;
          color: #0f172a;
        }
      `}</style>

      {/* Top Half: Insight Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-1/2 overflow-hidden shrink-0">
        
        {/* Tab Header */}
        <div className="flex overflow-x-auto border-b border-slate-200 scrollbar-hide bg-slate-50/50 p-2 gap-2 justify-between items-center pr-6">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-white text-purple-700 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Allow switching project directly from the results view */}
          {projects.length > 1 && (
            <select
              value={selectedProjectId || ''}
              onChange={(e) => {
                setSelectedProjectId(parseInt(e.target.value));
                setPhase('dashboard');
                setData(null);
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none bg-white cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.project_id} value={p.project_id}>
                  Switch: {p.title.slice(0, 15)}...
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-white custom-scrollbar text-sm">
          {data && data[activeTab] ? (
            activeTab === 'project_plan' ? (
              renderProjectPlanTab()
            ) : (
              <div className="markdown-content">
                <ReactMarkdown>{data[activeTab]}</ReactMarkdown>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 italic">
              No data generated for this section.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Half: Chat Window */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[300px]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#0252CD] text-white flex items-center justify-center text-sm shadow-sm">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">AI Mentor Chat</h3>
            <p className="text-xs text-slate-500">Ask questions about your generated plan</p>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30 custom-scrollbar">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#0252CD] text-white rounded-br-sm' 
                  : msg.role === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm prose prose-sm max-w-none'
              }`}>
                {msg.role === 'ai' ? (
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-sm">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          
          {isChatting && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-4 shadow-sm flex space-x-2 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask the mentor about your tech stack or timeline..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0252CD] focus:bg-white transition-all outline-none"
              disabled={isChatting}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatting}
              className="bg-[#0252CD] hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-bold text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
            >
              <span>Send</span>
              <span>↗</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
