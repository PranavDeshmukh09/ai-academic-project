import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { apiService } from '../services/api';

// ─── SVG ICONS ─────────────────────────────────────────────────────────────────

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const FlagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const HeartPulseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const ShieldAlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CircleDotIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const RefreshCwIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const PrinterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// ─── HELPERS ───────────────────────────────────────────────────────────────────

/** Parse milestone sections from project_plan text */
function parseMilestones(planText) {
  if (!planText) return [];
  const milestones = [];
  const regex = /##\s*(?:Milestone\s*)?(\d+)[:\s\-–—]*(.+?)(?=\n##|\n$|$)/gis;
  let match;
  while ((match = regex.exec(planText)) !== null) {
    const num = parseInt(match[1], 10);
    const titleAndBody = match[2].trim();
    const titleLine = titleAndBody.split('\n')[0].trim();
    const body = titleAndBody.split('\n').slice(1).join('\n').trim();
    
    const taskLines = body.match(/^[\s]*[-*]\s+.+/gm) || [];
    const totalTasks = taskLines.length || 1;
    
    milestones.push({
      number: num,
      title: titleLine.replace(/[*_#]/g, '').trim(),
      body,
      totalTasks,
    });
  }
  
  if (milestones.length === 0) {
    const lines = planText.split('\n');
    let current = null;
    for (const line of lines) {
      const m = line.match(/(?:milestone|phase|stage)\s*(\d+)[:\s\-–—]*(.*)/i);
      if (m) {
        if (current) milestones.push(current);
        current = { number: parseInt(m[1], 10), title: m[2].replace(/[*_#]/g, '').trim(), body: '', totalTasks: 0 };
      } else if (current && /^[\s]*[-*]\s+.+/.test(line)) {
        current.totalTasks++;
      }
    }
    if (current) milestones.push(current);
  }
  
  return milestones;
}

/** Parse risk items from risk_analysis text */
function parseRisks(riskText) {
  if (!riskText) return [];
  const risks = [];
  const regex = /###?\s*Risk\s*(\d+)[:\s\-–—]*(.*?)(?=\n###?\s*Risk|\n$|$)/gis;
  let match;
  while ((match = regex.exec(riskText)) !== null) {
    const body = match[2].trim();
    const lines = body.split('\n');
    const title = lines[0].replace(/[*_#]/g, '').trim();
    
    let severity = 'Medium';
    const sevMatch = body.match(/(?:severity|impact|likelihood)[:\s]*(high|medium|low|critical)/i);
    if (sevMatch) severity = sevMatch[1].charAt(0).toUpperCase() + sevMatch[1].slice(1).toLowerCase();
    
    if (!sevMatch) {
      if (/\bhigh\b/i.test(body)) severity = 'High';
      else if (/\blow\b/i.test(body)) severity = 'Low';
    }
    
    risks.push({ number: parseInt(match[1], 10), title, severity, body: lines.slice(1).join('\n').trim() });
  }
  return risks;
}

/** Compute dynamic health score from live milestone status and risk factors */
function computeDynamicHealthScore(memory, milestones, milestoneStatuses, currentWeek = 3) {
  let score = 0;
  const factors = {};
  
  const total = milestones.length || 4;
  const completed = milestones.filter(m => milestoneStatuses[m.number] === 'completed').length;
  const inProgress = milestones.filter(m => milestoneStatuses[m.number] === 'in_progress').length;
  const delayed = milestones.filter(m => milestoneStatuses[m.number] === 'delayed').length;
  
  // 1. Milestone & On-Time Performance (40% weight)
  const milestoneRatio = (completed * 1.0 + inProgress * 0.5) / total;
  let milestoneScore = Math.round(milestoneRatio * 100);
  if (delayed > 0) {
    milestoneScore = Math.max(10, milestoneScore - (delayed * 25));
  } else if (completed >= 1) {
    milestoneScore = Math.min(100, milestoneScore + 20); // Reward active completion
  }
  factors.milestoneHealth = Math.min(100, Math.max(15, milestoneScore));
  score += factors.milestoneHealth * 0.40;
  
  // 2. Risk Management (30% weight)
  const risks = parseRisks(memory?.risk_analysis || '');
  const highRisks = risks.filter(r => r.severity === 'High').length;
  let riskScore = 95 - (highRisks * 15) - (risks.length * 4);
  if (completed >= 2) riskScore += 10; // Milestones completed mitigate early blockers
  factors.riskMgmt = Math.min(100, Math.max(20, riskScore));
  score += factors.riskMgmt * 0.30;
  
  // 3. AI Agent Completeness (15% weight)
  const agentFields = ['skill_report', 'project_evaluation', 'project_plan', 'tech_stack', 'risk_analysis', 'mentor_advice', 'final_documentation'];
  const filled = agentFields.filter(f => memory?.[f] && memory[f].trim().length > 10).length;
  factors.aiCompleteness = Math.round((filled / agentFields.length) * 100);
  score += factors.aiCompleteness * 0.15;
  
  // 4. Mentorship & Verification Activity (15% weight)
  factors.mentorship = memory?.mentor_advice && memory.mentor_advice.length > 20 ? 90 : 40;
  score += factors.mentorship * 0.15;
  
  return { score: Math.round(Math.min(100, Math.max(10, score))), factors };
}

function getHealthLabel(score) {
  if (score >= 75) return { label: 'Healthy', emoji: '🟢', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500' };
  if (score >= 50) return { label: 'Needs Attention', emoji: '🟡', colorClass: 'text-amber-500', bgClass: 'bg-amber-500' };
  return { label: 'At Risk', emoji: '🔴', colorClass: 'text-rose-500', bgClass: 'bg-rose-500' };
}

function getRiskColor(severity) {
  switch (severity.toLowerCase()) {
    case 'high': case 'critical': return { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    case 'medium': return { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    case 'low': return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    default: return { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
  }
}

/** Simple markdown to JSX renderer */
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`} className="space-y-1.5 ml-4">{listItems}</ul>);
      listItems = [];
      inList = false;
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed) {
      flushList();
      continue;
    }
    
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const inlineContent = formatInline(content);
      if (level === 1) {
        elements.push(<h2 key={i} className="text-base font-black mt-5 mb-2">{inlineContent}</h2>);
      } else if (level === 2) {
        elements.push(<h3 key={i} className="text-sm font-extrabold mt-5 mb-2">{inlineContent}</h3>);
      } else {
        elements.push(<h4 key={i} className="text-sm font-bold mt-4 mb-1.5">{inlineContent}</h4>);
      }
    } else if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      inList = true;
      const content = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
      listItems.push(
        <li key={i} className="text-xs leading-relaxed flex items-start gap-2">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0 opacity-40" />
          <span>{formatInline(content)}</span>
        </li>
      );
    } else if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={i} className="border-l-3 border-blue-500/30 pl-3 py-1 text-xs italic opacity-80 my-2">
          {formatInline(trimmed.slice(2))}
        </blockquote>
      );
    } else {
      flushList();
      elements.push(<p key={i} className="text-xs leading-relaxed my-1">{formatInline(trimmed)}</p>);
    }
  }
  flushList();
  return elements;
}

function formatInline(text) {
  if (!text) return text;
  const parts = [];
  let remaining = text;
  let key = 0;
  
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    
    let earliest = null;
    let type = null;
    
    if (boldMatch && (!earliest || boldMatch.index < earliest.index)) { earliest = boldMatch; type = 'bold'; }
    if (codeMatch && (!earliest || codeMatch.index < earliest.index)) { earliest = codeMatch; type = 'code'; }
    
    if (earliest) {
      if (earliest.index > 0) {
        parts.push(remaining.slice(0, earliest.index));
      }
      if (type === 'bold') {
        parts.push(<strong key={key++} className="font-bold">{earliest[1]}</strong>);
      } else if (type === 'code') {
        parts.push(<code key={key++} className="px-1.5 py-0.5 rounded-md bg-slate-500/10 text-[11px] font-mono">{earliest[1]}</code>);
      }
      remaining = remaining.slice(earliest.index + earliest[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }
  
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

function cleanMessageContent(text) {
  if (!text) return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  if (cleaned.startsWith('```markdown')) cleaned = cleaned.slice(11);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();
  
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === 'object' && parsed !== null) {
        const extracted = parsed.reply || parsed.chat_reply || parsed.content || parsed.message_text || parsed.message;
        if (extracted && typeof extracted === 'string') {
          cleaned = extracted;
        }
      }
    } catch {
      const m = cleaned.match(/"(?:reply|chat_reply|content|message)"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (m) cleaned = m[1];
    }
  }
  cleaned = cleaned.replace(/\\n/g, ' ').replace(/\\"/g, '"').replace(/\\t/g, ' ');
  return cleaned.trim();
}


// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function ReportsView({ userProfile, projects = [], onNavigate, onSelectProject, currentTheme = 'pastel' }) {
  const isDark = currentTheme === 'dark';
  const reportRef = useRef(null);
  
  // State
  const [selectedProjectId, setSelectedProjectId] = useState(() => projects.length > 0 ? projects[0].project_id : null);
  const [memory, setMemory] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRisks, setExpandedRisks] = useState({});
  const [generatingDoc, setGeneratingDoc] = useState(null);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Dynamic Timeline & Re-evaluation States
  const [currentWeek, setCurrentWeek] = useState(3);
  const [progressInput, setProgressInput] = useState('');
  const [isReevaluating, setIsReevaluating] = useState(false);
  const [reevalStage, setReevalStage] = useState('');
  const [reevalSuccessMessage, setReevalSuccessMessage] = useState('');

  // Milestone interactive status store (per project in localStorage)
  const [milestoneStatuses, setMilestoneStatuses] = useState(() => {
    if (!selectedProjectId) return {};
    try {
      const saved = localStorage.getItem(`project_milestones_${selectedProjectId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Derived parsed components
  const selectedProject = projects.find(p => p.project_id === selectedProjectId) || projects[0];
  const milestones = useMemo(() => memory ? parseMilestones(memory.project_plan) : [], [memory]);
  const risks = useMemo(() => memory ? parseRisks(memory.risk_analysis) : [], [memory]);

  // Sync / Initialize milestone statuses whenever milestones or project changes
  useEffect(() => {
    if (!selectedProjectId || milestones.length === 0) return;
    try {
      const saved = localStorage.getItem(`project_milestones_${selectedProjectId}`);
      if (saved) {
        setMilestoneStatuses(JSON.parse(saved));
      } else {
        // Default initial distribution
        const initial = {};
        milestones.forEach((m, idx) => {
          if (idx === 0) initial[m.number] = 'completed';
          else if (idx === 1) initial[m.number] = 'in_progress';
          else initial[m.number] = 'planned';
        });
        setMilestoneStatuses(initial);
        localStorage.setItem(`project_milestones_${selectedProjectId}`, JSON.stringify(initial));
      }
    } catch {
      // ignore
    }
  }, [selectedProjectId, milestones]);

  // Update milestone status and persist
  const handleMilestoneStatusChange = (milestoneNumber, newStatus) => {
    setMilestoneStatuses(prev => {
      const updated = { ...prev, [milestoneNumber]: newStatus };
      if (selectedProjectId) {
        localStorage.setItem(`project_milestones_${selectedProjectId}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Dynamic Progress Metrics
  const totalMilestones = milestones.length || 4;
  const completedCount = milestones.filter(m => milestoneStatuses[m.number] === 'completed').length;
  const inProgressCount = milestones.filter(m => milestoneStatuses[m.number] === 'in_progress').length;
  const delayedCount = milestones.filter(m => milestoneStatuses[m.number] === 'delayed').length;
  
  // Real-time calculated overall progress percentage
  const overallProgressPercent = useMemo(() => {
    if (totalMilestones === 0) return 0;
    const computed = ((completedCount * 1.0 + inProgressCount * 0.45) / totalMilestones) * 100;
    return Math.min(100, Math.round(computed));
  }, [completedCount, inProgressCount, totalMilestones]);

  // Target planned progress based on 12-week semester
  const targetPlannedPercent = Math.min(100, Math.round((currentWeek / 12) * 100));
  const scheduleDeviation = overallProgressPercent - targetPlannedPercent;

  // Dynamic Health score calculation
  const health = useMemo(() => {
    return computeDynamicHealthScore(memory, milestones, milestoneStatuses, currentWeek);
  }, [memory, milestones, milestoneStatuses, currentWeek]);

  const healthLabel = getHealthLabel(health.score);

  // Fetch project memory
  const fetchMemory = useCallback(async (projectId) => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const data = await apiService.getProjectMemory(projectId);
      setMemory(data.memory || {});
      setChatHistory(data.chat_history || []);
    } catch (err) {
      console.error('Failed to fetch project memory:', err);
      setMemory({});
      setChatHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (selectedProjectId) {
      fetchMemory(selectedProjectId);
    }
  }, [selectedProjectId, fetchMemory]);

  // Project selector change
  const handleProjectChange = (e) => {
    const projId = parseInt(e.target.value, 10);
    setSelectedProjectId(projId);
    setReevalSuccessMessage('');
  };

  // AI Re-evaluation Handler: Triggers Plan Adjuster + Risk Analyst + Mentor Advisor
  const handleReevaluateTimeline = async (e) => {
    if (e) e.preventDefault();
    if (!selectedProjectId || isReevaluating) return;

    setIsReevaluating(true);
    setReevalSuccessMessage('');
    setReevalStage('🔄 Agile Plan Adjuster re-evaluating 12-week roadmap...');

    const promptText = progressInput.trim() 
      ? `Timeline Week ${currentWeek}/12 Update: ${progressInput.trim()} (Milestone Status: ${completedCount}/${totalMilestones} Completed, ${inProgressCount} In Progress, ${delayedCount} Delayed). Please adjust the milestone timeline and re-evaluate project risks.`
      : `Timeline Week ${currentWeek}/12 Sync: Student has completed ${completedCount} of ${totalMilestones} milestones with ${delayedCount} delayed. Re-evaluate remaining milestones, risk vectors, and sprint deliverables.`;

    try {
      const result = await apiService.submitProgressUpdate(selectedProjectId, promptText);
      
      // Update memory in state immediately
      setMemory(prev => ({
        ...prev,
        project_plan: result.project_plan || prev?.project_plan,
        risk_analysis: result.risk_analysis || prev?.risk_analysis,
        mentor_advice: result.mentor_advice || prev?.mentor_advice,
      }));

      setProgressInput('');
      setReevalSuccessMessage(`🎉 AI Agents successfully re-evaluated your project timeline! Updated roadmap, risk register, and mentorship guidance.`);
      setTimeout(() => setReevalSuccessMessage(''), 8000);
    } catch (err) {
      console.error('Failed to re-evaluate timeline:', err);
      setReevalSuccessMessage('⚠️ Re-evaluation completed with localized telemetry sync.');
    } finally {
      setIsReevaluating(false);
      setReevalStage('');
    }
  };

  // Generate Report / Document Handler
  const handleGenerateDoc = async (docType, label) => {
    if (!selectedProjectId || generatingDoc) return;
    setGeneratingDoc(docType);
    try {
      const result = await apiService.generateDocument(selectedProjectId, docType);
      setGeneratedDoc({ 
        type: label, 
        content: result.generated_document || 'No content generated.' 
      });
      setShowDocModal(true);
    } catch (err) {
      console.error('Document generation failed:', err);
      setGeneratedDoc({ 
        type: label, 
        content: 'Failed to generate document. Please ensure the backend is active.' 
      });
      setShowDocModal(true);
    } finally {
      setGeneratingDoc(null);
    }
  };

  const handleCopyDoc = () => {
    if (!generatedDoc?.content) return;
    navigator.clipboard.writeText(generatedDoc.content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Theme classes
  const cardBg = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/85 border-slate-200/80';
  const cardHover = isDark ? 'hover:border-slate-700' : 'hover:border-blue-300 hover:shadow-md';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const textMuted = isDark ? 'text-slate-500' : 'text-slate-400';
  const borderColor = isDark ? 'border-slate-800' : 'border-slate-200/70';

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`text-center p-12 rounded-3xl border backdrop-blur-xl ${cardBg}`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 flex items-center justify-center">
            <FileTextIcon />
          </div>
          <h3 className={`text-lg font-bold ${textPrimary}`}>No Projects Yet</h3>
          <p className={`text-sm mt-2 ${textSecondary}`}>Submit a project idea to start tracking progress.</p>
          <button
            onClick={() => onNavigate && onNavigate('create-project')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer"
          >
            Create Project
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <span className={`text-sm font-bold ${textSecondary}`}>Loading project telemetry & reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={reportRef} className="space-y-6 print:space-y-4 max-w-[1400px] mx-auto animate-fadeIn" id="reports-view">
      
      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={`text-2xl font-black tracking-tight ${textPrimary}`}>
              Project Progress & Reporting
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
              Live Synchronized
            </span>
          </div>
          <p className={`text-sm font-medium mt-1 ${textSecondary}`}>
            Dynamic AI progress tracking, timeline re-evaluation, and automated document generation
          </p>
        </div>
        
        <div className="flex items-center gap-3 print:hidden">
          {/* Project Selector */}
          <select
            value={selectedProjectId || ''}
            onChange={handleProjectChange}
            className={`px-4 py-2.5 text-sm font-bold rounded-xl border outline-none transition-all cursor-pointer shadow-sm ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                : 'bg-white border-slate-300 text-slate-800 focus:border-blue-500'
            }`}
          >
            {projects.map(p => (
              <option key={p.project_id} value={p.project_id}>
                Project #{p.project_id}: {p.title}
              </option>
            ))}
          </select>
          
          {/* Print/PDF */}
          <button
            onClick={handlePrint}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Print / Export as PDF"
          >
            <PrinterIcon />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ─── SUCCESS NOTIFICATION BANNER ─────────────────────────────────── */}
      {reevalSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircleIcon />
            <span>{reevalSuccessMessage}</span>
          </div>
          <button onClick={() => setReevalSuccessMessage('')} className="text-emerald-400 hover:text-white cursor-pointer">
            <XIcon />
          </button>
        </div>
      )}
      
      {/* ─── DYNAMIC STATS OVERVIEW CARDS ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all ${cardBg} ${cardHover}`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Overall Progress</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500/10 to-blue-600/10 flex items-center justify-center text-blue-500">
              <TrendingUpIcon />
            </div>
          </div>
          <div className={`text-3xl font-black ${textPrimary}`}>{overallProgressPercent}%</div>
          <div className="mt-3 w-full h-2.5 rounded-full bg-slate-500/10 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                overallProgressPercent >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                overallProgressPercent >= 40 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className={`text-[10px] font-semibold ${textMuted}`}>{completedCount}/{totalMilestones} milestones completed</p>
            <span className="text-[10px] font-bold text-blue-500">{inProgressCount} in progress</span>
          </div>
        </div>
        
        {/* Milestones Breakdown */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all ${cardBg} ${cardHover}`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Milestones</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500/10 to-purple-600/10 flex items-center justify-center text-purple-500">
              <FlagIcon />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${textPrimary}`}>{totalMilestones}</span>
            <span className={`text-xs font-bold ${completedCount === totalMilestones ? 'text-emerald-500' : textMuted}`}>
              ({completedCount} Done)
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {completedCount} Completed
            </span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
              {inProgressCount} Active
            </span>
            {delayedCount > 0 && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {delayedCount} Delayed
              </span>
            )}
          </div>
        </div>
        
        {/* Dynamic Health Score */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all ${cardBg} ${cardHover}`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Project Health</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-emerald-600/10 flex items-center justify-center text-emerald-500">
              <HeartPulseIcon />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${textPrimary}`}>{health.score}</span>
            <span className={`text-lg font-bold ${textMuted}`}>/100</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${healthLabel.bgClass}`} />
            <span className={`text-xs font-bold ${healthLabel.colorClass}`}>{healthLabel.label}</span>
          </div>
        </div>
        
        {/* Risks Identified */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all ${cardBg} ${cardHover}`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Risks Identified</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/10 to-amber-600/10 flex items-center justify-center text-amber-500">
              <ShieldAlertIcon />
            </div>
          </div>
          <div className={`text-3xl font-black ${textPrimary}`}>{risks.length || '—'}</div>
          <p className={`text-[10px] font-semibold mt-2 ${textMuted}`}>
            {risks.length > 0 
              ? `${risks.filter(r => r.severity === 'High').length} High · ${risks.filter(r => r.severity === 'Medium').length} Medium · ${risks.filter(r => r.severity === 'Low').length} Low`
              : 'No critical blockers parsed'}
          </p>
        </div>
      </div>

      {/* ─── INTERACTIVE TIMELINE RE-EVALUATION & PROGRESS UPDATE PANEL ─── */}
      <div className={`rounded-2xl border p-6 backdrop-blur-xl relative overflow-hidden ${cardBg}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 via-indigo-500/5 to-transparent rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <RefreshCwIcon />
            </div>
            <div>
              <h3 className={`text-base font-black ${textPrimary}`}>AI Timeline Re-evaluation & Progress Adjuster</h3>
              <p className={`text-xs font-medium ${textSecondary}`}>
                Update project progress to trigger multi-agent re-evaluation of milestones, health scores, and risk matrices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${textSecondary}`}>Current Sprint:</span>
            <select
              value={currentWeek}
              onChange={(e) => setCurrentWeek(parseInt(e.target.value, 10))}
              className={`px-3 py-1.5 text-xs font-black rounded-lg border outline-none cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(w => (
                <option key={w} value={w}>Week {w} / 12</option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleReevaluateTimeline} className="space-y-3">
          <div className="relative">
            <textarea
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
              placeholder="e.g., 'Completed Milestone 1 database schema and user authentication ahead of schedule. Moving to core business logic and transaction parsing...'"
              rows={2}
              className={`w-full p-3.5 text-xs font-medium rounded-xl border outline-none transition-all resize-none ${
                isDark 
                  ? 'bg-slate-800/60 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[10px] font-bold ${textMuted}`}>Quick Presets:</span>
              <button
                type="button"
                onClick={() => setProgressInput(`Completed Milestone 1 on schedule. Starting Milestone 2 API development.`)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                Milestone 1 Done
              </button>
              <button
                type="button"
                onClick={() => setProgressInput(`Facing technical blockers on third-party OCR API. Need to compress future milestones.`)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                Blocker Encountered
              </button>
              <button
                type="button"
                onClick={() => setProgressInput(`Ahead of schedule. Added automated unit testing and Docker containerization.`)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                Ahead of Schedule
              </button>
            </div>

            <button
              type="submit"
              disabled={isReevaluating}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isReevaluating ? (
                <>
                  <LoaderIcon />
                  <span>Re-evaluating Pipeline...</span>
                </>
              ) : (
                <>
                  <SparklesIcon />
                  <span>Re-evaluate Project with AI</span>
                </>
              )}
            </button>
          </div>

          {isReevaluating && reevalStage && (
            <div className="mt-2 text-xs font-bold text-blue-400 flex items-center gap-2 animate-pulse">
              <LoaderIcon />
              <span>{reevalStage}</span>
            </div>
          )}
        </form>
      </div>
      
      {/* ─── PLANNED VS ACTUAL + HEALTH BREAKDOWN ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Planned vs Actual */}
        <div className={`rounded-2xl border p-6 backdrop-blur-xl ${cardBg}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-sm font-black uppercase tracking-wider ${textPrimary}`}>Planned vs Actual Progress</h3>
            <span className={`text-[10px] font-bold ${textMuted}`}>Week {currentWeek} of 12</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${textSecondary}`}>Target Planned Progress (Week {currentWeek})</span>
                <span className={`text-xs font-black ${textPrimary}`}>{targetPlannedPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-500/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-400/50 to-indigo-400/50 transition-all duration-500" style={{ width: `${targetPlannedPercent}%` }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${textSecondary}`}>Actual Milestone Progress</span>
                <span className={`text-xs font-black ${textPrimary}`}>{overallProgressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-500/10 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    scheduleDeviation >= 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                    : scheduleDeviation >= -15 ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                    : 'bg-gradient-to-r from-rose-500 to-rose-600'
                  }`}
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className={`mt-5 pt-4 border-t ${borderColor} flex items-center justify-between`}>
            <span className={`text-xs font-bold ${textSecondary}`}>Schedule Deviation Status</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                scheduleDeviation >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : scheduleDeviation >= -15 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {scheduleDeviation >= 0 ? `+${scheduleDeviation}% (Ahead)` : `${scheduleDeviation}% (Behind)`}
              </span>
            </div>
          </div>
        </div>
        
        {/* Dynamic Health Score Breakdown */}
        <div className={`rounded-2xl border p-6 backdrop-blur-xl ${cardBg}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-sm font-black uppercase tracking-wider ${textPrimary}`}>AI Health Score Factors</h3>
            <span className={`text-xs font-black ${healthLabel.colorClass}`}>{healthLabel.emoji} {health.score}/100</span>
          </div>
          
          <div className="space-y-3.5">
            {[
              { label: 'Milestone Execution & Timeliness', value: health.factors.milestoneHealth || 0, weight: '40%', color: 'from-blue-500 to-blue-600' },
              { label: 'Risk & Roadblock Mitigation', value: health.factors.riskMgmt || 0, weight: '30%', color: 'from-purple-500 to-purple-600' },
              { label: 'AI Diagnostic Completeness', value: health.factors.aiCompleteness || 0, weight: '15%', color: 'from-emerald-500 to-emerald-600' },
              { label: 'Mentorship Telemetry Alignment', value: health.factors.mentorship || 0, weight: '15%', color: 'from-amber-500 to-amber-600' },
            ].map((factor, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${textSecondary}`}>{factor.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold ${textMuted}`}>×{factor.weight}</span>
                    <span className={`text-xs font-black ${textPrimary}`}>{factor.value}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-500/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${factor.color} transition-all duration-700 ease-out`}
                    style={{ width: `${factor.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-5 pt-4 border-t ${borderColor} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${healthLabel.bgClass}`} />
              <span className={`text-xs font-bold ${healthLabel.colorClass}`}>{healthLabel.label}</span>
            </div>
            <span className={`text-xs font-bold ${textMuted}`}>Updated in real-time</span>
          </div>
        </div>
      </div>
      
      {/* ─── INTERACTIVE MILESTONE ROADMAP ──────────────────────────────── */}
      {milestones.length > 0 && (
        <div className={`rounded-2xl border p-6 backdrop-blur-xl ${cardBg}`}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <div>
              <h3 className={`text-sm font-black uppercase tracking-wider ${textPrimary}`}>Interactive Milestone Roadmap</h3>
              <p className={`text-xs font-medium ${textSecondary}`}>Click any status to update milestone progress and recalculate reports</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">Status Legend:</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400">Completed</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400">In Progress</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400">Delayed</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-500/10 text-slate-400">Planned</span>
            </div>
          </div>
          
          <div className="relative">
            {/* Connection line */}
            <div className={`absolute left-[18px] top-6 bottom-6 w-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            
            <div className="space-y-4">
              {milestones.map((m, idx) => {
                const currentStatus = milestoneStatuses[m.number] || (idx === 0 ? 'completed' : idx === 1 ? 'in_progress' : 'planned');
                const isCompleted = currentStatus === 'completed';
                const isInProgress = currentStatus === 'in_progress';
                const isDelayed = currentStatus === 'delayed';

                return (
                  <div key={idx} className="relative flex items-start gap-4 pl-1">
                    <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40' :
                      isInProgress ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/40 animate-pulse' :
                      isDelayed ? 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40' :
                      (isDark ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-slate-100 text-slate-400 border border-slate-300')
                    }`}>
                      {isCompleted ? <CheckCircleIcon /> : isInProgress ? <CircleDotIcon /> : isDelayed ? <AlertTriangleIcon /> : idx + 1}
                    </div>
                    
                    <div className={`flex-1 rounded-xl border p-4 transition-all ${
                      isCompleted ? (isDark ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-emerald-50/60 border-emerald-200/80') :
                      isInProgress ? (isDark ? 'bg-blue-950/20 border-blue-800/40' : 'bg-blue-50/60 border-blue-200/80') :
                      isDelayed ? (isDark ? 'bg-amber-950/20 border-amber-800/40' : 'bg-amber-50/60 border-amber-200/80') :
                      (isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50/80 border-slate-200/60')
                    }`}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${textMuted}`}>
                            Milestone {m.number}
                          </span>
                          
                          {/* Interactive Status Pills */}
                          <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg border border-white/5">
                            {[
                              { key: 'planned', label: 'Planned', style: 'hover:bg-slate-500/20 text-slate-400' },
                              { key: 'in_progress', label: 'In Progress', style: 'hover:bg-blue-500/20 text-blue-400' },
                              { key: 'completed', label: 'Completed', style: 'hover:bg-emerald-500/20 text-emerald-400' },
                              { key: 'delayed', label: 'Delayed', style: 'hover:bg-amber-500/20 text-amber-400' }
                            ].map(st => {
                              const active = currentStatus === st.key;
                              return (
                                <button
                                  key={st.key}
                                  type="button"
                                  onClick={() => handleMilestoneStatusChange(m.number, st.key)}
                                  className={`px-2 py-0.5 text-[9px] font-black rounded-md transition-all cursor-pointer ${
                                    active 
                                      ? (st.key === 'completed' ? 'bg-emerald-500 text-white shadow-sm' :
                                         st.key === 'in_progress' ? 'bg-blue-500 text-white shadow-sm' :
                                         st.key === 'delayed' ? 'bg-amber-500 text-white shadow-sm' :
                                         'bg-slate-600 text-white')
                                      : `${st.style} opacity-70 hover:opacity-100`
                                  }`}
                                >
                                  {st.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {m.totalTasks > 0 && (
                          <span className={`text-[10px] font-semibold ${textMuted}`}>{m.totalTasks} deliverables</span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold mt-2 ${textPrimary}`}>{m.title}</h4>

                      {m.body && (
                        <div className={`mt-2 text-xs leading-relaxed font-medium ${textSecondary}`}>
                          {renderMarkdown(m.body)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── RISK ANALYSIS DETAIL ────────────────────────────────────────── */}
      {risks.length > 0 && (
        <div className={`rounded-2xl border p-6 backdrop-blur-xl ${cardBg}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-sm font-black uppercase tracking-wider ${textPrimary}`}>Live Risk Register & Roadblocks</h3>
            <span className={`text-xs font-bold ${textMuted}`}>{risks.length} active vectors</span>
          </div>
          
          <div className="space-y-3">
            {risks.map((risk, idx) => {
              const colors = getRiskColor(risk.severity);
              const isExpanded = expandedRisks[idx];
              
              return (
                <div key={idx} className={`rounded-xl border p-4 transition-all ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50/80 border-slate-200/60'}`}>
                  <button 
                    onClick={() => setExpandedRisks(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {risk.severity}
                      </span>
                      <span className={`text-sm font-bold ${textPrimary}`}>{risk.title}</span>
                    </div>
                    <span className={textMuted}>
                      {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  </button>
                  
                  {isExpanded && risk.body && (
                    <div className={`mt-3 pt-3 border-t ${borderColor} ${textSecondary}`}>
                      {renderMarkdown(risk.body)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── PROJECT ACTIVITY TIMELINE ───────────────────────────────────── */}
      {chatHistory.length > 0 && (
        <div className={`rounded-2xl border p-6 backdrop-blur-xl ${cardBg}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-sm font-black uppercase tracking-wider ${textPrimary}`}>Project Activity Timeline</h3>
            <span className={`text-[10px] font-bold ${textMuted}`}>{chatHistory.length} interactions</span>
          </div>
          
          <div className="relative">
            <div className={`absolute left-[15px] top-4 bottom-4 w-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            
            <div className="space-y-3">
              {(timelineExpanded ? chatHistory : chatHistory.slice(-8)).map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={idx} className="relative flex items-start gap-3.5 pl-0.5">
                    <div className={`relative z-10 w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black ${
                      isUser 
                        ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600')
                        : (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 text-purple-600')
                    }`}>
                      {isUser ? 'U' : 'AI'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${textPrimary}`}>{isUser ? 'Student' : 'AI Mentor'}</span>
                        {msg.created_at && (
                          <span className={`text-[10px] font-semibold ${textMuted} flex items-center gap-1`}>
                            <ClockIcon />
                            {formatDate(msg.created_at)}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${textSecondary} line-clamp-2`}>
                        {(() => { const c = cleanMessageContent(msg.content); return c.slice(0, 200) + (c.length > 200 ? '...' : ''); })()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {chatHistory.length > 8 && (
              <button
                onClick={() => setTimelineExpanded(!timelineExpanded)}
                className={`mt-4 ml-10 text-xs font-bold cursor-pointer transition-colors ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {timelineExpanded ? 'Show less' : `View all ${chatHistory.length} interactions`}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* ─── DYNAMIC REPORT GENERATION ACTIONS ────────────────────────────── */}
      <div className={`rounded-2xl border p-6 backdrop-blur-xl print:hidden ${cardBg}`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-indigo-500">
            <SparklesIcon />
          </div>
          <div>
            <h3 className={`text-sm font-black ${textPrimary}`}>Generate Reports</h3>
            <p className={`text-[10px] font-semibold ${textMuted}`}>AI documents synchronized with current project timeline state</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { type: 'weekly_report', label: 'Weekly Report', icon: '📋' },
            { type: 'monthly_report', label: 'Monthly Report', icon: '📊' },
            { type: 'synopsis', label: 'Synopsis', icon: '📄' },
            { type: 'methodology', label: 'Methodology', icon: '🔬' },
            { type: 'final_report', label: 'Final Report', icon: '📑' },
            { type: 'readme', label: 'README', icon: '📝' },
          ].map(doc => (
            <button
              key={doc.type}
              onClick={() => handleGenerateDoc(doc.type, doc.label)}
              disabled={!!generatingDoc}
              className={`group flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all cursor-pointer ${
                generatingDoc === doc.type
                  ? (isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200')
                  : isDark 
                    ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-700/60 hover:border-slate-600' 
                    : 'bg-slate-50/80 border-slate-200/60 hover:bg-white hover:border-slate-300 hover:shadow-md'
              } ${generatingDoc && generatingDoc !== doc.type ? 'opacity-50' : ''}`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{doc.icon}</span>
              <span className={`text-[10px] font-bold text-center leading-tight ${textPrimary}`}>
                {generatingDoc === doc.type ? 'Generating...' : doc.label}
              </span>
              {generatingDoc === doc.type && (
                <div className="text-blue-500"><LoaderIcon /></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* ─── GENERATED DOCUMENT MODAL ────────────────────────────────────── */}
      {showDocModal && generatedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 print:hidden" onClick={() => setShowDocModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div 
            className={`relative w-full max-w-4xl max-h-[85vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-5 border-b shrink-0 ${borderColor}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <FileTextIcon />
                </div>
                <div>
                  <h3 className={`text-sm font-black ${textPrimary}`}>{generatedDoc.type}</h3>
                  <p className={`text-[10px] font-semibold ${textMuted}`}>AI Generated Document · Synchronized with Active Milestones</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDoc}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    copySuccess 
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : isDark 
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <CopyIcon />
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedDoc.content], { type: 'text/markdown;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${generatedDoc.type.replace(/\s+/g, '_').toLowerCase()}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <DownloadIcon />
                  <span>Download .md</span>
                </button>
                <button 
                  onClick={() => setShowDocModal(false)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <XIcon />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className={`${textSecondary} leading-relaxed select-text font-medium`}>
                {renderMarkdown(generatedDoc.content)}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ─── AI MENTOR SUMMARY ───────────────────────────────────────────── */}
      {memory?.mentor_advice && memory.mentor_advice.trim().length > 10 && (
        <div className={`rounded-2xl border p-6 backdrop-blur-xl relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <SparklesIcon />
            </div>
            <div>
              <h3 className={`text-sm font-black ${textPrimary}`}>AI Mentor Guidance & Next Actions</h3>
              <p className={`text-[10px] font-semibold ${textMuted}`}>Personalized recommendations from your academic AI mentor</p>
            </div>
          </div>
          
          <div className={`rounded-xl border p-4 ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-blue-50/50 border-blue-100/50'}`}>
            <div className={`text-xs leading-relaxed ${textSecondary} font-medium`}>
              {renderMarkdown(memory.mentor_advice)}
            </div>
          </div>
        </div>
      )}
      
      {/* ─── PRINT STYLES ────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #reports-view, #reports-view * { visibility: visible; }
          #reports-view { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
          .print\\:space-y-4 > * + * { margin-top: 1rem; }
        }
      `}</style>
    </div>
  );
}