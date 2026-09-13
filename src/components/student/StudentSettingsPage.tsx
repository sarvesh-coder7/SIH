import React from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, User, Bell, Shield, Save } from 'lucide-react';

export const StudentSettingsPage: React.FC = () => {
  const { currentUser, showToast } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Student Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your student credentials, Academic Bank of Credits (ABC) ID, and notification preferences.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              defaultValue={currentUser.name || 'Rohan Kumar Verma'}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">University Roll / Student ID</label>
            <input
              type="text"
              defaultValue="BT/22/EE/041"
              disabled
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Institution</label>
            <input
              type="text"
              defaultValue={currentUser.organization || 'Birla Institute of Technology (BIT) Mesra'}
              disabled
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Academic Bank of Credits (ABC ID)</label>
            <input
              type="text"
              defaultValue="ABC-9842-1029-4412"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => showToast('success', 'Settings Saved', 'Profile preferences updated.')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
