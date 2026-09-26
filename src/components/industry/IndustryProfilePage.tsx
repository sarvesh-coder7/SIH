import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Wrench,
  HeartHandshake,
  Cpu,
  Edit2,
  Save,
  Camera,
  X,
  Globe,
  LockKeyhole,
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
  const [website, setWebsite] = useState(
    activeIndustry.website || 'https://www.tatasteel.com'
  );
  const [description, setDescription] = useState(
    activeIndustry.description ||
      'Leading steel, metallurgy, and industrial materials conglomerate with dedicated engineering innovation centers in Jamshedpur and tribal CSR outreach across Jharkhand.'
  );

  const [profileImage, setProfileImage] = useState<string | null>(
    (activeIndustry as any).logo_url || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canEdit = currentIndustryMember.permissions.canManageOrgProfile;

  useEffect(() => {
    setOrgName(activeIndustry.organization_name);
    setSector(activeIndustry.sector);
    setDistrict(activeIndustry.district);
    setWebsite(activeIndustry.website || 'https://www.tatasteel.com');
    setDescription(
      activeIndustry.description ||
        'Leading steel, metallurgy, and industrial materials conglomerate with dedicated engineering innovation centers in Jamshedpur and tribal CSR outreach across Jharkhand.'
    );
    setProfileImage((activeIndustry as any).logo_url || null);
  }, [activeIndustry]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('warning', 'Invalid Image', 'Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('warning', 'Image Too Large', 'Please select an image smaller than 5 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(reader.result as string);
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

    updateIndustryProfile({
      organization_name: orgName,
      sector,
      district,
      website,
      description,
      ...(profileImage ? { logo_url: profileImage } : { logo_url: undefined }),
    } as any);

    setIsEditing(false);

    showToast(
      'success',
      'Profile Updated',
      'Organization profile details have been saved successfully.'
    );
  };

  const handleCancel = () => {
    setOrgName(activeIndustry.organization_name);
    setSector(activeIndustry.sector);
    setDistrict(activeIndustry.district);
    setWebsite(activeIndustry.website || 'https://www.tatasteel.com');
    setDescription(
      activeIndustry.description ||
        'Leading steel, metallurgy, and industrial materials conglomerate with dedicated engineering innovation centers in Jamshedpur and tribal CSR outreach across Jharkhand.'
    );
    setProfileImage((activeIndustry as any).logo_url || null);

    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans-body">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            Industry Account
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Organization Profile
          </h1>

          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Manage your registered organization details, verification status,
            and industry capability information.
          </p>
        </div>

        {canEdit && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 px-6 py-7 sm:px-8 sm:py-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full border-[30px] border-emerald-300" />
            <div className="absolute right-20 -bottom-28 w-56 h-56 rounded-full border-[24px] border-teal-300" />
          </div>

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Organization Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border border-white/20 shadow-lg overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${activeIndustry.organization_name} profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-10 h-10 sm:w-11 sm:h-11 text-emerald-300" />
                )}
              </div>

              {isEditing && canEdit && (
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 rounded-lg bg-white text-emerald-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Change profile image"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {profileImage && (
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="w-8 h-8 rounded-lg bg-white text-red-600 shadow-md border border-slate-200 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove profile image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Organization Identity */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-200 border border-emerald-300/30 text-[10px] font-bold uppercase tracking-wide">
                  Industry Partner
                </span>

                <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  Verified
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
                {activeIndustry.organization_name}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-emerald-100/80">
                <span>
                  Type: {activeIndustry.organization_type}
                </span>

                <span className="hidden sm:inline text-white/30">•</span>

                <span>
                  Sector: {activeIndustry.sector}
                </span>

                <span className="hidden sm:inline text-white/30">•</span>

                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activeIndustry.district}, {activeIndustry.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-8">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Edit Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Organization Information
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Update your registered organization details.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Organization Name
                    </label>

                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Industry Sector
                    </label>

                    <input
                      type="text"
                      required
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Headquarters District
                    </label>

                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Official Website
                    </label>

                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Organization Overview
                    </label>

                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 leading-relaxed resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Organization Overview */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    About the Organization
                  </h3>

                  <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Registry
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
                  {description}
                </p>
              </div>

              {/* Registry Information */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Registration & Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      Corporate Identity Number
                    </span>

                    <div className="mt-1.5 text-xs font-bold text-slate-800 break-all">
                      L27100MH1907PLC000260
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      Registration Status
                    </span>

                    <div className="mt-1.5 text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified by Dept of Industries
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      Official Web Domain
                    </span>

                    <div className="mt-1.5 text-xs font-bold text-slate-800 truncate">
                      {website}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Capability Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Industry Capability & Facility Matrix
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Registered technical facilities used to match industry capabilities
              with university research proposals.
            </p>
          </div>

          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full w-fit">
            Capability Registry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manufacturing */}
          <CapabilityCard
            icon={<Wrench className="w-4 h-4" />}
            title="Tooling & Manufacturing Facilities"
            items={[
              'SS316 Precision Machining',
              'Sheet Metal Laser Cutting',
              'Custom FRP Moulding',
              'Batch Prototyping',
              'CNC Turning',
            ]}
          />

          {/* Testing */}
          <CapabilityCard
            icon={<ShieldCheck className="w-4 h-4" />}
            title="Certified Laboratory Testing Rigs"
            items={[
              'Hydraulic Burst Rig (15 bar)',
              'Environmental Thermal Chamber',
              'Spectrometry & Heavy Metals Lab',
              'Corrosion Salt Spray Testing',
            ]}
          />

          {/* CSR */}
          <CapabilityCard
            icon={<HeartHandshake className="w-4 h-4" />}
            title="CSR Thematic Priorities"
            items={[
              'Rural Drinking Water Security',
              'Clean Air in Mining Corridors',
              'Tribal Livelihoods',
              'Maternal & Child Health',
            ]}
          />

          {/* Mentorship */}
          <CapabilityCard
            icon={<Cpu className="w-4 h-4" />}
            title="Technical Mentorship Specialties"
            items={[
              'Design For Manufacturing (DFM)',
              'Hydraulic Engineering',
              'Embedded IoT & Solar Power',
              'BIS Standard Compliance',
            ]}
          />
        </div>
      </div>
    </div>
  );
};

interface CapabilityCardProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

const CapabilityCard: React.FC<CapabilityCardProps> = ({
  icon,
  title,
  items,
}) => {
  return (
    <div className="group p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-bold text-slate-900 leading-relaxed">
            {title}
          </h4>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {items.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-700 font-medium leading-tight"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

