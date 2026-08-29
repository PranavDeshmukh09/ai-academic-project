import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const FileTextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// --- The 8 Document Categories Requested ---
const DOCUMENT_TYPES = [
  { id: 'all', label: 'All Documents' },
  { id: 'proposal', label: '📄 Project Proposal' },
  { id: 'srs', label: '📋 SRS' },
  { id: 'design', label: '📐 Design Documents' },
  { id: 'repo', label: '💻 Source-Code Repo' },
  { id: 'presentation', label: '📊 Presentations' },
  { id: 'progress_report', label: '📈 Progress Reports' },
  { id: 'final_report', label: '📜 Final Report' },
  { id: 'uploaded', label: '📎 Uploaded Documents' },
];

// Status Lifecycle Flow: Submitted -> Under Review -> Approved -> Revision Required
const STATUS_OPTIONS = [
  { id: 'Submitted', label: 'Submitted', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { id: 'Under Review', label: 'Under Review', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'Approved', label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'Revision Required', label: 'Revision Required', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
];

export default function FacultyDocumentsView({ currentTheme = 'pastel', onSelectProject }) {
  const [data, setData] = useState({ total_projects: 0, projects: [] });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');

  // Active Document for Inspection Modal
  const [inspectingDoc, setInspectingDoc] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Documents Store (supports live status overrides)
  const [documentsStore, setDocumentsStore] = useState(() => {
    const saved = localStorage.getItem('academic_documents_store');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null; // Will generate based on fetched projects
  });

  const isDark = currentTheme === 'dark';

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFacultyDashboard();
      if (res && res.projects) {
        setData(res);
      }
    } catch (e) {
      console.error("Error fetching documents data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Build the complete 8-document suite for each student project
  const allDocuments = useMemo(() => {
    if (!data.projects || data.projects.length === 0) return [];

    const docs = [];

    data.projects.forEach((p) => {
      const pId = p.project_id || p.student_id;
      const sName = p.name;
      const pTitle = p.project_title || 'Capstone Project';

      // 1. Project Proposal
      docs.push({
        id: `doc_${pId}_proposal`,
        projectId: pId,
        studentName: sName,
        projectTitle: pTitle,
        type: 'proposal',
        typeName: 'Project Proposal',
        title: `${pTitle} — Formal Synopsis & Problem Statement`,
        format: 'PDF / Markdown',
        size: '1.8 MB',
        uploadedAt: 'Aug 04, 2026',
        defaultStatus: 'Approved',
        reviewerNotes: 'Problem statement and scope approved by faculty committee.',
        content: p.project_plan || `# Project Proposal: ${pTitle}\n\n## Abstract\nThis project formulates an end-to-end intelligent orchestration system for capstone telemetry and guidance.\n\n## Scope & Feasibility\nArchitected with modern microservices, LangGraph multi-agent workflows, and relational state persistence.`
      });

      // 2. SRS Document
      docs.push({
        id: `doc_${pId}_srs`,
        projectId: pId,
        studentName: sName,
        projectTitle: pTitle,
        type: 'srs',
        typeName: 'SRS',
        title: `Software Requirements Specification (SRS) v1.4`,
        format: 'PDF / DOCX',
        size: '3.4 MB',
        uploadedAt: 'Aug 12, 2026',
        defaultStatus: 'Approved',
        reviewerNotes: 'Complete functional and non-functional requirements matrix verified.',
        content: `# Software Requirements Specification (SRS)\n\n## 1. Functional Requirements\n- Real-time agentic execution\n- Asynchronous event bus\n- OAuth 2.0 PKCE authentication\n\n## 2. Non-Functional Requirements\n- API response time < 200ms\n- 99.9% database availability with connection pooling.`
      });

      // 3. Design Documents
      docs.push({
        id: `doc_${pId}_design`,
        projectId: pId,
        studentName: sName,
        projectTitle: pTitle,
        type: 'design',
        typeName: 'Design Documents',
        title: `System Architecture, DB Schema & Wireframes Deck`,
        format: 'Figma / Mermaid / PDF',
        size: '5.2 MB',
        uploadedAt: 'Aug 20, 2026',
        defaultStatus: 'Approved',
        reviewerNotes: 'PostgreSQL schema and multi-agent DAG diagrams verified.',
        content: p.tech_stack || `# System Architecture & Schema Design\n\n- Backend: FastAPI, Python 3.11, asyncpg\n- Database: PostgreSQL & Pinecone Vector Store\n- Frontend: React 18, TailwindCSS, Vite\n- Multi-Agent Orchestrator: LangGraph StateGraph`
      });

      // 4. Source-Code Repository Link
      docs.push({
        id: `doc_${pId}_repo`,
        projectId: pId,
        studentName: sName,
        projectTitle: pTitle,
        type: 'repo',
        typeName: 'Source-Code Repo',
        title: `GitHub Repository: ${sName.toLowerCase().replace(/\s+/g, '-')}/${pTitle.toLowerCase().slice(0, 18).replace(/\s+/g, '-')}`,
        format: 'Git Repository',
        size: '142 Commits • main',
        uploadedAt: 'Updated 2h ago',
        defaultStatus: 'Approved',
        externalUrl: 'https://github.com/PranavDeshmukh09/ai-academic-project',
        reviewerNotes: 'Continuous integration workflow passing. Code linted and documented.',
        content: `# Git Repository Telemetry\n\n- Primary Branch: main\n- Active Feature Branch: feature/faculty-portal\n- Total Commits: 142\n- License: MIT Academic`
      });

      // 5. Presentations
      docs.push({
        id: `doc_${pId}_presentation`,
        projectId: pId,
        studentName: sName,
        projectTitle: pTitle,
        type: 'presentation',
        typeName: 'Presentations',
        title: `Midterm Progress Defense Slide Deck (16:9)`,
        format: 'PPTX / Google Slides',
        size: '8.7 MB',
        uploadedAt: 'Aug 22, 2026',
        defaultStatus: 'Under Review',
        externalUrl: 'https://docs.google.com/presentation',
        reviewerNotes: 'Includes system demo recording and live latency benchmarks.',
        content: `# Midterm Presentation Deck Outline\n\n1. Executive Summary & Problem Formulation\n2. System Architecture & Multi-Agent Design\n3. Midterm Deliverable Milestones\n4. Live Demonstration & Benchmark Telemetry\n5. Next Steps for Final Defense`
      });

      // 6. Progress Reports
      docs.push({
        id: `doc_${pId}_progress_report`,
        projectId: pId,
        studentName: sName,
        projectTitle: pTitle,
        type: 'progress_report',
        typeName: 'Progress Reports',
        title: `Sprint 3 Milestone Audit & Check-in Report`,
        format: 'PDF / Markdown',
        size: '1.2 MB',
        uploadedAt: 'Aug 24, 2026',
        defaultStatus: 'Under Review',
        reviewerNotes: 'Sprint velocity shows 65% completion. Latency bottlenecks noted.',
        content: p.check_in_report || `# Sprint Progress Audit Report\n\n- Completed deliverables: Core schema, JWT Auth, Multi-agent tools\n- Blockers: Edge inference connection pool timeouts\n- Mitigations: Implementing connection recycling in asyncpg`
      });

      // 7. Final Report / Thesis
      docs.push({
        id: `doc_${pId}_final_report`,
        projectId: pId,
        studentName: sName,
        projectTitle: pTitle,
        type: 'final_report',
        typeName: 'Final Report',
        title: `Capstone Comprehensive Thesis & Technical Report (Draft v0.9)`,
        format: 'PDF / LaTeX',
        size: '12.4 MB',
        uploadedAt: 'Aug 25, 2026',
        defaultStatus: 'Revision Required',
        reviewerNotes: 'Add section on comparative model inference benchmarks before final sign-off.',
        content: p.final_documentation || `# Comprehensive Capstone Thesis Report (Draft)\n\n## Chapter 1: Introduction\n## Chapter 2: Literature Review & Benchmarks\n## Chapter 3: Proposed Architecture\n## Chapter 4: Implementation Details\n## Chapter 5: Experimental Evaluation\n## Chapter 6: Conclusion & Future Scope`
      });

      // 8. Uploaded Documents
      docs.push({
        id: `doc_${pId}_uploaded`,
        projectId: pId,
        studentName: sName,
        projectTitle: pTitle,
        type: 'uploaded',
        typeName: 'Uploaded Documents',
        title: `Evaluation Dataset & Benchmark Test Harnesses (.zip)`,
        format: 'ZIP / CSV',
        size: '24.6 MB',
        uploadedAt: 'Aug 26, 2026',
        defaultStatus: 'Submitted',
        reviewerNotes: 'Supplementary test dataset for validating edge inference.',
        content: `# Uploaded Attachments Index\n\n- test_dataset_v2.csv (14,200 rows)\n- benchmark_eval_script.py\n- ethical_compliance_certificate.pdf`
      });
    });

    return docs;
  }, [data.projects]);

  // Apply Local Status Overrides
  const documentsWithStatus = useMemo(() => {
    return allDocuments.map(doc => {
      const saved = documentsStore ? documentsStore[doc.id] : null;
      return {
        ...doc,
        status: saved?.status || doc.defaultStatus,
        reviewerNotes: saved?.reviewerNotes !== undefined ? saved?.reviewerNotes : doc.reviewerNotes
      };
    });
  }, [allDocuments, documentsStore]);

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documentsWithStatus.filter(doc => {
      // Type filter
      if (selectedType !== 'all' && doc.type !== selectedType) return false;

      // Status filter
      if (selectedStatus !== 'all' && doc.status !== selectedStatus) return false;

      // Team filter
      if (selectedTeamFilter !== 'all' && String(doc.projectId) !== String(selectedTeamFilter)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = doc.title.toLowerCase().includes(q);
        const nameMatch = doc.studentName.toLowerCase().includes(q);
        const typeMatch = doc.typeName.toLowerCase().includes(q);
        const projMatch = doc.projectTitle.toLowerCase().includes(q);
        if (!titleMatch && !nameMatch && !typeMatch && !projMatch) return false;
      }

      return true;
    });
  }, [documentsWithStatus, selectedType, selectedStatus, selectedTeamFilter, searchQuery]);

  // Status Metrics (Top KPIs)
  const kpis = useMemo(() => {
    const total = documentsWithStatus.length;
    const approved = documentsWithStatus.filter(d => d.status === 'Approved').length;
    const underReview = documentsWithStatus.filter(d => d.status === 'Under Review').length;
    const revision = documentsWithStatus.filter(d => d.status === 'Revision Required').length;
    const submitted = documentsWithStatus.filter(d => d.status === 'Submitted').length;

    return { total, approved, underReview, revision, submitted };
  }, [documentsWithStatus]);

  // Update Document Status (Submitted -> Under Review -> Approved -> Revision Required)
  const updateDocumentStatus = (docId, newStatus, newNotes) => {
    const updated = {
      ...(documentsStore || {}),
      [docId]: {
        status: newStatus,
        reviewerNotes: newNotes !== undefined ? newNotes : (documentsStore?.[docId]?.reviewerNotes || '')
      }
    };
    setDocumentsStore(updated);
    localStorage.setItem('academic_documents_store', JSON.stringify(updated));

    if (inspectingDoc && inspectingDoc.id === docId) {
      setInspectingDoc(prev => ({
        ...prev,
        status: newStatus,
        reviewerNotes: newNotes !== undefined ? newNotes : prev.reviewerNotes
      }));
    }
  };

  // Handle Inspection Modal Save
  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!inspectingDoc) return;

    updateDocumentStatus(inspectingDoc.id, inspectingDoc.status, reviewNote);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setInspectingDoc(null);
    }, 1500);
  };

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center space-y-3">
        <div className="w-9 h-9 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-400">Loading Academic Document Repositories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <FileTextIcon />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Academic Documents & Artifacts Repository
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                8 Document Types
              </span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Access proposals, SRS, architecture designs, source code repositories, presentation decks, progress audits, and final theses.
            </p>
          </div>
        </div>

        {/* Team Selector Filter */}
        <div className="space-y-1 self-start lg:self-auto shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filter by Student Pod</span>
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className={`py-2 px-3 border rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="all">All Enrolled Teams ({data.projects.length})</option>
            {data.projects.map((p) => (
              <option key={p.student_id} value={p.project_id || p.student_id}>
                {p.name} — {p.project_title ? p.project_title.slice(0, 28) + '...' : `Project #${p.project_id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (Lifecycle Status Flow: Submitted -> Under Review -> Approved -> Revision Required) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Documents</span>
            <FileTextIcon />
          </div>
          <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {kpis.total}
          </h3>
          <p className="text-[10px] font-bold text-slate-400">{kpis.submitted} New Submissions</p>
        </div>

        {/* Approved */}
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Approved / Signed</span>
            <CheckCircleIcon />
          </div>
          <h3 className="text-2xl font-black text-emerald-400">
            {kpis.approved}
          </h3>
          <p className="text-[10px] font-bold text-emerald-500/80">
            {Math.round((kpis.approved / (kpis.total || 1)) * 100)}% Verified & Signed Off
          </p>
        </div>

        {/* Under Review */}
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Under Review</span>
            <ClockIcon />
          </div>
          <h3 className="text-2xl font-black text-amber-400">
            {kpis.underReview}
          </h3>
          <p className="text-[10px] font-bold text-amber-500/80">Pending Faculty Evaluation</p>
        </div>

        {/* Revision Required */}
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Revision Required</span>
            <AlertTriangleIcon />
          </div>
          <h3 className="text-2xl font-black text-rose-400">
            {kpis.revision}
          </h3>
          <p className="text-[10px] font-bold text-rose-500/80">Feedback Dispatched to Student</p>
        </div>
      </div>

      {/* 3. Document Category Tabs (The 8 Types) */}
      <div className={`p-2 border rounded-2xl shadow-xs flex flex-wrap items-center gap-1.5 ${cardBg}`}>
        {DOCUMENT_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedType === type.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 4. Filter Toolbar & Search */}
      <div className={`p-4 border rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, student name, project..."
            className={`w-full pl-9 pr-3 py-2 text-xs font-medium border rounded-xl focus:outline-none transition-all ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-bold text-[10px] uppercase">Lifecycle Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`py-1.5 px-3 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Revision Required">Revision Required</option>
          </select>
        </div>
      </div>

      {/* 5. Documents Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => {
          const statusOpt = STATUS_OPTIONS.find(s => s.id === doc.status) || STATUS_OPTIONS[0];

          return (
            <div
              key={doc.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all shadow-xs ${cardBg}`}
            >
              <div className="space-y-3">
                {/* Header: Type Pill & Status Dropdown */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {doc.typeName}
                  </span>

                  {/* Inline Status Selector */}
                  <select
                    value={doc.status}
                    onChange={(e) => updateDocumentStatus(doc.id, e.target.value)}
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border focus:outline-none cursor-pointer transition-all ${statusOpt.color}`}
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Revision Required">Revision Required</option>
                  </select>
                </div>

                {/* Document Title */}
                <div className="space-y-1">
                  <h4 className={`text-sm font-black leading-snug ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {doc.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-400 truncate">
                    Pod: <strong className="text-slate-300">{doc.studentName}</strong> • {doc.projectTitle}
                  </p>
                </div>

                {/* Document Metadata Details */}
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                  isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Format: <strong className="text-slate-300">{doc.format}</strong></span>
                    <span>{doc.size}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Uploaded / Updated: {doc.uploadedAt}
                  </div>
                </div>

                {/* Reviewer Note Preview */}
                {doc.reviewerNotes && (
                  <p className="text-[11px] text-slate-400 italic bg-purple-500/5 border border-purple-500/10 p-2 rounded-lg leading-relaxed">
                    "{doc.reviewerNotes}"
                  </p>
                )}
              </div>

              {/* Action Buttons: Preview / Inspect & External Link */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setInspectingDoc(doc);
                    setReviewNote(doc.reviewerNotes || '');
                  }}
                  className="flex-1 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <EyeIcon />
                  <span>Inspect & Review</span>
                </button>

                {doc.externalUrl ? (
                  <a
                    href={doc.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl transition-all"
                    title="Open External Resource"
                  >
                    <ExternalLinkIcon />
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      const blob = new Blob([doc.content || ''], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_')}.md`;
                      a.click();
                    }}
                    className="p-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl transition-all cursor-pointer"
                    title="Download Document"
                  >
                    <DownloadIcon />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Document Inspection & Review Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-3xl border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-indigo-400">{inspectingDoc.typeName}</span>
                <h3 className="text-base font-black truncate max-w-xl">{inspectingDoc.title}</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Submitted by {inspectingDoc.studentName} • {inspectingDoc.projectTitle}
                </p>
              </div>

              <button
                onClick={() => setInspectingDoc(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Content Viewer */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Document Content & Telemetry</span>
              <div className={`p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                {inspectingDoc.content}
              </div>
            </div>

            {/* Faculty Review & Status Sign-Off Form */}
            <form onSubmit={handleSaveModal} className="space-y-3.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Status Selector */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    Lifecycle Review Status
                  </label>
                  <select
                    value={inspectingDoc.status}
                    onChange={(e) => setInspectingDoc({ ...inspectingDoc, status: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Revision Required">Revision Required</option>
                  </select>
                </div>

                {/* File Metadata */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">File Info</label>
                  <div className={`p-2.5 rounded-xl border text-[11px] font-semibold text-slate-400 ${
                    isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {inspectingDoc.format} • {inspectingDoc.size} • Uploaded {inspectingDoc.uploadedAt}
                  </div>
                </div>
              </div>

              {/* Reviewer Note */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Faculty Review Feedback & Revision Instructions
                </label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Provide comments, required revisions, or approval sign-off notes..."
                  rows="3"
                  className={`w-full p-3 border rounded-xl text-xs font-medium focus:outline-none transition-all ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-2">
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-400 animate-fadeIn">
                    ✓ Document review status saved!
                  </span>
                )}
                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setInspectingDoc(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Save & Sign-Off
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
