import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

// --- Vector Icons ---
const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M12 2l2.4 7.2L21 12l-6.6 2.8L12 22l-2.4-7.2L3 12l6.6-2.8L12 2z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SlidersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// --- The 7 Notification Categories Requested ---
const NOTIFICATION_CATEGORIES = [
  { id: 'all', label: 'All Alerts' },
  { id: 'unread', label: 'Unread' },
  { id: 'mentorship', label: '📩 Mentorship Requests' },
  { id: 'progress', label: '📈 Progress Updates' },
  { id: 'deadlines', label: '⚠️ Missed Deadlines' },
  { id: 'reviews', label: '📅 Upcoming Reviews' },
  { id: 'documents', label: '📄 Submitted Documents' },
  { id: 'evaluations', label: '📋 Evaluation Pending' },
  { id: 'ai_risks', label: '🤖 AI Risk Alerts' },
];

export default function FacultyNotificationsView({ currentTheme = 'pastel', onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Notification Preferences State
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('academic_notification_preferences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      mentorship: true,
      progress: true,
      deadlines: true,
      reviews: true,
      documents: true,
      evaluations: true,
      ai_risks: true,
      soundAlerts: true
    };
  });

  // The 7 Notification Categories Feed State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('academic_faculty_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        category: 'mentorship',
        title: 'New Mentorship Request: PostgreSQL Connection Pooling',
        message: 'Abhishek Kumar submitted an advisory inquiry regarding asyncpg pool connection timeouts under concurrent agent load.',
        studentName: 'Abhishek Kumar',
        studentId: 1,
        timestamp: '10 mins ago',
        priority: 'High Priority',
        priorityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        read: false,
        actionRoute: 'faculty-mentorship',
        actionLabel: 'Review Request & Schedule'
      },
      {
        id: 2,
        category: 'ai_risks',
        title: 'AI Risk Engine: Model Quantization Latency Lag (+8 Days)',
        message: 'Multi-agent risk telemetry flagged an 8-day schedule delay for Team Pranav in the edge model inference pipeline.',
        studentName: 'Pranav',
        studentId: 4,
        timestamp: '45 mins ago',
        priority: 'Critical Alert',
        priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        read: false,
        actionRoute: 'faculty-progress',
        actionLabel: 'Inspect Telemetry'
      },
      {
        id: 3,
        category: 'documents',
        title: 'Document Submitted: SRS Specification v1.4',
        message: 'Pranav uploaded the finalized Software Requirements Specification for formal Phase 2 sign-off.',
        studentName: 'Pranav',
        studentId: 4,
        timestamp: '2 hours ago',
        priority: 'Action Required',
        priorityColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        read: false,
        actionRoute: 'faculty-documents',
        actionLabel: 'Inspect Document'
      },
      {
        id: 4,
        category: 'deadlines',
        title: 'Missed Milestone Deadline: Phase 3 Test Harnesses',
        message: 'Team Test Student 5 exceeded the Sprint 3 milestone target by 4 calendar days. Mentor unblocking recommended.',
        studentName: 'Test Student 5',
        studentId: 5,
        timestamp: '5 hours ago',
        priority: 'Overdue Alert',
        priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        read: false,
        actionRoute: 'faculty-progress',
        actionLabel: 'View Schedule Matrix'
      },
      {
        id: 5,
        category: 'reviews',
        title: 'Upcoming Review: Design Architecture Defense Tomorrow',
        message: 'Scheduled 1-on-1 sprint review meeting with Team Abhishek Kumar tomorrow at 03:30 PM (Google Meet).',
        studentName: 'Abhishek Kumar',
        studentId: 1,
        timestamp: 'Yesterday',
        priority: 'Scheduled Event',
        priorityColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
        read: true,
        actionRoute: 'faculty-mentorship',
        actionLabel: 'View Meeting Link'
      },
      {
        id: 6,
        category: 'evaluations',
        title: 'Evaluation Pending: Design Review Sign-Off (2 Teams)',
        message: '2 student capstone pods have submitted design deliverables awaiting rubric evaluation and grade marks entry.',
        studentName: 'Multiple Teams',
        studentId: null,
        timestamp: '1 day ago',
        priority: 'Pending Action',
        priorityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        read: true,
        actionRoute: 'faculty-reviews',
        actionLabel: 'Open Evaluation Board'
      },
      {
        id: 7,
        category: 'progress',
        title: 'Team Progress Update: Sprint 2 Deliverables Verified (+5%)',
        message: 'Team Multi-Agent Mentor Platform completed PostgreSQL migrations and LangGraph agent tools ahead of schedule.',
        studentName: 'Abhishek Kumar',
        studentId: 1,
        timestamp: '2 days ago',
        priority: 'Progress Update',
        priorityColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        read: true,
        actionRoute: 'faculty-progress',
        actionLabel: 'View Velocity Chart'
      }
    ];
  });

  const isDark = currentTheme === 'dark';

  const saveNotifications = (updated) => {
    setNotifications(updated);
    localStorage.setItem('academic_faculty_notifications', JSON.stringify(updated));
  };

  const savePreferences = (updated) => {
    setPrefs(updated);
    localStorage.setItem('academic_notification_preferences', JSON.stringify(updated));
    setShowSettingsModal(false);
  };

  // Toggle Read Status
  const toggleRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    saveNotifications(updated);
  };

  // Mark All as Read
  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  // Clear / Delete Single Notification
  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  // Clear All
  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeCategory === 'unread') return !n.read;
      if (activeCategory !== 'all') return n.category === activeCategory;
      return true;
    });
  }, [notifications, activeCategory]);

  // KPI Metrics
  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority.includes('Critical') || n.priority.includes('Overdue')).length;
  const aiAlertsCount = notifications.filter(n => n.category === 'ai_risks').length;

  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900';

  // Category Icon Resolver
  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'mentorship': return <GraduationCapIcon />;
      case 'progress': return <CheckCircleIcon />;
      case 'deadlines': return <AlertTriangleIcon />;
      case 'reviews': return <CalendarIcon />;
      case 'documents': return <FileTextIcon />;
      case 'evaluations': return <ClockIcon />;
      case 'ai_risks': return <SparklesIcon />;
      default: return <BellIcon />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-1 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border rounded-2xl p-6 shadow-xs ${cardBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
            <BellIcon />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Faculty Notifications & Intelligence Feed
              </h1>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
                  {unreadCount} Unread Alerts
                </span>
              )}
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time alerts for mentorship inquiries, progress audits, missed deadlines, pending reviews, and AI risk telemetry.
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Mark All Read
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className={`px-3 py-2 border text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Configure Alert Preferences"
          >
            <SlidersIcon />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Notifications */}
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Alerts</span>
            <BellIcon />
          </div>
          <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {notifications.length}
          </h3>
          <p className="text-[10px] font-bold text-slate-400">Recorded In-App Events</p>
        </div>

        {/* Unread Alerts */}
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Unread Alerts</span>
            <ClockIcon />
          </div>
          <h3 className="text-2xl font-black text-indigo-400">
            {unreadCount}
          </h3>
          <p className="text-[10px] font-bold text-indigo-500/80">Requiring Faculty Review</p>
        </div>

        {/* Critical / Deadlines */}
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Critical Deadlines</span>
            <AlertTriangleIcon />
          </div>
          <h3 className="text-2xl font-black text-rose-400">
            {criticalCount}
          </h3>
          <p className="text-[10px] font-bold text-rose-500/80">Urgent Intervention Needed</p>
        </div>

        {/* AI Risk Alerts */}
        <div className={`p-4 border rounded-2xl shadow-xs space-y-1.5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">AI Risk Alerts</span>
            <SparklesIcon />
          </div>
          <h3 className="text-2xl font-black text-purple-400">
            {aiAlertsCount}
          </h3>
          <p className="text-[10px] font-bold text-purple-500/80">Multi-Agent Telemetry Flags</p>
        </div>
      </div>

      {/* 3. Category Filter Tabs (The 7 Categories) */}
      <div className={`p-2 border rounded-2xl shadow-xs flex flex-wrap items-center gap-1.5 ${cardBg}`}>
        {NOTIFICATION_CATEGORIES.map((tab) => {
          const count = tab.id === 'all' 
            ? notifications.length 
            : tab.id === 'unread' 
              ? unreadCount 
              : notifications.filter(n => n.category === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeCategory === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-slate-700/40 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Notifications Feed List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${cardBg}`}>
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <CheckCircleIcon />
            </div>
            <h4 className="font-bold text-sm text-slate-300">All Caught Up!</h4>
            <p className="text-xs text-slate-500 mt-1">No alerts found in this category.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !notif.read
                  ? isDark 
                    ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/40 ring-1 ring-indigo-500/20'
                    : 'bg-gradient-to-r from-indigo-50/60 via-white to-white border-indigo-200 ring-1 ring-indigo-500/10'
                  : cardBg
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                {/* Category Icon */}
                <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                }`}>
                  {renderCategoryIcon(notif.category)}
                </div>

                {/* Details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-black leading-snug ${
                      !notif.read ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-300'
                    }`}>
                      {notif.title}
                    </h4>

                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${notif.priorityColor}`}>
                      {notif.priority}
                    </span>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center space-x-3 text-[10px] font-semibold text-slate-500 pt-0.5">
                    <span>{notif.timestamp}</span>
                    {notif.studentName && <span>• Pod: <strong className="text-slate-400">{notif.studentName}</strong></span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Jump to Module & Mark Read */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto pt-2 sm:pt-0">
                <button
                  onClick={() => {
                    toggleRead(notif.id);
                    if (onNavigate && notif.actionRoute) {
                      onNavigate(notif.actionRoute);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <span>{notif.actionLabel}</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => toggleRead(notif.id)}
                  className={`px-2.5 py-1.5 border text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  title={notif.read ? 'Mark as Unread' : 'Mark as Read'}
                >
                  {notif.read ? 'Mark Unread' : 'Mark Read'}
                </button>

                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                  title="Dismiss Alert"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Notification Preferences Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg border rounded-2xl p-6 shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <SlidersIcon />
                <h3 className="text-base font-black">Alert & Notification Preferences</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Customize which project telemetry and student advisory events trigger real-time faculty notifications.
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { key: 'mentorship', label: '📩 New Mentorship Requests', desc: 'Alert when a student submits an advisory inquiry' },
                { key: 'progress', label: '📈 Team Progress Updates', desc: 'Alert when sprint milestones are logged' },
                { key: 'deadlines', label: '⚠️ Missed Deadlines & Schedule Lag', desc: 'Urgent alerts when teams exceed planned timelines' },
                { key: 'reviews', label: '📅 Upcoming Evaluation Reviews', desc: 'Reminders for scheduled 1-on-1 sprint defenses' },
                { key: 'documents', label: '📄 Submitted Documents', desc: 'Alert when SRS, proposals, or slides are uploaded' },
                { key: 'evaluations', label: '📋 Evaluation Pending Reminders', desc: 'Notification when rubric sign-off is overdue' },
                { key: 'ai_risks', label: '🤖 AI Risk Engine Telemetry', desc: 'Automated warnings on model latency or test blockers' },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <h5 className="font-bold text-slate-200">{item.label}</h5>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={prefs[item.key]}
                    onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-xs font-bold text-rose-400 hover:underline cursor-pointer"
              >
                Clear All Notification History
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => savePreferences(prefs)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
