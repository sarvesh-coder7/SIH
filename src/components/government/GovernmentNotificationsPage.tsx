import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  History,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building2,
  Clock,
  Check,
} from 'lucide-react';

export const GovernmentNotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    activityLogs,
    currentGovernmentMember,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'NOTIFICATIONS' | 'AUDIT_TRAIL'>('NOTIFICATIONS');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredLogs = activityLogs.filter((log) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.targetId && log.targetId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>State Communications & Transparency</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Notifications & Official Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time alerts on verification requests, assignments, and an immutable log of all government actions.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'NOTIFICATIONS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Notifications ({unreadCount} new)
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_TRAIL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'AUDIT_TRAIL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Trail ({activityLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'NOTIFICATIONS' ? (
        /* Notifications Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Government Notifications Feed
            </h3>
            <span className="text-xs text-slate-500">
              {unreadCount} unread of {notifications.length} total
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`py-3.5 flex items-start justify-between gap-4 transition-colors ${
                  !n.read ? 'bg-amber-50/40 -mx-3 px-3 rounded-xl' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {n.type === 'Challenge' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : n.type === 'Approval' ? (
                      <FileCheck className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Bell className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">• {n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    {n.relatedId && (
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                        Ref: #{n.relatedId}
                      </span>
                    )}
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg shrink-0 text-xs flex items-center gap-1 font-semibold"
                    title="Mark as Read"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Read</span>
                  </button>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-500">
                No notifications logged.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Audit Trail Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-600" />
                <span>State Activity & Administrative Decision Log</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifiable event log of all verifications, university assignments, report approvals, and interventions.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    {log.targetType && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {log.targetType} {log.targetId && `#${log.targetId}`}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                </div>

                <div className="text-slate-600 text-[11px] leading-relaxed">
                  {log.details}
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-2">
                  <span><strong>Official:</strong> {log.actor}</span>
                  <span>•</span>
                  <span><strong>Department:</strong> {log.department || 'JSHEC'}</span>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-500">
                No activity records found matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
