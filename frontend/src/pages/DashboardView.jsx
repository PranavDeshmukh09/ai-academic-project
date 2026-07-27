import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function DashboardView({ userProfile, onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    { id: 'profile', title: 'Profile Setup', icon: '👤', desc: 'Manage your personal details', color: 'bg-blue-50 text-[#0252CD]' },
    { id: 'skills', title: 'Skill Assessment', icon: '📝', desc: 'Evaluate your technical skills', color: 'bg-purple-50 text-purple-600' },
    { id: 'project', title: 'Submit Project', icon: '🚀', desc: 'Start a new AI project', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'chat', title: 'Mentor Chat', icon: '💬', desc: 'Talk with your assigned mentor', color: 'bg-amber-50 text-amber-600' },
    { id: 'reports', title: 'View Reports', icon: '📈', desc: 'Track your project progress', color: 'bg-rose-50 text-rose-600' },
    { id: 'settings', title: 'Settings', icon: '⚙️', desc: 'Configure your account', color: 'bg-slate-100 text-slate-600' },
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
    } catch (err) {
      setDeleteError(err.response?.data?.detail || err.message || 'Failed to delete project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0252CD] to-blue-500 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile?.fullName?.split(' ')[0] || 'Student'}!</h1>
          <p className="text-blue-100 max-w-lg">
            Ready to continue building your future? Check your active projects or start a new skill assessment to unlock more opportunities.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 translate-x-8"></div>
      </div>

      {/* Quick Links Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate && onNavigate(link.id)}
              className="flex items-start space-x-4 p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#0252CD] hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 ${link.color}`}>
                {link.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-[#0252CD] transition-colors">{link.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{link.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Active Projects List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Your Active Projects</h2>
          <button 
            onClick={() => onNavigate && onNavigate('project')}
            className="text-sm font-bold text-[#0252CD] hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-4 border border-slate-100">
                🚀
              </div>
              <h3 className="text-lg font-bold text-slate-800">No active projects</h3>
              <p className="text-slate-500 text-sm mt-1 mb-4">You haven't started any projects yet.</p>
              <button 
                onClick={() => onNavigate && onNavigate('project')}
                className="px-6 py-2.5 bg-[#0252CD] text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
              >
                Submit a Project
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.map(project => (
                <div key={project.project_id} className="p-6 hover:bg-slate-50 transition-colors group relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#0252CD]">{project.title}</h3>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mt-1 inline-block">
                        Domain: {project.domain}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-50 text-[#0252CD] text-xs font-bold rounded-full border border-blue-100">
                        {project.status || 'Pending'}
                      </span>
                      <button
                        onClick={() => handleEditClick(project)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 pr-24">{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Edit Project Details</h3>
              <p className="text-xs text-slate-400 mt-1">Modify your project proposal parameters.</p>
            </div>
            
            {editError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                ⚠️ {editError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Title</label>
                <input 
                  type="text" 
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0252CD]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Domain</label>
                <select 
                  required
                  value={editDomain}
                  onChange={(e) => setEditDomain(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none bg-white"
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Description</label>
                <textarea 
                  required
                  rows="4"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto border border-red-100">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Project?</h3>
              <p className="text-xs text-slate-500">
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
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
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