import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function ProjectDetailsView({ onCreateProject, onSelectProject, onProjectsChange, currentTheme = 'pastel' }) {
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

  const fetchProjects = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/projects/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        setProjects([]);
        return;
      }
      setProjects(data || []);
    } catch (err) {
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project, e) => {
    e.stopPropagation();
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

  const handleDeleteClick = (project, e) => {
    e.stopPropagation();
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Projects</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage and track your submitted capstone project proposals.</p>
        </div>
        <button
          onClick={onCreateProject}
          className="px-5 py-2.5 bg-[#0252CD] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center space-x-2"
        >
          <span>+</span>
          <span>New Project</span>
        </button>
      </div>

      {loading ? (
        <div className={`backdrop-blur-xl border rounded-2xl p-12 text-center shadow-md shadow-sky-950/5 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white/75 border-white/80 text-slate-500'}`}>
          <span className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin inline-block mr-2 align-middle"></span>
          Loading project files...
        </div>
      ) : error ? (
        <div className={`p-4 border rounded-2xl text-xs font-semibold text-center shadow-md shadow-sky-950/5 ${
          isDark ? 'bg-rose-950/40 border-rose-900 text-rose-450' : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          ⚠️ {error}
        </div>
      ) : projects.length === 0 ? (
        <div className={`backdrop-blur-xl border rounded-2xl p-16 text-center flex flex-col items-center shadow-md shadow-sky-950/5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/75 border-white/80'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 border shadow-inner ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            🚀
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No projects submitted</h3>
          <p className={`text-sm mt-1 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Submit your first project proposal to matching advisor algorithms and kickstart academic progress.
          </p>
          <button
            onClick={onCreateProject}
            className="mt-6 px-6 py-2.5 bg-[#0252CD] text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors shadow-md cursor-pointer"
          >
            Submit a Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div
              key={project.project_id}
              onClick={() => onSelectProject && onSelectProject(project.project_id)}
              className={`backdrop-blur-xl border rounded-2xl shadow-md p-6 transition-all relative overflow-hidden group cursor-pointer active:scale-[0.99] ${isDark
                  ? 'bg-slate-900/80 border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/80 text-slate-100 shadow-lg shadow-black/30'
                  : 'bg-white/75 border-white/80 hover:border-[#0252CD] hover:bg-white/90 text-slate-900 shadow-sky-950/5 hover:-translate-y-1 hover:shadow-xl'
                }`}
              title="Click to discuss with Mentor"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0252CD] opacity-80"></div>
              <div className="flex justify-between items-start mb-4 pl-2">
                <div>
                  <h3 className={`font-extrabold text-xl transition-colors ${isDark ? 'text-white group-hover:text-sky-400' : 'text-slate-900 group-hover:text-[#0252CD]'}`}>{project.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                      Domain: {project.domain}
                    </span>
                    <span className={`text-[10px] font-black ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>ID: #{project.project_id}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${isDark ? 'bg-blue-950/80 text-sky-300 border-blue-800' : 'bg-blue-50 text-[#0252CD] border-blue-100'}`}>
                    {project.status || 'Pending'}
                  </span>
                  <button
                    onClick={(e) => handleEditClick(project, e)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer flex items-center space-x-1 border ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                    title="Edit Project"
                  >
                    <span>✏️</span>
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(project, e)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer flex items-center space-x-1 border ${isDark ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100'}`}
                    title="Delete Project"
                  >
                    <span>🗑️</span>
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
              <p className={`text-sm leading-relaxed pl-2 whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{project.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal Overlay */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div className={`rounded-2xl w-full max-w-lg shadow-2xl border p-8 space-y-6 backdrop-blur-2xl ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white/90 border-white/80 text-slate-900'}`} onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Project Details</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Modify your project proposal parameters.</p>
            </div>

            {editError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                ⚠️ {editError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Project Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:border-[#0252CD] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Domain</label>
                <select
                  required
                  value={editDomain}
                  onChange={(e) => setEditDomain(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-xs font-medium focus:outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
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
                <label className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Project Description</label>
                <textarea
                  required
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-xs font-medium focus:outline-none resize-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>

              <div className={`flex justify-end space-x-2 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#0252CD] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deletingProject && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div className={`rounded-2xl w-full max-w-sm shadow-2xl border p-8 space-y-6 backdrop-blur-2xl ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white/90 border-white/80 text-slate-900'}`} onClick={(e) => e.stopPropagation()}>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto border border-red-100">
                ⚠️
              </div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Delete Project?</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Are you sure you want to delete <strong>"{deletingProject.title}"</strong>? This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
                ⚠️ {deleteError}
              </div>
            )}

            <div className="flex justify-center space-x-2 pt-2">
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
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50"
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
