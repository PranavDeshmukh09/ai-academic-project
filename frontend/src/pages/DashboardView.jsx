import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

// --- Premium Vector SVG Icons ---
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const RocketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.56 1.63-2.5l5.87-5.87A7 7 0 0 0 21 3s-3.5 0-6.13 6l-5.87 5.87c-.94.37-1.79.92-2.5 1.63z" />
    <circle cx="15" cy="9" r="1" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const SlidersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
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

const PencilIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 1 1.71 3h16.94a2 2 0 0 1 1.71-3L13.71 3.86a2 2 0 0 1-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FolderPlusIcon = () => (
  <svg className="w-8 h-8 text-[#0252CD]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function DashboardView({ userProfile, onNavigate, onProjectsChange, currentTheme = 'pastel' }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isDark = currentTheme === 'dark';

  // Modals state
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editError, setEditError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const quickLinks = [
    { id: 'profile', title: 'Profile Setup', icon: <UserIcon />, desc: 'Manage personal credentials', bgGradient: 'from-sky-500 to-blue-600' },
    { id: 'skills', title: 'Skill Assessment', icon: <FileTextIcon />, desc: 'Audit competency matrix', bgGradient: 'from-indigo-500 to-purple-600' },
    { id: 'project', title: 'Submit Project', icon: <RocketIcon />, desc: 'Propose new capstone scope', bgGradient: 'from-[#0252CD] to-sky-600' },
    { id: 'chat', title: 'Mentor Chat', icon: <MessageSquareIcon />, desc: 'Multi-agent advisory node', bgGradient: 'from-pink-500 to-rose-600' },
    { id: 'reports', title: 'View Reports', icon: <BarChartIcon />, desc: 'Visual progress metrics', bgGradient: 'from-purple-500 to-pink-500' },
    { id: 'settings', title: 'Settings', icon: <SlidersIcon />, desc: 'System API preferences', bgGradient: 'from-slate-700 to-slate-900' },
  ];

  const fetchProjects = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/projects/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setProjects([]);
        return;
      }

      setProjects(data || []);
    } catch (err) {
      console.warn('Fetch error:', err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project) => {
    setEditingProject(project);
    setEditTitle(project.title);
    setEditDescription(project.description);
    setEditDomain(project.domain);
    setEditError('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError('Project title cannot be empty.');
      return;
    }
    if (editTitle.trim().length < 3) {
      setEditError('Project title must be at least 3 characters.');
      return;
    }
    if (!editDescription.trim()) {
      setEditError('Project description cannot be empty.');
      return;
    }
    if (editDescription.trim().length < 10) {
      setEditError('Project description must be at least 10 characters.');
      return;
    }
    if (!editDomain.trim()) {
      setEditError('Project domain cannot be empty.');
      return;
    }

    setSubmitting(true);
    setEditError('');
    try {
      await apiService.updateProject(editingProject.project_id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        domain: editDomain.trim(),
        technologies: []
      });
      setEditingProject(null);
      fetchProjects();
      if (onProjectsChange) onProjectsChange();
    } catch (err) {
      setEditError(err.response?.data?.detail || err.message || 'Failed to update project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (project) => {
    setDeletingProject(project);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    setSubmitting(true);
    setDeleteError('');
    try {
      await apiService.deleteProject(deletingProject.project_id);
      setDeletingProject(null);
      fetchProjects();
      if (onProjectsChange) onProjectsChange();
    } catch (err) {
      setDeleteError(err.response?.data?.detail || err.message || 'Failed to delete project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative animate-fadeIn pb-12">

      {/* MESH GRADIENT HERO BANNER HARMONIZED WITH PASTEL MESH */}
      <div className="bg-gradient-to-r from-sky-600 via-[#0252CD] to-indigo-700 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-sky-500/20 relative overflow-hidden">
        {/* Glowing Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-300/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-sky-100 border border-white/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Multi-Agent Academic Telemetry Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Welcome back, {userProfile?.fullName?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-sm text-sky-100/90 font-medium leading-relaxed">
              Your Capstone Multi-Agent Advisory Workspace is fully synchronized. Explore active engineering projects or run an updated skill diagnostic assessment below.
            </p>
          </div>

          {/* Quick Action Hero Button */}
          <button
            onClick={() => onNavigate && onNavigate('project')}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#0252CD] font-black rounded-2xl text-xs shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer shrink-0 flex items-center space-x-2 group"
          >
            <RocketIcon />
            <span>+ Submit New Project</span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS HARMONIZED GLASS CARDS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Quick Actions</h2>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Instant navigation controls across system modules.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate && onNavigate(link.id)}
              className={`flex items-start space-x-4 p-5 backdrop-blur-xl border rounded-3xl transition-all duration-300 text-left cursor-pointer group relative overflow-hidden ${isDark
                  ? 'bg-slate-900/80 border-slate-800 text-slate-100 shadow-lg shadow-black/30 hover:border-sky-500/50 hover:bg-slate-800/80'
                  : 'bg-white/75 border-white/80 text-slate-900 shadow-md shadow-sky-950/5 hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-300/60 hover:-translate-y-1'
                }`}
            >
              {/* Subtle top accent bar on hover */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${link.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              {/* Gradient Icon Badge */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${link.bgGradient} text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/15 transition-transform group-hover:scale-110 duration-300`}>
                {link.icon}
              </div>

              <div className="space-y-1">
                <h3 className={`font-bold text-sm transition-colors ${isDark ? 'text-white group-hover:text-sky-400' : 'text-slate-900 group-hover:text-[#0252CD]'}`}>{link.title}</h3>
                <p className={`text-xs font-medium leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{link.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 bg-rose-50/90 backdrop-blur-md border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center space-x-2.5 shadow-sm">
          <AlertTriangleIcon />
          <span>{error}</span>
        </div>
      )}

      {/* ACTIVE PROJECTS HARMONIZED GLASS LIST */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Active Capstone Projects ({projects.length})</h2>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Projects evaluated by the AI Mentor multi-agent graph.</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('project')}
            className={`text-xs font-bold hover:underline cursor-pointer flex items-center space-x-1 group ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-[#0252CD] hover:text-[#013CA7]'}`}
          >
            <span>View All Proposals</span>
            <ArrowRightIcon />
          </button>
        </div>

        <div className={`backdrop-blur-xl border rounded-3xl overflow-hidden ${isDark
            ? 'bg-slate-900/80 border-slate-800 shadow-lg shadow-black/30'
            : 'bg-white/75 border-white/80 shadow-md shadow-sky-950/5'
          }`}>
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-slate-400 flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0252CD] rounded-full animate-spin"></div>
              <span>Fetching capstone project records...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-14 text-center flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-sky-50/80 border-sky-100'}`}>
                <FolderPlusIcon />
              </div>
              <div className="space-y-1">
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>No active projects found</h3>
                <p className={`text-xs max-w-sm mx-auto font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>You haven't submitted any capstone project proposals yet.</p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('project')}
                className="px-6 py-3 bg-gradient-to-r from-[#0252CD] to-indigo-600 text-white font-bold rounded-2xl text-xs hover:shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer shadow-sm"
              >
                + Submit Project Proposal
              </button>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100/80'}`}>
              {projects.map(project => (
                <div key={project.project_id} className={`p-6 transition-colors group relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'hover:bg-slate-800/60' : 'hover:bg-white/60'}`}>

                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider border ${isDark ? 'bg-slate-800 text-sky-300 border-slate-700' : 'bg-sky-100/80 text-sky-800 border-sky-200/80'}`}>
                        {project.domain || 'Software Engineering'}
                      </span>
                      <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>ID: #{project.project_id}</span>
                    </div>
                    <h3 className={`font-black text-base transition-colors ${isDark ? 'text-white group-hover:text-sky-400' : 'text-slate-900 group-hover:text-[#0252CD]'}`}>{project.title}</h3>
                    <p className={`text-xs font-medium leading-relaxed line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{project.description}</p>
                  </div>

                  <div className="flex items-center space-x-2.5 shrink-0 self-end md:self-center">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center space-x-1 ${isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{project.status || 'Active'}</span>
                    </span>
                    <button
                      onClick={() => handleEditClick(project)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1 border ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100/80 hover:bg-white text-slate-700 border-slate-200/60'}`}
                    >
                      <PencilIcon />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1 border ${isDark ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100'}`}
                    >
                      <TrashIcon />
                      <span>Delete</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL OVERLAY */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl w-full max-w-lg shadow-2xl border p-8 space-y-6 animate-fadeIn ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Project Details</h3>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Modify your project proposal parameters.</p>
            </div>

            {editError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center space-x-2">
                <AlertTriangleIcon />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className={`block text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Project Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0252CD] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`block text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Domain Focus</label>
                <select
                  required
                  value={editDomain}
                  onChange={(e) => setEditDomain(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                >
                  <option value="Healthcare AI">Healthcare AI</option>
                  <option value="Environmental AI">Environmental AI</option>
                  <option value="FinTech">FinTech</option>
                  <option value="LegalTech">LegalTech</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className={`block text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Project Description</label>
                <textarea
                  required
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-xs font-medium focus:outline-none resize-none leading-relaxed ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>

              <div className={`flex justify-end space-x-2.5 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className={`px-4 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0252CD] to-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL OVERLAY */}
      {deletingProject && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl w-full max-w-sm shadow-2xl border p-8 space-y-6 animate-fadeIn ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
                <AlertTriangleIcon />
              </div>
              <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Delete Project?</h3>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Are you sure you want to delete <strong>"{deletingProject.title}"</strong>? This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1.5">
                <AlertTriangleIcon />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex justify-center space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                className={`px-4 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {submitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}