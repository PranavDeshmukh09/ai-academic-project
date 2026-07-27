import React, { useState } from 'react';

export default function MentorChatView({ userProfile }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatLog, setChatLog] = useState([
    { role: 'ai', txt: `Greetings ${userProfile.fullName}. Project orchestration node active for target domain "${userProfile.projectDomain}". Let's finalize your technical requirements.` }
  ]);
  const [textInput, setTextInput] = useState('');
  
  const historicalChats = [
    { id: 1, label: 'Initial Baseline Verification Log', date: 'July 19' },
    { id: 2, label: 'Architecture & Vector Stack Audit', date: 'July 20' }
  ];

  const triggerMessagePost = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setChatLog(prev => [
      ...prev,
      { role: 'user', txt: textInput },
      { role: 'ai', txt: `Understood. Ingesting query into localized RAG index logs to adapt context tracking for "${userProfile.projectTitle}".` }
    ]);
    setTextInput('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      
      {/* Dynamic Collapsible Chat History Left Panel */}
      <div className={`bg-slate-50 border-r border-slate-200/80 flex flex-col transition-all duration-200 ${isSidebarOpen ? 'w-56' : 'w-0'}`}>
        {isSidebarOpen && (
          <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chat History Stack</span>
              <div className="space-y-1.5">
                {historicalChats.map(hist => (
                  <button key={hist.id} className="w-full text-left p-2.5 bg-white border border-slate-100 rounded-xl hover:border-blue-200 text-[11px] font-semibold text-slate-600 block transition-all cursor-pointer truncate shadow-sm">
                    <span className="block truncate text-slate-800">{hist.label}</span>
                    <span className="text-[9px] text-slate-400 font-normal">{hist.date}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Right Side Active Communication Panel Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/10">
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all border border-slate-200 cursor-pointer">
              {isSidebarOpen ? '◀ Hide Log' : '▶ Show History'}
            </button>
            <span className="text-xs font-bold text-slate-800">Dynamic Multi-Agent Conversational Stream</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* Message Feeds */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 max-w-[80%] text-xs font-medium rounded-2xl leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#0252CD] text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 border border-slate-200/60 rounded-tl-none'}`}>
                {msg.txt}
              </div>
            </div>
          ))}
        </div>

        {/* Action input bar */}
        <form onSubmit={triggerMessagePost} className="p-3 border-t border-slate-100 bg-white flex gap-2">
          <input type="text" value={textInput} onChange={e=>setTextInput(e.target.value)} placeholder="Submit message to advisor cluster..." className="flex-1 px-4 py-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-[#0252CD]" />
          <button type="submit" className="px-4 py-2 bg-[#0252CD] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer">Send</button>
        </form>
      </div>

    </div>
  );
}