import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';
import { apiService } from '../services/api';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif'
});

function MermaidRenderer({ chart }) {
  const [svg, setSvg] = useState('');
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (!chart) return;
    let isMounted = true;
    const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
    const cleanChart = chart.replace(/\\n/g, '\n').trim();

    mermaid.render(id, cleanChart)
      .then(({ svg }) => {
        if (isMounted) {
          setSvg(svg);
          setRenderError(false);
        }
      })
      .catch((err) => {
        console.warn("Mermaid rendering fallback triggered:", err);
        if (isMounted) setRenderError(true);
      });

    return () => { isMounted = false; };
  }, [chart]);

  if (renderError || !svg) {
    return (
      <div className="my-4 p-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs overflow-x-auto">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <span className="text-[10px] uppercase font-bold text-blue-400">📊 Architectural Block Diagram</span>
        </div>
        <pre className="whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="my-5 p-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto flex justify-center items-center select-text">
      <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full max-w-full flex justify-center" />
    </div>
  );
}

// --- Premium Vector Inline SVG Icons ---
const TargetIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const UserAvatarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const RobotAvatarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16.01" />
    <line x1="16" y1="16" x2="16" y2="16.01" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// --- Custom Text Cleaners for String Formatting ---
const cleanMarkdown = (str) => {
  if (!str) return '';
  return str
    .replace(/[`*#_~|]/g, '')
    .replace(/^:\s*/, '')
    .replace(/:\s*$/, '')
    .trim();
};

const parseColonLine = (line) => {
  const parts = line.split(':');
  if (parts.length > 1) {
    return {
      title: cleanMarkdown(parts[0]),
      description: cleanMarkdown(parts.slice(1).join(':'))
    };
  }
  return {
    title: '',
    description: cleanMarkdown(line)
  };
};

const cleanDictionaryOutput = (content) => {
  if (!content) return '';
  let str = '';
  if (typeof content === 'object') {
    str = content.reply || content.chat_reply || content.content || content.message_text || '';
  } else {
    str = String(content).trim();
  }

  if (str.startsWith('{') && (str.includes('"reply"') || str.includes("'reply'"))) {
    try {
      const parsed = JSON.parse(str);
      str = parsed.reply || parsed.chat_reply || parsed.content || parsed.message_text || str;
    } catch (e) {
      const match = str.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
      if (match && match[1]) {
        str = match[1];
      }
    }
  }

  if (typeof str === 'string') {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\t/g, '\t');
  }
  return str;
};

export default function MentorChat({ student, project, onProjectsChange, currentTheme }) {
  const isDark = currentTheme === 'dark';
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello ${student?.fullName || student?.name || 'there'}! I am your Multi-Agent Academic Mentor. Type a message below to evaluate your project scope, construct an engineering timeline, or run target architectural calculations.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingMemory, setFetchingMemory] = useState(false);
  const [activeTab, setActiveTab] = useState('chat_reply');
  
  // Real-time tracking of executing agents returned by the backend array
  const [lastExecutedAgents, setLastExecutedAgents] = useState([]);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);

  // Persistent dynamic document store state matching the structural database schema
  const [agentDocuments, setAgentDocuments] = useState({
    skill_report: '',
    project_evaluation: '',
    project_plan: '',
    tech_stack: '',
    risk_analysis: '',
    mentor_advice: '',
    final_documentation: '',
    check_in_report: '',
    generated_document: ''
  });

  // Progress Update state
  const [progressInput, setProgressInput] = useState('');
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressSuccessMessage, setProgressSuccessMessage] = useState('');
  const [progressError, setProgressError] = useState('');

  // Weekly Check-in state
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinError, setCheckinError] = useState('');

  // Document Generation state
  const [docType, setDocType] = useState('Synopsis');
  const [docLoading, setDocLoading] = useState(false);
  const [docError, setDocError] = useState('');
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState(false);

  const chatEndRef = useRef(null);

  // Keep chat scrolled smoothly to the bottom upon new tokens or streaming inputs
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch memory (existing chat messages and agent documents) on project change
  useEffect(() => {
    if (!project?.project_id) return;
    setSelectedTimelineIndex(0); // Reset stepper index on active project shift
    const fetchMemory = async () => {
      setFetchingMemory(true);
      try {
        const response = await fetch(`http://localhost:8000/projects/${project.project_id}/memory`);
        if (response.ok) {
          const data = await response.json();
          // Load document states
          setAgentDocuments({
            skill_report: data.memory.skill_report || '',
            project_evaluation: data.memory.project_evaluation || '',
            project_plan: data.memory.project_plan || '',
            tech_stack: data.memory.tech_stack || '',
            risk_analysis: data.memory.risk_analysis || '',
            mentor_advice: data.memory.mentor_advice || '',
            final_documentation: data.memory.final_documentation || '',
            check_in_report: data.memory.check_in_report || '',
            generated_document: ''
          });

          // Load chat history if present
          if (data.chat_history && data.chat_history.length > 0) {
            const formatted = data.chat_history.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'ai',
              content: msg.content
            }));
            setMessages(formatted);
          } else {
            // Reset to default welcome message if no history
            setMessages([
              { role: 'ai', content: `Hello ${student?.fullName || student?.name || 'there'}! I am your Multi-Agent Academic Mentor. Type a message below to evaluate your project scope, construct an engineering timeline, or run target architectural calculations.` }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load project memory:", err);
      } finally {
        setFetchingMemory(false);
      }
    };
    fetchMemory();
  }, [project?.project_id, student]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Call standard apiService sending current project reference
      const data = await apiService.sendChatMessage(project.project_id, userMessage);
      
      // Update real-time chat reply
      if (data.chat_reply) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.chat_reply }]);
      }

      // Update executed agents log
      if (data.agents_executed) {
        setLastExecutedAgents(data.agents_executed);
      }

      // Update dynamic document store fields with incoming server data
      setAgentDocuments((prev) => ({
        ...prev,
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

  // Progress Submit Handler
  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    if (!progressInput.trim() || progressLoading) return;
    setProgressLoading(true);
    setProgressError('');
    setProgressSuccessMessage('');
    try {
      const data = await apiService.submitProgressUpdate(project.project_id, progressInput);
      setProgressSuccessMessage(data.message || 'Progress update submitted successfully!');
      setProgressInput('');
      // If backend returned a new project plan, update it!
      if (data.project_plan) {
        setAgentDocuments(prev => ({
          ...prev,
          project_plan: data.project_plan
        }));
      }
    } catch (err) {
      console.error(err);
      setProgressError(err.response?.data?.detail || 'Failed to submit progress update. Please try again.');
    } finally {
      setProgressLoading(false);
    }
  };

  // Run Weekly Checkin Handler
  const handleRunCheckin = async () => {
    if (checkinLoading) return;
    setCheckinLoading(true);
    setCheckinError('');
    try {
      const data = await apiService.runWeeklyCheckin(project.project_id);
      // Update check-in report document state
      setAgentDocuments(prev => ({
        ...prev,
        check_in_report: data.check_in_report || data.report || ''
      }));
    } catch (err) {
      console.error(err);
      setCheckinError(err.response?.data?.detail || 'Failed to run weekly check-in. Please try again.');
    } finally {
      setCheckinLoading(false);
    }
  };

  // Generate On-Demand Document Handler
  const handleGenerateDoc = async () => {
    if (docLoading) return;
    setDocLoading(true);
    setDocError('');
    try {
      const data = await apiService.generateDocument(project.project_id, docType);
      setAgentDocuments(prev => ({
        ...prev,
        generated_document: data.generated_document || data.document || ''
      }));
    } catch (err) {
      console.error(err);
      setDocError(err.response?.data?.detail || 'Failed to generate document. Please try again.');
    } finally {
      setDocLoading(false);
    }
  };

  // Download Markdown Document Handler
  const handleDownloadDoc = () => {
    const docContent = agentDocuments.generated_document;
    if (!docContent) return;
    const blob = new Blob([docContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${docType.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to format the skill assessment text into a grid of skill badges grouped by category
  const renderSkillMatrix = (text) => {
    if (!text) return null;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const categories = [];
    let currentCategory = null;
    
    lines.forEach(line => {
      const cleaned = line.replace(/^[-\*\+\d\.\s]+/g, '').trim();
      if (!cleaned) return;
      
      // Skip generic titles
      if (cleaned.toLowerCase() === 'skill report' || cleaned.toLowerCase().startsWith('skill report for') || cleaned.toLowerCase().startsWith('skills assessment')) {
        return;
      }
      
      // Check if it's a category header (e.g. "Core Strengths", "Areas of Weakness", "Recommendations")
      const isHeader = line.includes('Strength') || line.includes('Weakness') || line.includes('Recommendation') || line.includes('Skill') || /^\d+\./.test(line) || line.startsWith('##');
      if (isHeader) {
        if (currentCategory) {
          categories.push(currentCategory);
        }
        currentCategory = {
          title: cleanMarkdown(cleaned),
          items: []
        };
      } else {
        if (currentCategory) {
          const parsed = parseColonLine(cleaned);
          currentCategory.items.push(parsed);
        } else {
          // Fallback first category
          currentCategory = {
            title: "General Assessment",
            items: [parseColonLine(cleaned)]
          };
        }
      }
    });
    
    if (currentCategory) {
      categories.push(currentCategory);
    }
    
    // Fallback if parsing yielded no categories
    if (categories.length === 0) {
      return (
        <div className={`border rounded-xl p-5 shadow-sm ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <p className={`text-xs leading-relaxed font-semibold whitespace-pre-wrap ${
            isDark ? 'text-slate-300' : 'text-slate-650'
          }`}>{text}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fadeIn">
        {categories.map((cat, idx) => {
          // Determine section themes/colors
          const isWeakness = cat.title.toLowerCase().includes('weakness');
          const isRecommendation = cat.title.toLowerCase().includes('recommend');
          
          let dotColor = 'bg-emerald-500';
          let borderHover = 'hover:border-emerald-300';
          let badgeText = 'Strength';
          let badgeStyle = isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-100';
          
          if (isWeakness) {
            dotColor = 'bg-rose-500';
            borderHover = 'hover:border-rose-300';
            badgeText = 'Weakness';
            badgeStyle = isDark ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-rose-50 text-rose-700 border-rose-100';
          } else if (isRecommendation) {
            dotColor = 'bg-blue-500';
            borderHover = 'hover:border-blue-300';
            badgeText = 'Action Item';
            badgeStyle = isDark ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-100';
          } else {
            dotColor = 'bg-emerald-500';
          }
          
          return (
            <div key={idx} className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${borderHover} ${
              isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <h4 className={`text-xs font-black border-b pb-2 mb-4 uppercase tracking-wide ${
                isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
              }`}>
                {cat.title}
              </h4>
              {cat.items.length > 0 ? (
                <div className="space-y-3.5">
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start justify-between gap-3 flex-col sm:flex-row sm:items-center">
                      <div className="flex items-start space-x-3">
                        <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotColor}`}></span>
                        <div>
                          {item.title ? (
                            <>
                              <span className={`font-bold text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}: </span>
                              <span className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-650'}`}>{item.description}</span>
                            </>
                          ) : (
                            <span className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-650'}`}>{item.description}</span>
                          )}
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shrink-0 self-start sm:self-center border ${badgeStyle}`}>
                        {badgeText}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No feedback points available.</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to format project planning milestone list into a styled horizontal stepper
  const renderTimeline = (text) => {
    if (!text) return null;
    
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const cleanLine = trimmed.replace(/[*#_`~]/g, '').trim();
      
      // Match 1: Markdown header (e.g., "# Header", "## Header")
      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
      
      // Match 2: Lines that start with a phase/milestone keyword followed by a number
      // e.g. "Milestone 1:", "Phase 2 -", "Weeks 1-4:", "* Weeks 5-12:"
      const keywordHeaderMatch = trimmed.match(/^(?:[-*•]|\d+\.)?\s*\*\*?(?:Milestone|Phase|Week|Weeks|Step|Sprint|Checkpoint)\s+\d+.*?$/i);
      
      // Match 3: Lines starting with a keyword in plain text (must have a digit and not be bulleted/indented)
      const startsWithKeyword = /^(?:Milestone|Phase|Week|Weeks|Step|Sprint|Checkpoint)\s+\d+/i.test(trimmed);
      
      // Match 4: Bold lines enclosing a milestone reference (must contain a digit to avoid matching general headings like "**Milestones:**")
      const isBoldPhase = trimmed.startsWith('**') && trimmed.endsWith('**') && 
                          /\d+/.test(cleanLine) &&
                          (cleanLine.toLowerCase().includes('week') || 
                           cleanLine.toLowerCase().includes('phase') || 
                           cleanLine.toLowerCase().includes('milestone'));

      // Match 5: Numbered list items that contain milestone references (e.g. "8. Finalization and Deployment (Weeks 17-20):")
      const isNumberedMilestone = /^\d+\.\s+.*(?:Weeks?|Phase|Milestone)\b/i.test(cleanLine);

      const isHeader = headerMatch || keywordHeaderMatch || startsWithKeyword || isBoldPhase || isNumberedMilestone;
      
      if (isHeader) {
        if (currentSection) {
          sections.push(currentSection);
        }
        
        let title = "";
        if (headerMatch) {
          title = cleanMarkdown(headerMatch[2]);
        } else {
          // Clean prefixes like "* ", "1. ", "**", etc.
          title = cleanMarkdown(trimmed.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, ''));
        }
        
        currentSection = {
          title: title,
          bodyLines: []
        };
      } else {
        if (currentSection) {
          currentSection.bodyLines.push(line);
        } else {
          currentSection = {
            title: "Project Initialization",
            bodyLines: [line]
          };
        }
      }
    });
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    // Filter out any sections that are just title/intro with no real body items
    const filteredSections = sections.filter(sec => 
      sec.title.toLowerCase() !== 'milestone timeline' && 
      sec.title.toLowerCase() !== 'project plan' &&
      (sec.bodyLines.length > 0 || sec.title.length > 0)
    );

    if (filteredSections.length === 0) {
      return (
        <div className={`border rounded-xl p-5 shadow-sm ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <p className={`text-xs leading-relaxed font-semibold whitespace-pre-wrap ${
            isDark ? 'text-slate-300' : 'text-slate-650'
          }`}>{text}</p>
        </div>
      );
    }

    // Ensure selected index is inside array bounds
    const activeIndex = Math.min(selectedTimelineIndex, filteredSections.length - 1);
    const activeSection = filteredSections[activeIndex] || filteredSections[0];

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Horizontal Timeline Track */}
        <div className={`border rounded-xl p-5 shadow-sm flex flex-col items-center ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 self-start">Milestone Stepper Roadmap</p>
          
          <div className="w-full flex items-center justify-between relative px-4 py-2 overflow-x-auto min-h-[80px]">
            {/* Connecting Track Line */}
            <div className={`absolute top-[28px] left-10 right-10 h-0.5 -z-10 ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}></div>
            
            {filteredSections.map((sec, idx) => {
              const isCompleted = idx < activeIndex;
              const isActive = idx === activeIndex;
              
              // Extract a short label like "Phase 1" or "Week 2" from title
              let shortLabel = sec.title.split(':')[0] || sec.title;
              if (shortLabel.length > 15) {
                shortLabel = shortLabel.substring(0, 15) + '...';
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedTimelineIndex(idx)}
                  className="flex flex-col items-center focus:outline-none cursor-pointer group relative shrink-0 px-2"
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                    isActive 
                      ? 'border-[#0252CD] bg-[#0252CD] text-white shadow-sm ring-4 ring-blue-100 scale-110' 
                      : isCompleted
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                        : isDark
                          ? 'border-slate-700 bg-slate-800 text-slate-400 group-hover:border-slate-600 group-hover:text-slate-200'
                          : 'border-slate-200 bg-white text-slate-400 group-hover:border-slate-350 group-hover:text-slate-600'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[10px] mt-2 font-bold tracking-wide transition-colors ${
                    isActive 
                      ? 'text-[#0252CD]' 
                      : isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    {shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Phase Details Card */}
        <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 mb-4 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div>
              <span className={`text-[9px] font-black uppercase border px-2.5 py-0.5 rounded-md tracking-wider ${
                isDark ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-blue-50 text-[#0252CD] border-blue-100'
              }`}>
                Phase {activeIndex + 1} of {filteredSections.length}
              </span>
              <h3 className={`text-sm font-black mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeSection.title}</h3>
            </div>
          </div>
          
          {activeSection.bodyLines.length > 0 ? (
            <div className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-650'}`}>
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1.5" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1.5" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  strong: ({node, ...props}) => <strong className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`} {...props} />,
                }}
              >
                {activeSection.bodyLines.join('\n').trim()}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No plan details specified for this phase.</p>
          )}

          {/* Stepper Navigation Buttons */}
          <div className={`flex justify-between items-center mt-6 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <button
              onClick={() => setSelectedTimelineIndex(prev => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              className={`px-3.5 py-1.5 border rounded-lg text-xs font-bold transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center space-x-1.5 ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>←</span>
              <span>Previous</span>
            </button>
            <button
              onClick={() => setSelectedTimelineIndex(prev => Math.min(filteredSections.length - 1, prev + 1))}
              disabled={activeIndex === filteredSections.length - 1}
              className="px-4 py-1.5 bg-[#0252CD] text-white rounded-lg text-xs font-bold hover:bg-[#013CA7] transition-all disabled:opacity-30 disabled:hover:bg-[#0252CD] cursor-pointer flex items-center space-x-1.5"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to format tech stack text as tech item badges with tech indicator glows
  const renderTechStack = (text) => {
    if (!text) return null;
    
    // Split by newlines to inspect lines
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
      
    const validTechs = [];
    
    lines.forEach(line => {
      // Ignore markdown code block markers
      if (line.startsWith('```')) return;
      
      // Ignore markdown table divider & pipe header lines like "| --- | :--- |" or "| Component | Technology |"
      if (line.includes('--- |') || line.includes('| ---') || line.includes(':---') || line.includes('---:') || /^\|.*\|$/.test(line)) {
        return;
      }
      
      // Clean leading bullet marks
      const cleaned = line.replace(/^[-\*\+\d\.\s\|]+/g, '').replace(/\|$/g, '').trim();
      if (!cleaned) return;
      
      // Skip conversational header/footer lines or generic table headers
      const lower = cleaned.toLowerCase();
      if (lower.includes('here is') || 
          lower.includes('based on') || 
          lower.includes('considering') || 
          lower.includes('project plan') || 
          lower.includes('tech stack for') ||
          lower.includes('we recommend') ||
          lower === 'component' || lower === 'technology' || lower === 'description' ||
          cleaned.length > 150) {
        return;
      }
      
      // Parse colon splitter
      const colonIndex = cleaned.indexOf(':');
      if (colonIndex !== -1) {
        const title = cleaned.substring(0, colonIndex).trim();
        const description = cleaned.substring(colonIndex + 1).trim();
        
        // If the title is short (likely a tech name/category), it's a valid tech definition
        if (title.length < 50) {
          const cleanTitle = cleanMarkdown(title);
          const cleanDesc = cleanMarkdown(description);
          if (cleanTitle && cleanTitle !== '-' && cleanTitle !== '|') {
            validTechs.push({
              title: cleanTitle,
              description: cleanDesc
            });
          }
        }
      } else {
        // If there is no colon, but it's a short line (likely a single tech name, e.g. "Python"), we can keep it
        const cleanTitle = cleanMarkdown(cleaned);
        if (cleanTitle && cleanTitle.length < 40 && line.match(/^[-*\+\d]/)) {
          validTechs.push({
            title: cleanTitle,
            description: ''
          });
        }
      }
    });

    if (validTechs.length === 0) {
      // Fallback: If parsing filtered out everything, display rendered markdown
      return (
        <div className={`border rounded-xl p-5 shadow-sm ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {renderMarkdownDocument(text)}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
        {validTechs.map((tech, i) => {
          const categories = [
            { label: 'Frontend / UI', icon: <CodeIcon /> },
            { label: 'Backend / Core', icon: <CodeIcon /> },
            { label: 'Database / Storage', icon: <CodeIcon /> },
            { label: 'AI / Pipeline', icon: <CodeIcon /> }
          ];
          const cat = categories[i % categories.length];
          return (
            <div key={i} className={`p-4 border rounded-xl flex items-start space-x-3 transition-all group ${
              isDark 
                ? 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-slate-700' 
                : 'bg-white border-slate-200 text-slate-900 hover:border-blue-300 hover:shadow-sm'
            }`}>
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                isDark ? 'bg-blue-950 text-blue-300' : 'bg-blue-50 text-[#0252CD]'
              }`}>
                {cat.icon}
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{cat.label}</p>
                <h4 className={`text-xs font-black mt-0.5 transition-colors ${
                  isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-[#0252CD]'
                }`}>{tech.title}</h4>
                {tech.description && (
                  <p className={`text-xs mt-1 leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>{tech.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to format risk items as alert cards with glowing caution flags
  const renderRiskAnalysis = (text) => {
    if (!text) return null;
    
    // Strip any raw reasoning XML tags
    const cleanText = text.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '').trim();
    
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const risks = [];
    let currentRisk = null;
    let parsingMitigation = false;
    
    lines.forEach(line => {
      const rawLine = line.replace(/^[-\*\d\.\s]+/g, '').trim();
      if (!rawLine) return;
      
      // Check if it defines a new Risk / Technical Blocker item
      const isNewRisk = /^#*\s*(risk|blocker|threat|gap)\s*\d*[:\-]/i.test(rawLine) || 
                        /^\*\*?\s*(risk|blocker)\s*\d*/i.test(rawLine);
      
      if (isNewRisk) {
        if (currentRisk) {
          risks.push(currentRisk);
        }
        const colonIdx = rawLine.indexOf(':');
        const name = colonIdx !== -1 ? rawLine.substring(colonIdx + 1).trim() : rawLine;
        
        currentRisk = {
          name: cleanMarkdown(name.replace(/[\*#]/g, '')),
          likelihood: 'High',
          impact: 'High',
          technicalBlocker: '',
          skillGap: '',
          mitigation: []
        };
        parsingMitigation = false;
        return;
      }
      
      // If we are currently building a risk item
      if (currentRisk) {
        const lowerCleaned = rawLine.toLowerCase();
        
        // Parse Likelihood & Impact
        if (lowerCleaned.includes('likelihood') || lowerCleaned.includes('probability')) {
          const colonIdx = rawLine.indexOf(':');
          currentRisk.likelihood = cleanMarkdown(colonIdx !== -1 ? rawLine.substring(colonIdx + 1) : 'Medium');
          parsingMitigation = false;
        } else if (lowerCleaned.includes('impact') || lowerCleaned.includes('severity')) {
          const colonIdx = rawLine.indexOf(':');
          currentRisk.impact = cleanMarkdown(colonIdx !== -1 ? rawLine.substring(colonIdx + 1) : 'High');
          parsingMitigation = false;
        } else if (lowerCleaned.includes('skill gap') || lowerCleaned.includes('competency gap')) {
          const colonIdx = rawLine.indexOf(':');
          currentRisk.skillGap = cleanMarkdown(colonIdx !== -1 ? rawLine.substring(colonIdx + 1) : rawLine);
          parsingMitigation = false;
        } else if (lowerCleaned.includes('technical blocker') || lowerCleaned.includes('stack requirement') || lowerCleaned.includes('challenge')) {
          const colonIdx = rawLine.indexOf(':');
          currentRisk.technicalBlocker = cleanMarkdown(colonIdx !== -1 ? rawLine.substring(colonIdx + 1) : rawLine);
          parsingMitigation = false;
        } else if (lowerCleaned.includes('mitigation') || lowerCleaned.includes('prevention') || lowerCleaned.includes('solution') || lowerCleaned.includes('strategy')) {
          parsingMitigation = true;
        } else if (parsingMitigation) {
          currentRisk.mitigation.push(cleanMarkdown(rawLine));
        } else {
          // Fallback append to blocker if it doesn't match any key and is reasonably long
          if (rawLine.length > 5 && !currentRisk.technicalBlocker) {
            currentRisk.technicalBlocker = cleanMarkdown(rawLine);
          }
        }
      }
    });
    
    if (currentRisk) risks.push(currentRisk);

    if (risks.length === 0) return renderMarkdownDocument(cleanText);

    return (
      <div className="space-y-6 animate-fadeIn">
        {risks.map((risk, i) => {
          const isHigh = risk.likelihood.toLowerCase().includes('high') || risk.impact.toLowerCase().includes('high');
          return (
            <div key={i} className={`p-6 border rounded-3xl shadow-sm transition-all ${
              isHigh 
                ? isDark ? 'bg-rose-950/40 border-rose-900/60 text-slate-100' : 'bg-rose-50/50 border-rose-200 text-slate-900'
                : isDark ? 'bg-amber-950/40 border-amber-900/60 text-slate-100' : 'bg-amber-50/50 border-amber-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/40">
                <div className="flex items-center space-x-3">
                  <span className={`p-2 rounded-xl shrink-0 shadow-xs ${isHigh ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                    <AlertIcon />
                  </span>
                  <h4 className={`text-sm font-black leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>{risk.name}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    isHigh ? 'bg-rose-950/80 text-rose-300 border-rose-800' : 'bg-amber-950/80 text-amber-300 border-amber-800'
                  }`}>
                    Likelihood: {risk.likelihood}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    Impact: {risk.impact}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {risk.technicalBlocker && (
                  <div className={`p-4 border rounded-2xl shadow-xs space-y-1 ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200/80 text-slate-800'
                  }`}>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Technical Blocker</p>
                    <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{risk.technicalBlocker}</p>
                  </div>
                )}
                {risk.skillGap && (
                  <div className={`p-4 border rounded-2xl shadow-xs space-y-1 ${
                    isDark ? 'bg-rose-950/60 border-rose-800 text-rose-200' : 'bg-white/90 border-slate-200/80 text-rose-900'
                  }`}>
                    <p className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">Identified Student Skill Gap</p>
                    <p className="text-xs font-semibold leading-relaxed">{risk.skillGap}</p>
                  </div>
                )}
              </div>
              
              {risk.mitigation.length > 0 && (
                <div className={`border rounded-2xl p-4 shadow-xs space-y-2 ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200/80 text-slate-800'
                }`}>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>🛡️ Step-by-Step Mitigation Strategy</span>
                  </p>
                  <ul className="space-y-2">
                    {risk.mitigation.map((strategy, sIndex) => (
                      <li key={sIndex} className={`text-xs flex items-start space-x-2.5 leading-relaxed font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <span className="select-none shrink-0 text-emerald-500 font-black">✓</span>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMarkdownDocument = (text) => {
    if (!text) return null;
    const cleanText = cleanDictionaryOutput(text);
    return (
      <div className={`border rounded-xl p-6 shadow-sm overflow-y-auto max-h-[650px] markdown-content select-text ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-800'
      }`}>
        <ReactMarkdown
          components={{
            p: ({node, ...props}) => <p className={`text-xs leading-relaxed mb-3 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-655'}`} {...props} />,
            li: ({node, ...props}) => <li className={`text-xs mb-1.5 list-disc ml-5 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-655'}`} {...props} />,
            ul: ({node, ...props}) => <ul className="mb-3 font-semibold" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-3 font-semibold" {...props} />,
            h1: ({node, ...props}) => <h1 className={`text-base font-extrabold mb-3 uppercase tracking-wide border-b pb-1.5 ${isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'}`} {...props} />,
            h2: ({node, ...props}) => <h2 className={`text-sm font-bold mb-2 mt-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`} {...props} />,
            h3: ({node, ...props}) => <h3 className={`text-xs font-bold mb-1 mt-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`} {...props} />,
            table: ({node, ...props}) => <table className={`w-full border-collapse border my-4 text-xs font-semibold ${isDark ? 'border-slate-800' : 'border-slate-200'}`} {...props} />,
            th: ({node, ...props}) => <th className={`border px-3 py-2 text-left font-bold ${isDark ? 'border-slate-800 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`} {...props} />,
            td: ({node, ...props}) => <td className={`border px-3 py-2 ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-655'}`} {...props} />,
            code: ({node, inline, className, children, ...props}) => {
              const match = /language-(\w+)/.exec(className || '');
              const lang = match ? match[1].toLowerCase() : '';
              const codeContent = String(children).replace(/\n$/, '');

              if (lang === 'mermaid') {
                return <MermaidRenderer chart={codeContent} />;
              }

              return !inline ? (
                <div className="relative my-3 rounded-lg overflow-hidden border border-slate-700 shadow-sm max-w-full text-slate-100 select-text">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 text-slate-300">
                    <span className="text-[9px] font-black uppercase tracking-wider text-blue-400">
                      {match ? match[1] : 'code'}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(codeContent)}
                      className="px-2 py-0.5 text-[9px] font-bold text-white hover:text-white bg-blue-600 hover:bg-blue-700 rounded border border-blue-500 transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>📋</span>
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 p-3.5 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-100">
                    <code>{codeContent}</code>
                  </pre>
                </div>
              ) : (
                <code className={`border px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
                  isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {cleanText}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className={`flex h-[calc(100vh-4rem)] overflow-hidden animate-fadeIn relative transition-all duration-300 ${
      isWorkspaceCollapsed ? 'gap-0' : 'gap-6'
    }`}>
      {fetchingMemory && (
        <div className={`absolute inset-0 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-3 ${
          isDark ? 'bg-slate-950/80 text-slate-300' : 'bg-white/70 text-slate-500'
        }`}>
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0252CD] rounded-full animate-spin"></div>
          <span className="text-xs font-bold">Retrieving project advisory database context...</span>
        </div>
      )}
      
      <div className={`flex flex-col backdrop-blur-xl border rounded-3xl shadow-lg overflow-hidden h-full transition-all duration-300 ${
        isWorkspaceCollapsed ? 'w-full flex-1' : 'w-1/2 flex-1'
      } ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50' : 'bg-white/75 border-white/80 text-slate-900 shadow-sky-950/5'
      }`}>

        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/50 border-slate-100'
        }`}>
          <div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Core Conversation Pipeline</h3>
            <p className="text-[11px] text-slate-400 font-medium">Multi-agent orchestrator access node</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {lastExecutedAgents.length > 0 ? (
              <div className="flex gap-1.5 animate-fadeIn">
                {lastExecutedAgents.map((agent, index) => (
                  <span key={index} className={`text-[10px] border px-2 py-0.5 rounded-full font-bold ${
                    isDark ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-blue-50 text-[#0252CD] border-blue-100'
                  }`}>
                    {agent}
                  </span>
                ))}
              </div>
            ) : (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'
              }`}>
                Diagnostic Node Active
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
                    isUser 
                      ? 'bg-[#0252CD] border-[#0252CD] text-white' 
                      : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    {isUser ? <UserAvatarIcon /> : <RobotAvatarIcon />}
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm border ${
                    isUser 
                      ? 'bg-gradient-to-r from-[#0252CD] to-indigo-600 border-[#0252CD]/20 text-white rounded-tr-none shadow-md shadow-blue-500/10' 
                      : isDark ? 'bg-slate-800/90 border-slate-700 text-slate-100 rounded-tl-none' : 'bg-white/90 border-slate-200/80 text-[#0F172A] rounded-tl-none shadow-xs'
                  }`}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{cleanDictionaryOutput(msg.content)}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          strong: ({node, ...props}) => <strong className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`} {...props} />,
                          h1: ({node, ...props}) => <h1 className={`text-xs font-bold mb-2 uppercase tracking-wide ${isDark ? 'text-slate-200' : 'text-slate-800'}`} {...props} />,
                          h2: ({node, ...props}) => <h2 className={`text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`} {...props} />,
                          code: ({node, inline, className, children, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const lang = match ? match[1].toLowerCase() : '';
                            const codeContent = String(children).replace(/\n$/, '');

                            if (lang === 'mermaid') {
                              return <MermaidRenderer chart={codeContent} />;
                            }

                            return !inline ? (
                              <div className="relative my-3 rounded-lg overflow-hidden border border-slate-700 shadow-sm max-w-full text-slate-100 select-text">
                                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 text-slate-300">
                                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-400">
                                    {match ? match[1] : 'code'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(codeContent)}
                                    className="px-2 py-0.5 text-[9px] font-bold text-white hover:text-white bg-blue-600 hover:bg-blue-700 rounded border border-blue-500 transition-all cursor-pointer flex items-center space-x-1"
                                  >
                                    <span>📋</span>
                                    <span>Copy</span>
                                  </button>
                                </div>
                                <pre className="bg-slate-900 p-3.5 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-100">
                                  <code>{codeContent}</code>
                                </pre>
                              </div>
                            ) : (
                              <code className={`border px-1 py-0.5 rounded text-[10px] font-mono font-bold ${
                                isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                              }`} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {cleanDictionaryOutput(msg.content)}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {loading && (
            <div className="flex justify-start items-center space-x-2 text-slate-400 font-semibold text-xs py-2 animate-pulse">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              <span>Orchestrator invoking specialist models...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className={`p-4 border-t flex items-center gap-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/50 border-slate-100'
        }`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask a question (e.g., 'What are my project risks?')...."
            className={`flex-1 border rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-colors disabled:opacity-60 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-[#0252CD]' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#0252CD]'
            }`}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-[#0252CD] hover:bg-[#013CA7] text-white rounded-xl transition-all shadow-sm disabled:opacity-40 shrink-0 cursor-pointer flex items-center justify-center"
          >
            <SendIcon />
          </button>
        </form>
      </div>

      <div className={`transition-all duration-300 relative overflow-visible h-full flex flex-col ${
        isWorkspaceCollapsed 
          ? 'w-0 border-none shadow-none bg-transparent' 
          : 'w-1/2 backdrop-blur-xl border rounded-3xl shadow-lg ' + 
            (isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50' : 'bg-white/75 border-white/80 text-slate-900 shadow-sky-950/5')
      }`}>
        
        {/* Floating absolute positioned Collapse Toggle Arrow Button on the LEFT edge of the right-side block */}
        <button 
          type="button"
          onClick={() => setIsWorkspaceCollapsed(!isWorkspaceCollapsed)} 
          className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border flex items-center justify-center shadow-md cursor-pointer z-50 transition-all ${
            isWorkspaceCollapsed ? '-left-7' : '-left-3.5'
          } ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-350 hover:text-white hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-550 hover:text-slate-800 hover:bg-slate-50'
          }`}
          title={isWorkspaceCollapsed ? "Expand Agent Workspace" : "Collapse Agent Workspace"}
        >
          {isWorkspaceCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>

        {/* Inner wrapper to hide content and prevent layout shifting when collapsed */}
        <div className={`flex flex-col h-full w-full overflow-hidden rounded-3xl ${
          isWorkspaceCollapsed ? 'hidden opacity-0 pointer-events-none' : ''
        }`}>
          
          <div className={`flex border-b overflow-x-auto shrink-0 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            {[
              { id: 'chat_reply', label: 'Live Focus', icon: <TargetIcon /> },
              { id: 'skill_report', label: 'Skills', icon: <SearchIcon /> },
              { id: 'project_evaluation', label: 'Evaluation', icon: <SearchIcon /> },
              { id: 'project_plan', label: 'Plan', icon: <CalendarIcon /> },
              { id: 'tech_stack', label: 'Tech Stack', icon: <CodeIcon /> },
              { id: 'risk_analysis', label: 'Risks', icon: <AlertIcon /> },
              { id: 'mentor_advice', label: 'Mentor', icon: <TargetIcon /> },
              { id: 'final_documentation', label: 'Final Docs', icon: <CalendarIcon /> },
              { id: 'progress_update', label: 'Progress', icon: <CodeIcon /> },
              { id: 'check_in_report', label: 'Check-in', icon: <CalendarIcon /> },
              { id: 'generated_document', label: 'Gen Docs', icon: <AlertIcon /> }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              const hasData = tab.id === 'chat_reply' || 
                              tab.id === 'progress_update' || 
                              tab.id === 'check_in_report' || 
                              tab.id === 'generated_document' || 
                              !!agentDocuments[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3.5 text-xs font-black whitespace-nowrap border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                    isSelected 
                      ? isDark ? 'border-[#0252CD] text-blue-400 bg-slate-800/60' : 'border-[#0252CD] text-[#0252CD] bg-white'
                      : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-400 hover:text-slate-600'
                  } ${!hasData && tab.id !== 'chat_reply' ? 'opacity-40' : ''}`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-slate-950/40' : 'bg-slate-50/30'}`}>
            
            {activeTab === 'chat_reply' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`p-4 border rounded-xl ${
                  isDark ? 'bg-blue-950/50 border-blue-900/60 text-slate-200' : 'bg-blue-50/50 border-blue-100 text-slate-700'
                }`}>
                  <h4 className="text-xs font-bold text-[#0252CD] mb-1 flex items-center space-x-1.5">
                    <TargetIcon />
                    <span>Interactive Canvas Hub</span>
                  </h4>
                  <p className={`text-[11px] font-bold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                    As you interact with the system orchestrator, comprehensive documents generated by targeted backend agents materialize in real time. Use the tabs above to toggle views.
                  </p>
                </div>
                <div className={`border rounded-xl p-5 min-h-[200px] shadow-sm ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
                }`}>
                  <h3 className={`text-sm font-bold mb-3 border-b pb-2 ${isDark ? 'text-white border-slate-800' : 'text-[#0F172A] border-slate-100'}`}>Latest Response Summary</h3>
                  <div className={`text-xs leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-650'}`}>
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        strong: ({node, ...props}) => <strong className={`font-black ${isDark ? 'text-white' : 'text-slate-800'}`} {...props} />,
                        code: ({node, inline, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const lang = match ? match[1].toLowerCase() : '';
                          const codeContent = String(children).replace(/\n$/, '');

                          if (lang === 'mermaid') {
                            return <MermaidRenderer chart={codeContent} />;
                          }

                          return !inline ? (
                            <div className="relative my-3 rounded-lg overflow-hidden border border-slate-700 shadow-sm max-w-full text-slate-100 select-text">
                              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 text-slate-300">
                                <span className="text-[9px] font-black uppercase tracking-wider text-blue-400">
                                  {match ? match[1] : 'code'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText(codeContent)}
                                  className="px-2 py-0.5 text-[9px] font-bold text-white hover:text-white bg-blue-600 hover:bg-blue-700 rounded border border-blue-500 transition-all cursor-pointer flex items-center space-x-1"
                                >
                                  <span>📋</span>
                                  <span>Copy</span>
                                </button>
                              </div>
                              <pre className="bg-slate-900 p-3.5 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-100">
                                <code>{codeContent}</code>
                              </pre>
                            </div>
                          ) : (
                            <code className="bg-slate-100 text-slate-800 border border-slate-200 px-1 py-0.5 rounded text-[10px] font-mono font-bold" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {cleanDictionaryOutput(messages[messages.length - 1]?.content)}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Render Specialized Document Node Forms */}
            {activeTab === 'skill_report' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <SearchIcon />
                    <span>Skill Matrix Artifact</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    Auto-Synchronized
                  </span>
                </div>
                {agentDocuments.skill_report ? (
                  renderSkillMatrix(agentDocuments.skill_report)
                ) : (
                  <div className={`flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed rounded-xl ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <span className={`p-3 rounded-2xl border shadow-sm animate-pulse ${
                      isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <LockIcon />
                    </span>
                    <div className="max-w-xs">
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Agent Output Locked</p>
                      <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Ask a specific question in the chat loop (e.g., "Analyze my developer skills matrix") to trigger this specialist agent and unlock the artifact display.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'project_plan' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <CalendarIcon />
                    <span>Milestone Timeline</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    Auto-Synchronized
                  </span>
                </div>
                {agentDocuments.project_plan ? (
                  renderTimeline(agentDocuments.project_plan)
                ) : (
                  <div className={`flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed rounded-xl ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <span className={`p-3 rounded-2xl border shadow-sm animate-pulse ${
                      isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <LockIcon />
                    </span>
                    <div className="max-w-xs">
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Agent Output Locked</p>
                      <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Ask a specific question in the chat loop (e.g., "Create a milestone plan") to trigger this specialist agent and unlock the timeline layout.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tech_stack' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <CodeIcon />
                    <span>Tech Stack Design</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    Auto-Synchronized
                  </span>
                </div>
                {agentDocuments.tech_stack ? (
                  renderTechStack(agentDocuments.tech_stack)
                ) : (
                  <div className={`flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed rounded-xl ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <span className={`p-3 rounded-2xl border shadow-sm animate-pulse ${
                      isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <LockIcon />
                    </span>
                    <div className="max-w-xs">
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Agent Output Locked</p>
                      <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Ask a specific question in the chat loop (e.g., "Recommend a tech stack") to trigger this specialist agent and unlock the technology layout.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'risk_analysis' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <AlertIcon />
                    <span>Risk Vector Analysis</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    Auto-Synchronized
                  </span>
                </div>
                {agentDocuments.risk_analysis ? (
                  renderRiskAnalysis(agentDocuments.risk_analysis)
                ) : (
                  <div className={`flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed rounded-xl ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <span className={`p-3 rounded-2xl border shadow-sm animate-pulse ${
                      isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <LockIcon />
                    </span>
                    <div className="max-w-xs">
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Agent Output Locked</p>
                      <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Ask a specific question in the chat loop (e.g., "Evaluate my project risks") to trigger this specialist agent and unlock the risk breakdown.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'project_evaluation' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <span>📝</span>
                    <span>Project Evaluation</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    Auto-Synchronized
                  </span>
                </div>
                {agentDocuments.project_evaluation ? (
                  renderMarkdownDocument(agentDocuments.project_evaluation)
                ) : (
                  <div className={`flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed rounded-xl ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <span className={`p-3 rounded-2xl border shadow-sm animate-pulse ${
                      isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <LockIcon />
                    </span>
                    <div className="max-w-xs">
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Agent Output Locked</p>
                      <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Ask a specific question in the chat loop (e.g., "Evaluate my project") to trigger this specialist agent and unlock the evaluation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'mentor_advice' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <span>🤝</span>
                    <span>Mentor Advice</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    Auto-Synchronized
                  </span>
                </div>
                {agentDocuments.mentor_advice ? (
                  renderMarkdownDocument(agentDocuments.mentor_advice)
                ) : (
                  <div className={`flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed rounded-xl ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <span className={`p-3 rounded-2xl border shadow-sm animate-pulse ${
                      isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <LockIcon />
                    </span>
                    <div className="max-w-xs">
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Agent Output Locked</p>
                      <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Ask a specific question in the chat loop (e.g., "Give me mentor advice") to trigger this specialist agent and unlock the advice.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'final_documentation' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <span>📚</span>
                    <span>Final Documentation</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    Auto-Synchronized
                  </span>
                </div>
                {agentDocuments.final_documentation ? (
                  renderMarkdownDocument(agentDocuments.final_documentation)
                ) : (
                  <div className={`flex flex-col items-center justify-center py-20 text-center space-y-3 border border-dashed rounded-xl ${
                    isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <span className={`p-3 rounded-2xl border shadow-sm animate-pulse ${
                      isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <LockIcon />
                    </span>
                    <div className="max-w-xs">
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Agent Output Locked</p>
                      <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Ask a specific question in the chat loop (e.g., "Compile my final documentation") to trigger this specialist agent and unlock the documents.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress_update' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <span>🔄</span>
                    <span>Submit Progress Update</span>
                  </h3>
                </div>

                {progressSuccessMessage && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-700 rounded-xl text-xs font-bold shadow-sm">
                    {progressSuccessMessage}
                  </div>
                )}
                {progressError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold shadow-sm">
                    ⚠️ {progressError}
                  </div>
                )}

                <form onSubmit={handleProgressSubmit} className={`p-5 border rounded-xl shadow-sm space-y-4 ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
                }`}>
                  <div className="space-y-2">
                    <label className={`block text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>What did you accomplish this week?</label>
                    <textarea 
                      value={progressInput}
                      onChange={(e) => setProgressInput(e.target.value)}
                      required
                      disabled={progressLoading}
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0252CD] resize-none ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                      placeholder="e.g. I finished setting up the database and wrote the API endpoints."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={progressLoading || !progressInput.trim()}
                    className="w-full px-5 py-2.5 bg-[#0252CD] text-white text-xs font-bold rounded-xl hover:bg-blue-600 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>{progressLoading ? 'Adjusting Plan...' : 'Submit Update & Adjust Plan'}</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'check_in_report' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <span>📅</span>
                    <span>Weekly Check-in</span>
                  </h3>
                </div>

                {checkinError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold shadow-sm">
                    ⚠️ {checkinError}
                  </div>
                )}

                <div className={`p-5 border rounded-xl shadow-sm flex flex-col items-center justify-center text-center space-y-4 ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
                }`}>
                  <div className="max-w-xs">
                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Run Weekly Check-in</p>
                    <p className={`text-[11px] mt-1 leading-relaxed font-semibold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                      Let the AI Mentor review your progress updates and evaluate your deliverables.
                    </p>
                  </div>
                  <button
                    onClick={handleRunCheckin}
                    disabled={checkinLoading}
                    className="px-6 py-2.5 bg-[#0252CD] text-white text-xs font-bold rounded-xl hover:bg-blue-600 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>{checkinLoading ? 'Reviewing Progress...' : 'Run Weekly Check-in'}</span>
                  </button>
                </div>

                {agentDocuments.check_in_report && (
                  <div className="mt-4">
                    <h4 className={`text-xs font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Check-in Report</h4>
                    {renderMarkdownDocument(agentDocuments.check_in_report)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'generated_document' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                  <h3 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    <span>📄</span>
                    <span>On-Demand Document Generation</span>
                  </h3>
                </div>

                {docError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold shadow-sm">
                    ⚠️ {docError}
                  </div>
                )}

                <div className={`p-5 border rounded-xl shadow-sm space-y-4 ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
                }`}>
                  <div className="space-y-2">
                    <label className={`block text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Select Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      disabled={docLoading}
                      className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none ${
                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="Synopsis">Synopsis</option>
                      <option value="Methodology">Methodology</option>
                      <option value="Progress Report">Progress Report</option>
                      <option value="Final Thesis Outline">Final Thesis Outline</option>
                    </select>
                  </div>
                  <button
                    onClick={handleGenerateDoc}
                    disabled={docLoading}
                    className="w-full px-5 py-2.5 bg-[#0252CD] text-white text-xs font-bold rounded-xl hover:bg-blue-600 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>{docLoading ? `Generating ${docType}...` : 'Generate Document'}</span>
                  </button>
                </div>

                {agentDocuments.generated_document && (
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <h4 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Generated {docType}</h4>
                      <button
                        onClick={handleDownloadDoc}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center space-x-1.5 shadow-sm"
                      >
                        <span>📥</span>
                        <span>Download Markdown</span>
                      </button>
                    </div>
                    {renderMarkdownDocument(agentDocuments.generated_document)}
                  </div>
                )}
              </div>
            )}

        </div>
      </div>
    </div>
  </div>
);
}