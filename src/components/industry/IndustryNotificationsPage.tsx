import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  Handshake,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const IndustryNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, setCurrentView } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'Collaboration':
        return <Handshake className="w-4 h-4 text-emerald-600" />;
      case 'Project':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'Challenge':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Notifications & Alerts</h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time institutional dispatches from universities, state PMU, and active co-development workspaces.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No unread notifications at this time.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-5 flex items-start gap-4 transition cursor-pointer ${
                notif.read ? 'bg-white hover:bg-slate-50/50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[11px] text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
