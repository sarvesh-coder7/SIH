import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  GraduationCap,
  Award,
  Users,
  Mail,
  Phone,
  CheckCircle2,
  Save,
  FlaskConical,
  Sparkles,
  Layers,
  Camera,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';

export const UniversityProfilePage: React.FC = () => {
  const { currentUser, updateProfile, showToast } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [institutionName, setInstitutionName] = useState(
    currentUser.organization || 'Birla Institute of Technology (BIT Mesra), Ranchi'
  );

  const [aisheCode, setAisheCode] = useState('U-0275');
  const [accreditation, setAccreditation] = useState(
    'NAAC Grade A++ (Score 3.68/4.0)'
  );
  const [nirfRank, setNirfRank] = useState('Rank #48 (Engineering Band)');
  const [district, setDistrict] = useState('Ranchi');
  const [nodalOfficer, setNodalOfficer] = useState(
    'Prof. (Dr.) Alok Verma, Dean R&D'
  );
  const [contactEmail, setContactEmail] = useState(
    'dean.rnd@bitmesra.ac.in'
  );
  const [contactPhone, setContactPhone] = useState('+91 651 2275444');
  const [incubationCentre, setIncubationCentre] = useState(
    'BIT-STEP Incubation & Innovation Foundation'
  );

  const [profileImage, setProfileImage] = useState<string | null>(
    currentUser.avatarUrl || null
  );

  const departments = [
    {
      name: 'Chemical Engineering & Water Treatment Lab',
      faculty: 14,
      capstoneProjects: 6,
    },
    {
      name: 'Electronics, IoT & Embedded Systems',
      faculty: 22,
      capstoneProjects: 9,
    },
    {
      name: 'Mechanical & Renewable Thermal Energy',
      faculty: 18,
      capstoneProjects: 5,
    },
    {
      name: 'Computer Science & AI / ML Lab',
      faculty: 30,
      capstoneProjects: 12,
    },
    {
      name: 'Bioengineering & Diagnostic Testing',
      faculty: 12,
      capstoneProjects: 4,
    },
    {
      name: 'Civil & Geo-Informatics / Remote Sensing',
      faculty: 16,
      capstoneProjects: 5,
    },
  ];

  const specializedLabs = [
    'Advanced Spectrometry & Heavy Metal Water Testing Facility',
    'Tribal Agro-Processing & Natural Bio-Extracts Incubator',
    'Solar Photovoltaic & Smart Microgrid Testbed (MNRE Supported)',
    'IoT LoRaWAN Telemetry & Remote Sensor Calibration Center',
  ];

  const handleProfileImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast(
        'warning',
        'Invalid Image',
        'Please select a valid image file.'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(
        'warning',
        'Image Too Large',
        'Please choose an image smaller than 5 MB.'
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      organization: institutionName,
      district,
      phone: contactPhone,
      designation: nodalOfficer,
      avatarUrl: profileImage || undefined,
    });

    showToast(
      'success',
      'Profile Updated',
      'Institutional profile and R&D contact details have been saved successfully.'
    );
  };

  const initials = institutionName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans-body">

      {/* =========================================================
          PROFILE HEADER
      ========================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

          <div className="flex items-center gap-4 min-w-0">

            {/* Profile Picture */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="University profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-black text-xl">
                    {initials || <GraduationCap className="w-9 h-9" />}
                  </div>
                )}
              </div>

              {/* Camera Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -right-2 -bottom-2 w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            {/* Header Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                  {institutionName}
                </h1>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                University / Higher Education Institution
              </p>

              <div className="flex items-center gap-3 flex-wrap mt-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {district}, Jharkhand
                </span>

                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  AISHE: {aisheCode}
                </span>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />

              <div>
                <p className="text-[10px] font-bold text-emerald-900">
                  JSHEC Verified
                </p>
                <p className="text-[9px] text-emerald-700">
                  Institutional Account
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Controls */}
        {profileImage && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              University profile picture
            </p>

            <button
              type="button"
              onClick={removeProfileImage}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Remove picture
            </button>
          </div>
        )}
      </div>

      {/* =========================================================
          PROFILE FORM
      ========================================================= */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* Institutional Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">

          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                Institutional Information
              </h2>

              <p className="text-[11px] text-slate-500 mt-1">
                Official university identity and accreditation details
              </p>
            </div>

            <GraduationCap className="w-5 h-5 text-emerald-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Institution Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Institution Official Name
              </label>

              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* AISHE */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                AISHE Code
              </label>

              <input
                type="text"
                value={aisheCode}
                onChange={(e) => setAisheCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                District Headquarters
              </label>

              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Accreditation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                NAAC Accreditation Grade
              </label>

              <input
                type="text"
                value={accreditation}
                onChange={(e) => setAccreditation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* NIRF */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                NIRF Ranking Band
              </label>

              <input
                type="text"
                value={nirfRank}
                onChange={(e) => setNirfRank(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Incubation */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Incubation & Innovation Centre
              </label>

              <input
                type="text"
                value={incubationCentre}
                onChange={(e) => setIncubationCentre(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* R&D Contact */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">

          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              R&D Nodal Officer & Contact
            </h2>

            <p className="text-[11px] text-slate-500 mt-1">
              Primary institutional contact for research and collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Nodal Officer */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nodal Officer & Designation
              </label>

              <input
                type="text"
                value={nodalOfficer}
                onChange={(e) => setNodalOfficer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Official R&D Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-20 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />

                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Direct Contact Phone
              </label>

              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
      </form>

      {/* =========================================================
          DEPARTMENTS
      ========================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              Registered Academic Departments
            </h2>

            <p className="text-[11px] text-slate-500 mt-1">
              Departments participating in research and innovation activities
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold">
            {departments.length} Departments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {departments.map((dept, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 block leading-snug">
                    {dept.name}
                  </span>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {dept.faculty} Faculty Researchers
                    </span>

                    <span className="text-[10px] font-bold text-emerald-800">
                      {dept.capstoneProjects} Projects
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          RESEARCH FACILITIES
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Labs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">

          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              Specialized Research Facilities
            </h2>

            <p className="text-[11px] text-slate-500 mt-1">
              Registered research and testing facilities
            </p>
          </div>

          <div className="space-y-2.5">
            {specializedLabs.map((lab, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-800 flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                </div>

                <span className="leading-relaxed pt-0.5">
                  {lab}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recognition */}
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-xs">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5 text-amber-500" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-emerald-900">
                State Innovation Seed Fund
              </h2>

              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                Institutional Eligibility Status
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            BIT Mesra is recognized as a Tier-1 Nodal Hub under Jharkhand
            State Higher Education Council (JSHEC). Eligible for 100% matching
            R&D grants up to ₹25 Lakhs per capstone cohort.
          </p>

          <div className="mt-5 pt-4 border-t border-emerald-200 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800">
              Accreditation
            </span>

            <span className="text-[10px] font-semibold text-slate-700 text-right">
              {accreditation}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800">
              NIRF
            </span>

            <span className="text-[10px] font-semibold text-slate-700">
              {nirfRank}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};