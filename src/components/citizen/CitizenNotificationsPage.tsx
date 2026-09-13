import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Award,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const CitizenNotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    navigateToChallenge,
    setCurrentView,
    showToast,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Enhance notifications with Citizen-specific alerts if needed
  const citizenNotifs = notifications.length > 0 ? notifications : [
    {
      id: 'notif-cit-1',
      title: 'Problem Report Received',
      message: 'Your report JH-2026-001248 (Arsenic Turbidity in Torpa) has been successfully registered.',
      date: 'Just now',
      read: false,
      type: 'challenge',
      targetId: 'JH-2026-001248',
    },
    {
      id: 'notif-cit-2',
      title: 'Report Moved to Under Review',
      message: 'Nodal verification officer has started field verification in Khunti district.',
      date: '2 hours ago',
      read: false,
      type: 'challenge',
      targetId: 'JH-2026-001248',
    },
    {
      id: 'notif-cit-3',
      title: 'University Assigned to Problem',
      message: 'Birla Institute of Technology (BIT) Mesra has been allocated to develop a low-cost filtration solution.',
      date: '1 day ago',
      read: true,
      type: 'assignment',
      targetId: 'JH-2026-001248',
    },
    {
      id: 'notif-cit-4',
      title: 'Solution in Progress Update',
      message: 'Prototype field testing report has been posted by the research team.',
      date: '3 days ago',
      read: true,
      type: 'project',
      targetId: 'JH-2026-001248',
    },
    {
      id: 'notif-cit-5',
      title: 'Successful Public Outcome',
      message: 'Solar Cold Storage project in Gumla has been completed, benefiting 850+ farmers.',
      date: '1 week ago',
      read: true,
      type: 'impact',
      targetId: 'JH-2026-001248',
    },
  ];

  const filteredNotifs = citizenNotifs.filter((n) => (filter === 'unread' ? !n.read : true));

  const handleMarkAllRead = () => {
    citizenNotifs.forEach((n) => markNotificationAsRead(n.id));
    showToast('success', 'All Read', 'All notifications marked as read.');
  };

  const getNotifIcon = (title: string) => {
    if (title.includes('University') || title.includes('Assigned')) {
      return <GraduationCap className="w-5 h-5 text-purple-600" />;
    }
    if (title.includes('Outcome') || title.includes('Successful')) {
      return <Award className="w-5 h-5 text-teal-600" />;
    }
    if (title.includes('Reopened') || title.includes('Unsuccessful')) {
      return <RotateCcw className="w-5 h-5 text-amber-600" />;
    }
    if (title.includes('Received') || title.includes('Registered')) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    return <Clock className="w-5 h-5 text-amber-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans-body">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => setCurrentView('citizen-dashboard')}
              className="hover:text-amber-700 cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">Notifications</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-600" />
            <span>Citizen Notifications</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time updates regarding your reported problems, university milestones, and outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({citizenNotifs.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({citizenNotifs.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-2">
            <Bell className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Notifications</h3>
            <p className="text-xs text-slate-500">You are all caught up!</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                const target = (n as any).targetId || (n as any).relatedId;
                if (target) navigateToChallenge(target);
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-amber-50/50 border-amber-300 shadow-xs hover:border-amber-400'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getNotifIcon(n.title)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-slate-600 shrink-0 font-medium">
                    {(n as any).date || (n as any).timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {n.message}
                </p>
              </div>

              <div className="shrink-0 self-center">
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
