import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Shield, Bell, Save } from 'lucide-react';

export const UniversitySettingsPage: React.FC = () => {
  const { currentUser, showToast } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Institution & Faculty Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your institution&apos;s department profiles, verified laboratory credentials, and alert preferences.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Institution Name</label>
            <input
              type="text"
              defaultValue={currentUser.organization || 'Birla Institute of Technology (BIT) Mesra'}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">AISHE Institutional Code</label>
            <input
              type="text"
              defaultValue="U-0205 (NIRF Rank 45)"
              disabled
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Lead Department / Centre</label>
            <input
              type="text"
              defaultValue="Centre for Water Resources & Chemical Engineering"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Official University Email</label>
            <input
              type="email"
              defaultValue="dean.rnd@bitmesra.ac.in"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => showToast('success', 'Settings Saved', 'Institution profile preferences updated.')}
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
