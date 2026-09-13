import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const CitizenProfilePage: React.FC = () => {
  const { currentUser, updateProfile, setCurrentView, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '+91 94311 88201');
  const [district, setDistrict] = useState(currentUser.district || 'Khunti');
  const [village, setVillage] = useState('Torpa Block, Dormo Panchayat');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [smsUpdates, setSmsUpdates] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      district,
    });
    showToast('success', 'Profile Updated', 'Your profile details have been saved.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans-body">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                Verified Citizen
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.email} &bull; Member since Aug 2026
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('role-selection')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Account</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {/* Email (Readonly Verified) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-500 font-medium cursor-not-allowed"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {/* Primary District */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Home District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                {JHARKHAND_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>

            {/* Village / Panchayat */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Village / Local Panchayat</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Preferences & Notifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Preferences & Privacy</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">SMS Milestone Updates</span>
                <span className="text-[11px] text-slate-500 block">
                  Receive SMS when your reported problem is assigned to a university or resolved.
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsUpdates}
                onChange={(e) => setSmsUpdates(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">Monthly Community Impact Digest</span>
                <span className="text-[11px] text-slate-500 block">
                  Summary of newly completed projects in {district} District.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
