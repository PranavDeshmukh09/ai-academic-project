import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';

export default function MentorChat({ student }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello ${student?.name || 'there'}! I am your Multi-Agent Academic Mentor. Type a message below to evaluate your project scope, construct an engineering timeline, or run target architectural calculations.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat_reply'); // chat_reply, skill_report, project_plan, tech_stack, risk_analysis
  
  // Real-time tracking of executing agents returned by the backend array
  const [lastExecutedAgents, setLastExecutedAgents] = useState([]);

  // Persistent dynamic document store state matching the structural database schema
  const [agentDocuments, setAgentDocuments] = useState({
    skill_report: '',
    project_evaluation: '',
    project_plan: '',
    tech_stack: '',
    risk_analysis: '',
    mentor_advice: '',
    final_documentation: ''
  });

  const chatEndRef = useRef(null);

  // Keep chat scrolled smoothly to the bottom upon new tokens or streaming inputs
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      // Call the global proxy routing endpoint
      const data = await apiService.sendChatMessage(student?.student_id || 101, userText);

      // 1. Update active chat logs
      setMessages((prev) => [...prev, { role: 'ai', content: data.chat_reply }]);
      
      // 2. Map tracking nodes onto the state array indicators
      setLastExecutedAgents(data.agents_executed || []);

      // 3. Keep previously generated documents cached if incoming fields are blank
      setAgentDocuments((prev) => ({
        skill_report: data.skill_report || prev.skill_report,
        project_evaluation: data.project_evaluation || prev.project_evaluation,
        project_plan: data.project_plan || prev.project_plan,
        tech_stack: data.tech_stack || prev.tech_stack,
        risk_analysis: data.risk_analysis || prev.risk_analysis,
        mentor_advice: data.mentor_advice || prev.mentor_advice,
        final_documentation: data.final_documentation || prev.final_documentation
      }));

      // Smart UX Focus Shift: If a specialized agent ran, flip the artifact tab to display the updated data
      if (data.agents_executed && data.agents_executed.length > 0) {
        if (data.tech_stack) setActiveTab('tech_stack');
        else if (data.project_plan) setActiveTab('project_plan');
        else if (data.risk_analysis) setActiveTab('risk_analysis');
        else if (data.skill_report) setActiveTab('skill_report');
      }

    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', content: "⚠️ System connection interrupted due to external provider constraints. Please verify FastAPI console outputs or retry in 60s." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6 overflow-hidden animate-fadeIn">
      
      {/* LEFT COLUMN: Conversational Interface Module Workspace */}
      <div className="w-1/2 flex flex-col bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden h-full">
        
        {/* Chat Control Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Core Conversation Pipeline</h3>
            <p className="text-[11px] text-slate-400 font-medium">Multi-agent orchestrator access node</p>
          </div>
          
          {/* Active Execution Ring Status Indicator */}
          <div className="flex items-center space-x-2">
            {lastExecutedAgents.length > 0 ? (
              <div className="flex gap-1.5 animate-fadeIn">
                {lastExecutedAgents.map((agent, index) => (
                  <span key={index} className="text-[10px] bg-blue-50 text-[#0252CD] border border-blue-100 px-2 py-0.5 rounded-full font-bold">
                    {agent}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                ⚡ Standard Knowledge Context Active
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Message History Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar Indicators */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs shadow-sm ${
                  msg.role === 'user' ? 'bg-[#0252CD] text-white' : 'bg-slate-100 border border-slate-200 text-slate-600'
                }`}>
                  {msg.role === 'user' ? 'U' : '🤖'}
                </div>

                {/* Message Bubble Structure */}
                <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#0252CD] text-white rounded-tr-none' 
                    : 'bg-slate-50 border border-slate-200/60 text-[#0F172A] rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start items-center space-x-2 text-slate-400 font-semibold text-xs py-2 animate-pulse">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              <span>Orchestrator invoking specialist models...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Chat Message Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a question (e.g., 'What are my project risks?')..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#0252CD] transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-[#0252CD] hover:bg-[#013CA7] text-white rounded-xl transition-all shadow-sm disabled:opacity-40 shrink-0"
          >
            🚀
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: The Interactive Dynamic Multi-Agent Artifact Canvas Panel */}
      <div className="w-1/2 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
        
        {/* Navigation Tabs Header */}
        <div className="flex bg-slate-50 border-b border-slate-100 overflow-x-auto shrink-0">
          {[
            { id: 'chat_reply', label: 'Live Focus', icon: '🎯' },
            { id: 'skill_report', label: 'Skill Matrix', icon: '🔍' },
            { id: 'project_plan', label: 'Milestone Timeline', icon: '📅' },
            { id: 'tech_stack', label: 'Tech Stack', icon: '💻' },
            { id: 'risk_analysis', label: 'Risk Analysis', icon: '⚠️' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const hasData = tab.id === 'chat_reply' || !!agentDocuments[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-[#0252CD] text-[#0252CD] bg-white' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                } ${!hasData && tab.id !== 'chat_reply' ? 'opacity-40' : ''}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Workspace Canvas View Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          
          {activeTab === 'chat_reply' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <h4 className="text-xs font-bold text-[#0252CD] mb-1">Interactive Canvas Hub</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  As you interact with the system orchestrator, comprehensive documents generated by targeted backend agents materialize in real time. Use the tabs above to toggle views.
                </p>
              </div>
              <div className="border border-slate-100 rounded-xl bg-white p-5 min-h-[200px] shadow-sm">
                <h3 className="text-sm font-bold text-[#0F172A] mb-3">Latest Response Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {messages[messages.length - 1]?.content}
                </p>
              </div>
            </div>
          )}

          {/* Render Specialized Document Node Forms */}
          {['skill_report', 'project_plan', 'tech_stack', 'risk_analysis'].map((docKey) => {
            if (activeTab !== docKey) return null;
            const content = agentDocuments[docKey];

            return (
              <div key={docKey} className="animate-fadeIn space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <h3 className="text-base font-bold text-[#0F172A] capitalize">
                    {docKey.replace('_', ' ')} Artifact
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Auto-Synchronized
                  </span>
                </div>

                {content ? (
                  <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm min-h-[300px]">
                    <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                      {content}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-white border border-dashed border-slate-200 rounded-xl">
                    <span className="text-3xl opacity-50">🔒</span>
                    <div className="max-w-xs">
                      <p className="text-xs font-bold text-slate-700">Agent Output Locked</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Ask a specific question in the chat loop (e.g., "What tech stack should I use?") to trigger this specialist agent and unlock the artifact display.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}