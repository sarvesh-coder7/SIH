import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  Save,
  CheckCircle2,
  LogOut,
  Camera,
} from 'lucide-react';

export const CitizenProfilePage: React.FC = () => {
  const { currentUser, updateProfile, setCurrentView, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(
    currentUser.phone || '+91 94311 88201'
  );
  const [district, setDistrict] = useState(
    currentUser.district || 'Khunti'
  );
  const [village, setVillage] = useState(
    'Torpa Block, Dormo Panchayat'
  );
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [smsUpdates, setSmsUpdates] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profilePicture, setProfilePicture] = useState<string | null>(
    currentUser.avatarUrl || null
  );

  const displayName = name.trim() || 'Citizen';
  const initial = displayName.charAt(0).toUpperCase();

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast(
        'error',
        'Invalid Image',
        'Please select a valid image file.'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(
        'error',
        'Image Too Large',
        'Please choose an image smaller than 5 MB.'
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result as string;

      setProfilePicture(imageUrl);

      updateProfile({
        avatarUrl: imageUrl,
      });

      showToast(
        'success',
        'Profile Picture Updated',
        'Your profile picture has been updated.'
      );
    };

    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);

    updateProfile({
      avatarUrl: '',
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    showToast(
      'success',
      'Profile Picture Removed',
      'Your profile picture has been removed.'
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      name,
      phone,
      district,
      avatarUrl: profilePicture || '',
    });

    showToast(
      'success',
      'Profile Updated',
      'Your profile details have been saved successfully.'
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-1 sm:px-0 pb-8 space-y-6 font-sans-body">

      {/* Profile Header */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            {/* Profile Identity */}
            <div className="flex items-center gap-4 min-w-0">

              {/* Profile Picture */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md cursor-pointer"
                  aria-label="Change profile picture"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={`${displayName} profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initial
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>

                {/* Camera Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                  aria-label="Edit profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>

              {/* User Information */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                    {displayName}
                  </h1>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Citizen
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    {currentUser.email || 'No email available'}
                  </span>

                  <span className="hidden sm:block text-slate-300">
                    •
                  </span>

                  <span>
                    Member since Aug 2026
                  </span>
                </div>

                {/* Remove Picture */}
                {profilePicture && (
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    className="mt-1.5 text-[10px] font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* Switch Account */}
            <button
              type="button"
              onClick={() => setCurrentView('role-selection')}
              className="self-start sm:self-center shrink-0 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Switch Account
            </button>
          </div>
        </div>
      </section>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Personal Information */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">

          <div className="flex items-start gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-amber-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Manage your basic personal and contact information.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all font-medium"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full pl-10 pr-24 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium cursor-not-allowed"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            {/* Mobile Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Mobile Phone
              </label>

              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all font-medium"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            {/* Home District */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Home District
              </label>

              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />

                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-9 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all font-medium appearance-none cursor-pointer"
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Village / Panchayat */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">
                Village / Local Panchayat
              </label>

              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all font-medium"
                  placeholder="Village, Block or Panchayat"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences & Notifications */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">

          <div className="flex items-start gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-amber-600" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Preferences & Notifications
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Choose how you would like to receive updates.
              </p>
            </div>
          </div>

          <div className="space-y-3">

            {/* SMS Updates */}
            <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block">
                  SMS Milestone Updates
                </span>

                <span className="text-[11px] leading-relaxed text-slate-500 block mt-1">
                  Receive SMS when your reported problem is assigned to a
                  university or resolved.
                </span>
              </div>

              <input
                type="checkbox"
                checked={smsUpdates}
                onChange={(e) => setSmsUpdates(e.target.checked)}
                className="w-4 h-4 shrink-0 accent-amber-500 cursor-pointer"
              />
            </label>

            {/* Email Digest */}
            <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block">
                  Monthly Community Impact Digest
                </span>

                <span className="text-[11px] leading-relaxed text-slate-500 block mt-1">
                  Summary of newly completed projects in {district} District.
                </span>
              </div>

              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="w-4 h-4 shrink-0 accent-amber-500 cursor-pointer"
              />
            </label>

            {/* Language */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Preferred Language
                </span>

                <span className="text-[11px] leading-relaxed text-slate-500 block mt-1">
                  Choose your preferred language for the portal.
                </span>
              </div>

              <div className="relative shrink-0">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as 'en' | 'hi')
                  }
                  className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.98] text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
