import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  UserCheck,
  ShieldCheck,
  Bell,
  Lock,
  Building2,
  Check,
} from 'lucide-react';

export const GovernmentSettingsPage: React.FC = () => {
  const {
    currentGovernmentMember,
    governmentMembers,
    switchGovernmentMember,
    showToast,
  } = useApp();

  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationAlerts, setNotificationAlerts] = useState(true);
  const [autoFlagSpam, setAutoFlagSpam] = useState(true);

  const handleSaveSettings = () => {
    showToast('success', 'Preferences Updated', 'Official notification and due diligence settings saved.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Account & Security Settings</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Official Profile & System Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your state clearance credentials, notification frequency, and role scope.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Authenticated Official Credentials</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium">Full Name</label>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {currentGovernmentMember.name}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium">Designation</label>
              <div className="font-medium text-slate-800 mt-0.5">
                {currentGovernmentMember.designation}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium">Department / Council</label>
              <div className="font-medium text-slate-800 mt-0.5">
                {currentGovernmentMember.department_name}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium">Official Email</label>
              <div className="font-medium text-slate-800 mt-0.5">
                {currentGovernmentMember.email}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium">Clearance Level</label>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs uppercase">
                {currentGovernmentMember.access_level} Clearance
              </span>
            </div>
          </div>
        </div>

        {/* Switch Official Scope (Testing) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Switch Active Official / Department Persona</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an official to test permissions across State, Department, District, & Field levels.
            </p>
          </div>

          <div className="space-y-2">
            {governmentMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => switchGovernmentMember(member.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-all ${
                  member.id === currentGovernmentMember.id
                    ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-400'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{member.name}</div>
                  <div className="text-[11px] text-slate-600">{member.designation}</div>
                  <div className="text-[10px] text-slate-400">{member.department_name}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-white border border-slate-200 text-slate-700">
                  {member.access_level}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* System & Notification Toggles */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-600" />
            <span>Workflow & Alert Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600"
              />
              <div>
                <div className="font-bold text-slate-800">Email Digest of New Submissions</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Receive daily summaries of newly reported challenges.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationAlerts}
                onChange={(e) => setNotificationAlerts(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600"
              />
              <div>
                <div className="font-bold text-slate-800">Stalled Project Alerts</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Immediate notifications when milestone deadlines are missed.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoFlagSpam}
                onChange={(e) => setAutoFlagSpam(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600"
              />
              <div>
                <div className="font-bold text-slate-800">AI Trust Score Screening</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Pre-screen low confidence citizen uploads for evidence review.</div>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
