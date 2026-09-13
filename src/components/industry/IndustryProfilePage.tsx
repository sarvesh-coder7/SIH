import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Globe,
  Mail,
  Phone,
  Layers,
  Wrench,
  DollarSign,
  HeartHandshake,
  Cpu,
  Plus,
  X,
  Edit2,
  Save,
} from 'lucide-react';

export const IndustryProfilePage: React.FC = () => {
  const {
    activeIndustry,
    updateIndustryProfile,
    currentIndustryMember,
    showToast,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [orgName, setOrgName] = useState(activeIndustry.organization_name);
  const [sector, setSector] = useState(activeIndustry.sector);
  const [district, setDistrict] = useState(activeIndustry.district);
  const [website, setWebsite] = useState(activeIndustry.website || 'https://www.tatasteel.com');
  const [description, setDescription] = useState(
    activeIndustry.description ||
      'Leading steel, metallurgy, and industrial materials conglomerate with dedicated engineering innovation centers in Jamshedpur and tribal CSR outreach across Jharkhand.'
  );

  const canEdit = currentIndustryMember.permissions.canManageOrgProfile;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateIndustryProfile({
      organization_name: orgName,
      sector,
      district,
      website,
      description,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organization Profile & Capabilities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered industrial entity profile, institutional verification status, and core R&D testbed matrix.
          </p>
        </div>

        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{activeIndustry.organization_name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified Partner
                  </span>
                </div>
                <div className="text-xs text-emerald-200/80 mt-1 flex flex-wrap items-center gap-3">
                  <span>Type: {activeIndustry.organization_type}</span>
                  <span>•</span>
                  <span>Sector: {activeIndustry.sector}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {activeIndustry.district}, {activeIndustry.state}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form / Details View */}
        <div className="p-6 sm:p-8 space-y-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sector</label>
                  <input
                    type="text"
                    required
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Headquarters District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization Overview</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  About the Organization
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500">Corporate Identity Number (CIN)</span>
                  <div className="font-bold text-slate-800">L27100MH1907PLC000260</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500">State Registration Status</span>
                  <div className="font-bold text-emerald-700">Verified by Dept of Industries</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500">Official Web Domain</span>
                  <div className="font-bold text-slate-800 truncate">{website}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Capabilities Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Industry Capability & Facility Matrix</h3>
          <p className="text-xs text-slate-500 mt-1">
            Registered technical facilities that are automatically matched against university research proposals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Manufacturing */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-600" />
              Tooling & Manufacturing Facilities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'SS316 Precision Machining',
                'Sheet Metal Laser Cutting',
                'Custom FRP Moulding',
                'Batch Prototyping',
                'CNC Turning',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Testing */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Certified Laboratory Testing Rigs
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Hydraulic Burst Rig (15 bar)',
                'Environmental Thermal Chamber',
                'Spectrometry & Heavy Metals Lab',
                'Corrosion Salt Spray Testing',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CSR */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              CSR Thematic Priorities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Rural Drinking Water Security',
                'Clean Air in Mining Corridors',
                'Tribal Livelihoods',
                'Maternal & Child Health',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mentorship */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Technical Mentorship Specialties
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Design For Manufacturing (DFM)',
                'Hydraulic Engineering',
                'Embedded IoT & Solar Power',
                'BIS Standard Compliance',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
