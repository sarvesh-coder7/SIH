import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Layers,
  GraduationCap,
  Building2,
  Calendar,
  ChevronRight,
  Filter,
  Search,
  ShieldCheck,
  Users,
  Check,
  FileText,
} from 'lucide-react';

export const UniversityNotificationsPage: React.FC = () => {
  const { markNotificationAsRead, showToast, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'grants' | 'challenges' | 'milestones'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // University specific sample notifications if not populated
  const academicNotifications = [
    {
      id: 'NOTIF-ACAD-01',
      title: 'CSR Grant Sanctioned: ₹3.50 Lakhs from Tata Steel Foundation',
      message:
        'Tata Steel CSR Committee approved the matching fund tranche for Jal-Shuddhi dual-stage fluoride filtration project (Khunti pilot). Funds credited to HEI R&D Account.',
      type: 'Funding' as const,
      timestamp: '2 hours ago',
      read: false,
      tag: 'Funding',
      actionView: 'university-proposals',
      actionLabel: 'View Proposal & CSR Tranche',
    },
    {
      id: 'NOTIF-ACAD-02',
      title: 'AI Priority Triage: New Critical Challenge in Khunti District',
      message:
        'AI matching engine identified 94% domain match for BIT Mesra Chemical & IoT departments: High Fluoride Contamination in Torpa Block.',
      type: 'AI Match' as const,
      timestamp: '5 hours ago',
      read: false,
      tag: 'AI Match',
      actionView: 'university-challenges',
      actionLabel: 'Evaluate Matched Challenge',
    },
    {
      id: 'NOTIF-ACAD-03',
      title: 'Milestone 4 Verified by State PMU Higher Education Department',
      message:
        'Lab spectrometry calibration report for Jal-Shuddhi verified by JSHEC technical auditor. Ready to proceed to Field Pilot deployment.',
      type: 'Milestone' as const,
      timestamp: '1 day ago',
      read: false,
      tag: 'Milestone',
      actionView: 'project-workspace',
      actionLabel: 'Inspect 14-Stage Lifecycle',
    },
    {
      id: 'NOTIF-ACAD-04',
      title: 'Industry Co-Mentor Assigned: Central Coalfields Ltd',
      message:
        'Er. Rajiv Prasad (Chief General Manager, CCL Environment) has accepted the co-mentorship invitation for the Solar Agritech capstone cohort.',
      type: 'Co-Mentorship' as const,
      timestamp: '2 days ago',
      read: true,
      tag: 'Co-Mentorship',
      actionView: 'university-teams',
      actionLabel: 'Open Team Roster',
    },
    {
      id: 'NOTIF-ACAD-05',
      title: 'Patent Prior Art Search Completed by State IP Facilitation Cell',
      message:
        'Draft Indian Patent application #202631008472 cleared initial prior art novelty search with zero conflicting citations.',
      type: 'Patent' as const,
      timestamp: '3 days ago',
      read: true,
      tag: 'Intellectual Property',
      actionView: 'project-workspace',
      actionLabel: 'Review Patent Dossier',
    },
  ];

  const [notifsList, setNotifsList] = useState(academicNotifications);

  const handleMarkAllRead = () => {
    setNotifsList(notifsList.map((n) => ({ ...n, read: true })));
    showToast('success', 'All Marked Read', 'All institutional notifications marked as read.');
  };

  const handleItemClick = (notif: typeof academicNotifications[0]) => {
    setNotifsList(notifsList.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    if (notif.actionView) {
      setCurrentView(notif.actionView as any);
      showToast('info', notif.title, 'Navigated to related module.');
    }
  };

  const filteredNotifs = notifsList.filter((n) => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'grants' && n.tag !== 'Funding') return false;
    if (filter === 'challenges' && n.tag !== 'AI Match') return false;
    if (filter === 'milestones' && n.tag !== 'Milestone' && n.tag !== 'Intellectual Property') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = notifsList.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              HEI Communications Hub
            </span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Academic & R&D Notifications Dossier
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time alerts regarding AI problem triage, CSR grant clearances, milestone audits, and patent prior-art updates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="px-4 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#e2d6bc] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'all' ? 'bg-[#0d5c3a] text-white shadow-xs' : 'text-slate-600 hover:bg-[#fbf8ee]'
            }`}
          >
            All Alerts ({notifsList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'unread' ? 'bg-[#0d5c3a] text-white shadow-xs' : 'text-slate-600 hover:bg-[#fbf8ee]'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('grants')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'grants' ? 'bg-[#0d5c3a] text-white shadow-xs' : 'text-slate-600 hover:bg-[#fbf8ee]'
            }`}
          >
            CSR Grants
          </button>
          <button
            type="button"
            onClick={() => setFilter('challenges')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'challenges' ? 'bg-[#0d5c3a] text-white shadow-xs' : 'text-slate-600 hover:bg-[#fbf8ee]'
            }`}
          >
            AI Ingestion Matches
          </button>
          <button
            type="button"
            onClick={() => setFilter('milestones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === 'milestones' ? 'bg-[#0d5c3a] text-white shadow-xs' : 'text-slate-600 hover:bg-[#fbf8ee]'
            }`}
          >
            Milestones & IP
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e2d6bc] shadow-xs space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <span className="text-xs font-bold text-slate-700 block">No notifications matching criteria</span>
            <p className="text-[11px] text-slate-400">Try adjusting your search query or switching filters.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative group ${
                !n.read
                  ? 'bg-[#fbf8ee] border-emerald-300 hover:border-emerald-500 shadow-xs'
                  : 'bg-white border-[#e2d6bc] hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      n.tag === 'Funding'
                        ? 'bg-emerald-100 text-emerald-800'
                        : n.tag === 'AI Match'
                        ? 'bg-amber-100 text-amber-900'
                        : n.tag === 'Milestone'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-purple-100 text-purple-900'
                    }`}
                  >
                    {n.tag === 'Funding' ? (
                      <DollarSign className="w-5 h-5" />
                    ) : n.tag === 'AI Match' ? (
                      <Sparkles className="w-5 h-5" />
                    ) : n.tag === 'Milestone' ? (
                      <Layers className="w-5 h-5" />
                    ) : (
                      <Users className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</span>
                      {!n.read && (
                        <span className="px-2 py-0.5 rounded-full bg-[#0d5c3a] text-white text-[9px] font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium block">{n.timestamp}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#fbf8ee] text-slate-700 border border-[#e2d6bc] mt-1.5 inline-block">
                    {n.tag}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e2d6bc]/50 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">Click to navigate to relevant action</span>
                <span className="text-xs font-bold text-emerald-700 group-hover:text-emerald-900 flex items-center gap-1">
                  <span>{n.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
