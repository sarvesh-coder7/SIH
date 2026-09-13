import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Bell,
  Lock,
  Mail,
  ShieldCheck,
  Building2,
  Save,
} from 'lucide-react';

export const IndustrySettingsPage: React.FC = () => {
  const { currentIndustryMember, showToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [newProjectAlerts, setNewProjectAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Preferences Saved', 'Your account notification settings have been updated.');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Portal & Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage system notification preferences and account security coordinates.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Notifications Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              Automated Dispatches & Email Notifications
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Instant Collaboration Alerts</span>
                  <span className="text-[11px] text-slate-500">
                    Receive immediate emails when universities accept proposals or upload test reports.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">New Innovation Match Notifications</span>
                  <span className="text-[11px] text-slate-500">
                    Get alerted when new academic projects match your registered technical capability tags.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newProjectAlerts}
                  onChange={(e) => setNewProjectAlerts(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Weekly District Impact Digest</span>
                  <span className="text-[11px] text-slate-500">
                    Receive summary progress bulletins across all funded and co-developed projects.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Account Security Information */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Authenticated Session Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Corporate Email</span>
                <span className="font-bold text-slate-800">{currentIndustryMember?.email || 'N/A'}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Designated Role</span>
                <span className="font-bold text-slate-800">{currentIndustryMember?.role || currentIndustryMember?.member_role || 'org_admin'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
