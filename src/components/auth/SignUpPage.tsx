import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';
import { SIX_ROLES, RoleConfig } from '../common/RoleCarousel';
import { EmailVerificationModal } from './EmailVerificationModal';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import { AuthUser } from '../../types/auth';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  Rocket,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  MapPin,
  FileCheck2,
  Info,
} from 'lucide-react';

interface SignUpPageProps {
  initialRole?: UserRole;
  onNavigateToLogin?: () => void;
  onNavigateToRoleSelection?: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  initialRole,
  onNavigateToLogin,
  onNavigateToRoleSelection,
}) => {
  const { currentRole, switchRole, setCurrentView, showToast, setCurrentUser } = useApp();

  const effectiveRole = initialRole || currentRole || 'citizen';
  const roleConfig =
    SIX_ROLES.find((r) => r.role === effectiveRole) ||
    SIX_ROLES.find((r) => r.role === 'citizen') ||
    SIX_ROLES[0];

  // Common UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingVerificationUser, setPendingVerificationUser] = useState<AuthUser | null>(null);

  // 1. Citizen Form State
  const [citName, setCitName] = useState('');
  const [citEmail, setCitEmail] = useState('');
  const [citPhone, setCitPhone] = useState('');
  const [citPassword, setCitPassword] = useState('');
  const [citDistrict, setCitDistrict] = useState('Khunti');
  const [citBlock, setCitBlock] = useState('Torpa');
  const [citVillage, setCitVillage] = useState('');

  // 2. University Form State
  const [univName, setUnivName] = useState('');
  const [univShortName, setUnivShortName] = useState('');
  const [univCategory, setUnivCategory] = useState<'State Public University' | 'Institute of National Importance' | 'Deemed University' | 'Private University' | 'Autonomous Engineering College'>('Institute of National Importance');
  const [univDistrict, setUnivDistrict] = useState('Ranchi');
  const [univAddress, setUnivAddress] = useState('');
  const [univEmail, setUnivEmail] = useState('');
  const [univWebsite, setUnivWebsite] = useState('');
  const [univAishe, setUnivAishe] = useState('');
  const [univAccreditation, setUnivAccreditation] = useState('NAAC A++ / NIRF Top 50');
  const [univDisciplines, setUnivDisciplines] = useState<string[]>([
    'Engineering & Technology',
    'Environmental Science',
    'Computer Science & AI',
  ]);
  const [univDepartments, setUnivDepartments] = useState(
    'Civil & Water Hydrology, Chemical Engineering, IoT & Sensors, Rural Development'
  );
  const [univResearchAreas, setUnivResearchAreas] = useState(
    'Arsenic Remediation, Solar Microgrids, Tribal Agrotechnology'
  );
  const [univLabs, setUnivLabs] = useState(
    'Central Instrumentation Facility, IoT & Embedded Systems Lab, Water Quality Testing Lab'
  );
  const [univIncubation, setUnivIncubation] = useState('JSHEC Atal Community Incubation Centre');
  const [univContactName, setUnivContactName] = useState('');
  const [univContactDesig, setUnivContactDesig] = useState('Dean (R&D / Innovation)');
  const [univContactPhone, setUnivContactPhone] = useState('');

  // 3. Faculty Form State
  const [facName, setFacName] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facPhone, setFacPhone] = useState('');
  const [facUniv, setFacUniv] = useState('Birla Institute of Technology (BIT) Mesra');
  const [facDept, setFacDept] = useState('Environmental Science & Engineering');
  const [facDesig, setFacDesig] = useState<'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Dean / HoD' | 'Research Scientist'>('Associate Professor');
  const [facExpertise, setFacExpertise] = useState('Water Quality, Membrane Filtration, IoT Telemetry');
  const [facResearch, setFacResearch] = useState('Heavy metal removal in Subarnarekha river basin, solar water purification');

  // 4. Industry Form State
  const [indName, setIndName] = useState('');
  const [indType, setIndType] = useState<'Public Sector Undertaking (PSU)' | 'Large Enterprise / Corporate' | 'CSR Foundation / Trust' | 'Industry Association (CII/FICCI)'>('Large Enterprise / Corporate');
  const [indEmail, setIndEmail] = useState('');
  const [indContactName, setIndContactName] = useState('');
  const [indContactDesig, setIndContactDesig] = useState('CSR & Innovation Head');
  const [indContactPhone, setIndContactPhone] = useState('');
  const [indDistrict, setIndDistrict] = useState('East Singhbhum (Jamshedpur)');
  const [indDomain, setIndDomain] = useState('Mining, Metallurgy & Rural Infrastructure');
  const [indMaxGrant, setIndMaxGrant] = useState('₹15,00,000 per cohort project');
  const [indSectors, setIndSectors] = useState('Rural Drinking Water, Sustainable Mining, Solar Microgrids');
  const [indTechCaps, setIndTechCaps] = useState('Advanced Metallurgical Testing, Field Pilot Deployments');

  // 5. Startup Form State
  const [startName, setStartName] = useState('');
  const [startType, setStartType] = useState<'DPIIT Recognized Startup' | 'Registered MSME' | 'University Incubatee' | 'Social Enterprise'>('DPIIT Recognized Startup');
  const [startEmail, setStartEmail] = useState('');
  const [startContact, setStartContact] = useState('');
  const [startPhone, setStartPhone] = useState('');
  const [startDistrict, setStartDistrict] = useState('Ranchi');
  const [startDomain, setStartDomain] = useState('Agritech & IoT Sensors');
  const [startDpiit, setStartDpiit] = useState('');
  const [startProducts, setStartProducts] = useState('Low-cost soil moisture and telemetry sensors with LoRaWAN connectivity');
  const [startTechCaps, setStartTechCaps] = useState('Embedded hardware, mobile apps, rapid prototyping');

  // Handle Citizen Submit
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citName.trim() || !citEmail.trim() || !citPhone.trim()) {
      setErrorMessage('Please fill in your Full Name, Email Address, and Phone Number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await authService.registerCitizen({
      fullName: citName,
      email: citEmail,
      phone: citPhone,
      password: citPassword,
      district: citDistrict,
      block: citBlock,
      village: citVillage,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      if (res.requiresVerification) {
        setPendingVerificationUser(res.user as AuthUser);
        showToast('info', 'Verification Required', 'A verification code has been sent to your email.');
      } else {
        setCurrentUser(res.user as any);
        setCurrentView('citizen-dashboard');
        showToast('success', 'Registration Complete', 'Your citizen account is ready to use.');
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  // Handle University Submit
  const handleUniversitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!univName.trim() || !univEmail.trim() || !univContactName.trim()) {
      setErrorMessage('Please provide Institution Name, Official Email, and Contact Representative.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await authService.registerUniversity({
      institutionName: univName,
      shortName: univShortName,
      category: univCategory,
      district: univDistrict,
      address: univAddress,
      officialEmail: univEmail,
      website: univWebsite,
      aisheCode: univAishe,
      accreditationGrade: univAccreditation,
      academicDisciplines: univDisciplines,
      departments: univDepartments.split(',').map((d) => d.trim()),
      researchAreas: univResearchAreas.split(',').map((r) => r.trim()),
      labsAndFacilities: univLabs.split(',').map((l) => l.trim()),
      incubationCentreName: univIncubation,
      authorizedContactPerson: univContactName,
      authorizedContactDesignation: univContactDesig,
      authorizedContactPhone: univContactPhone,
    });

    setIsLoading(false);

    if (res.success) {
      setCurrentUser(res.user as any);
      switchRole('university_admin');
      showToast('success', 'Institutional Onboarding Complete', res.message);
      setCurrentView('university-dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  // Handle Faculty Submit
  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim() || !facEmail.trim()) {
      setErrorMessage('Please provide Faculty Name and Official University Email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await authService.registerFaculty({
      fullName: facName,
      officialEmail: facEmail,
      phone: facPhone,
      universityId: 'univ-custom',
      universityName: facUniv,
      department: facDept,
      designation: facDesig,
      areasOfExpertise: facExpertise.split(',').map((e) => e.trim()),
      researchInterests: facResearch.split(',').map((r) => r.trim()),
    });

    setIsLoading(false);

    if (res.success) {
      setCurrentUser(res.user as any);
      switchRole('faculty_mentor');
      showToast('success', 'Faculty Profile Created', res.message);
      setCurrentView('university-proposals');
    } else {
      setErrorMessage(res.message);
    }
  };

  // Handle Industry Submit
  const handleIndustrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indName.trim() || !indEmail.trim() || !indContactName.trim()) {
      setErrorMessage('Please provide Organization Name, Official Email, and Contact Person.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await authService.registerIndustry({
      organizationName: indName,
      orgType: indType,
      officialEmail: indEmail,
      contactPerson: indContactName,
      contactDesignation: indContactDesig,
      contactPhone: indContactPhone,
      district: indDistrict,
      domain: indDomain,
      expertiseAreas: indDomain.split(',').map((e) => e.trim()),
      fundingCapabilities: {
        maxGrantPerProject: indMaxGrant,
        csrFocusSectors: indSectors.split(',').map((s) => s.trim()),
      },
      technologyCapabilities: indTechCaps.split(',').map((t) => t.trim()),
      mentoringCapabilities: ['Technical Advisory', 'Pilot Validation', 'Scale Support'],
      testingAndDeploymentCapabilities: ['Industrial testing benches', 'Field pilot infrastructure'],
    });

    setIsLoading(false);

    if (res.success) {
      setCurrentUser(res.user as any);
      switchRole('csr_org');
      showToast('success', 'Industry Partner Profile Created', res.message);
      setCurrentView('industry-dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  // Handle Startup Submit
  const handleStartupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startName.trim() || !startEmail.trim() || !startContact.trim()) {
      setErrorMessage('Please provide Startup Name, Official Email, and Founder/Contact Person.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const res = await authService.registerStartup({
      startupName: startName,
      orgType: startType,
      officialEmail: startEmail,
      contactPerson: startContact,
      contactPhone: startPhone,
      district: startDistrict,
      domain: startDomain,
      dpiitNumber: startDpiit,
      productsAndServices: startProducts,
      technicalCapabilities: startTechCaps.split(',').map((t) => t.trim()),
      areasOfInterest: ['University R&D Commercialization', 'Grassroots Technology Deployment'],
    });

    setIsLoading(false);

    if (res.success) {
      setCurrentUser(res.user as any);
      switchRole('industry_msme');
      showToast('success', 'Startup Profile Registered', res.message);
      setCurrentView('industry-dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  const IconComp = roleConfig.icon;

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (onNavigateToRoleSelection) onNavigateToRoleSelection();
            else setCurrentView('role-selection');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors py-1 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Change Role / Back to Carousel</span>
        </button>

        <div className="text-xs text-slate-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              if (onNavigateToLogin) onNavigateToLogin();
              else setCurrentView('login');
            }}
            className="font-bold text-emerald-800 hover:text-emerald-950 underline"
          >
            Log In &rarr;
          </button>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-[#e2d6bc] overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 sm:p-7 bg-[#0d5c3a] text-white relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/20 bg-white/10 text-amber-300">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Role-Specific Stakeholder Registration</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {roleConfig.name} Sign Up
              </h2>
              <p className="text-xs text-emerald-100">
                {roleConfig.subtitle} &bull; Tailored Onboarding Form
              </p>
            </div>

            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${roleConfig.accentColor.iconBg}`}
            >
              <IconComp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 1. CITIZEN REGISTRATION FORM (SIMPLE, NO JARGON) */}
          {/* ==================================================== */}
          {roleConfig.role === 'citizen' && (
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Simple 2-Minute Citizen Registration:</strong> Report local water, agriculture, roads, and community issues directly to Jharkhand universities and line departments.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunita Devi or Ramesh Soren"
                  value={citName}
                  onChange={(e) => setCitName(e.target.value)}
                  className="w-full p-3 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={citEmail}
                    onChange={(e) => setCitEmail(e.target.value)}
                    className="w-full p-3 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    (Email verification code will be sent to activate account)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98351 44210"
                    value={citPhone}
                    onChange={(e) => setCitPhone(e.target.value)}
                    className="w-full p-3 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create a secure password (min 6 characters)"
                  value={citPassword}
                  onChange={(e) => setCitPassword(e.target.value)}
                  className="w-full p-3 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                />
              </div>

              {/* Basic Location */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Your Location in Jharkhand</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      District
                    </label>
                    <select
                      value={citDistrict}
                      onChange={(e) => setCitDistrict(e.target.value)}
                      className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      {JHARKHAND_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Block
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Torpa / Ratu"
                      value={citBlock}
                      onChange={(e) => setCitBlock(e.target.value)}
                      className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Village / Ward (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Diyakel"
                      value={citVillage}
                      onChange={(e) => setCitVillage(e.target.value)}
                      className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isLoading ? 'Creating Account...' : 'Continue to Email Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* 2. UNIVERSITY / HEI REGISTRATION FORM */}
          {/* ==================================================== */}
          {roleConfig.role === 'university_admin' && (
            <form onSubmit={handleUniversitySubmit} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Higher Education Institution Onboarding:</strong> Each university registers its unique disciplines, research areas, and innovation labs to receive relevant Jharkhand societal problem statements.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institution Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Birla Institute of Technology (BIT) Mesra"
                    value={univName}
                    onChange={(e) => setUnivName(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institution Category / Type
                  </label>
                  <select
                    value={univCategory}
                    onChange={(e) => setUnivCategory(e.target.value as any)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Institute of National Importance">Institute of National Importance (IIT/NIT/IIIT)</option>
                    <option value="State Public University">State Public University</option>
                    <option value="Deemed University">Deemed University</option>
                    <option value="Autonomous Engineering College">Autonomous Engineering College</option>
                    <option value="Private University">Private University</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    value={univDistrict}
                    onChange={(e) => setUnivDistrict(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email (.ac.in / .edu.in) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="dean.research@bitmesra.ac.in"
                    value={univEmail}
                    onChange={(e) => setUnivEmail(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://bitmesra.ac.in"
                    value={univWebsite}
                    onChange={(e) => setUnivWebsite(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Unique Academic Capabilities */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  Institutional Capabilities & Research Infrastructure
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Key Departments (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={univDepartments}
                    onChange={(e) => setUnivDepartments(e.target.value)}
                    placeholder="Civil Engg, Chemical Engg, IoT & AI, Environmental Science"
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Specialized Research Areas & Expertise
                  </label>
                  <input
                    type="text"
                    value={univResearchAreas}
                    onChange={(e) => setUnivResearchAreas(e.target.value)}
                    placeholder="Water purification, rural microgrids, mining rehabilitation"
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Innovation Labs & Incubation Facilities
                  </label>
                  <input
                    type="text"
                    value={univLabs}
                    onChange={(e) => setUnivLabs(e.target.value)}
                    placeholder="Central Analytical Facility, Prototype Lab, Incubator"
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Authorized Contact */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Authorized Institutional Representative (Dean / Director / Coordinator)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Contact Person Name *"
                      value={univContactName}
                      onChange={(e) => setUnivContactName(e.target.value)}
                      className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Designation"
                      value={univContactDesig}
                      onChange={(e) => setUnivContactDesig(e.target.value)}
                      className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Official Phone Number"
                      value={univContactPhone}
                      onChange={(e) => setUnivContactPhone(e.target.value)}
                      className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? 'Registering University...' : 'Complete Institutional Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* 3. FACULTY / MENTOR REGISTRATION FORM */}
          {/* ==================================================== */}
          {roleConfig.role === 'faculty_mentor' && (
            <form onSubmit={handleFacultySubmit} className="space-y-4">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Faculty Mentor Access:</strong> Associated with a verified university to mentor student cohorts, review proposals, and guide field research.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name with Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Meenakshi Soren"
                    value={facName}
                    onChange={(e) => setFacName(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Institutional Email (.ac.in) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="meenakshi.soren@iitism.ac.in"
                    value={facEmail}
                    onChange={(e) => setFacEmail(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Affiliated University / HEI
                  </label>
                  <select
                    value={facUniv}
                    onChange={(e) => setFacUniv(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="Birla Institute of Technology (BIT) Mesra">BIT Mesra, Ranchi</option>
                    <option value="IIT (ISM) Dhanbad">IIT (ISM) Dhanbad</option>
                    <option value="National Institute of Technology (NIT) Jamshedpur">NIT Jamshedpur</option>
                    <option value="Ranchi University">Ranchi University</option>
                    <option value="Kolhan University">Kolhan University, Chaibasa</option>
                    <option value="Vinoba Bhave University">Vinoba Bhave University, Hazaribagh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department & Designation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Dept of Chemical Engg"
                      value={facDept}
                      onChange={(e) => setFacDept(e.target.value)}
                      className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                    />
                    <select
                      value={facDesig}
                      onChange={(e) => setFacDesig(e.target.value as any)}
                      className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl"
                    >
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Dean / HoD">Dean / HoD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Areas of Technical Expertise (Comma separated)
                </label>
                <input
                  type="text"
                  value={facExpertise}
                  onChange={(e) => setFacExpertise(e.target.value)}
                  placeholder="Water testing, IoT telemetry, Membrane bioreactors"
                  className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? 'Creating Profile...' : 'Complete Faculty Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* 4. INDUSTRY / CSR PARTNER REGISTRATION FORM */}
          {/* ==================================================== */}
          {roleConfig.role === 'csr_org' && (
            <form onSubmit={handleIndustrySubmit} className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900 flex items-start gap-2">
                <Briefcase className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Industry & CSR Partnership:</strong> Fund university innovation cohorts, provide industrial test benches, and support field deployment across Jharkhand districts.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organization Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Steel / Central Coalfields Ltd / Tata Trusts"
                    value={indName}
                    onChange={(e) => setIndName(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organization Type
                  </label>
                  <select
                    value={indType}
                    onChange={(e) => setIndType(e.target.value as any)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="Large Enterprise / Corporate">Large Enterprise / Corporate</option>
                    <option value="Public Sector Undertaking (PSU)">Public Sector Undertaking (PSU)</option>
                    <option value="CSR Foundation / Trust">CSR Foundation / Trust</option>
                    <option value="Industry Association (CII/FICCI)">Industry Association (CII/FICCI)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Corporate Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="csr@tatasteel.com"
                    value={indEmail}
                    onChange={(e) => setIndEmail(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Authorized Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contact Lead Name"
                    value={indContactName}
                    onChange={(e) => setIndContactName(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jharkhand Base District
                  </label>
                  <select
                    value={indDistrict}
                    onChange={(e) => setIndDistrict(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CSR Grant Capacity / Focus Sectors
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={indMaxGrant}
                    onChange={(e) => setIndMaxGrant(e.target.value)}
                    placeholder="Max Grant Per Project"
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                  <input
                    type="text"
                    value={indSectors}
                    onChange={(e) => setIndSectors(e.target.value)}
                    placeholder="Focus Sectors (Water, Energy, Health)"
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? 'Creating Partner Profile...' : 'Complete Industry Partner Sign Up'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* 5. STARTUP / MSME REGISTRATION FORM */}
          {/* ==================================================== */}
          {roleConfig.role === 'industry_msme' && (
            <form onSubmit={handleStartupSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                <Rocket className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Startup / MSME Innovation Pipeline:</strong> Partner with Jharkhand HEIs to license patents, manufacture student prototypes, and deliver commercial grassroots products.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Startup / Enterprise Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AgroTech Jharkhand Solutions Pvt Ltd"
                    value={startName}
                    onChange={(e) => setStartName(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration Type
                  </label>
                  <select
                    value={startType}
                    onChange={(e) => setStartType(e.target.value as any)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="DPIIT Recognized Startup">DPIIT Recognized Startup</option>
                    <option value="Registered MSME">Registered MSME (Udyam)</option>
                    <option value="University Incubatee">University Incubatee</option>
                    <option value="Social Enterprise">Social Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="founder@agrotechjharkhand.com"
                    value={startEmail}
                    onChange={(e) => setStartEmail(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Founder / Contact Lead
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={startContact}
                    onChange={(e) => setStartContact(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    DPIIT / Udyam Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DIPP-84729"
                    value={startDpiit}
                    onChange={(e) => setStartDpiit(e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Products, Services & Tech Capabilities
                </label>
                <textarea
                  rows={2}
                  value={startProducts}
                  onChange={(e) => setStartProducts(e.target.value)}
                  placeholder="Describe your current hardware/software solutions"
                  className="w-full p-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? 'Registering...' : 'Complete Startup Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* 6. GOVERNMENT / ADMIN: RESTRICTED ACCESS NOTICE */}
          {/* ==================================================== */}
          {(roleConfig.role === 'govt_department' || roleConfig.role === 'platform_admin') && (
            <div className="space-y-5 py-2 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs border border-amber-300">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Government & Administration Accounts Are Restricted
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To ensure state verification integrity, public signup is not permitted for Government Nodal Officers, District Collectorates, or JSHEC PMU Administrators.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 text-left max-w-md mx-auto space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span>How to Gain Government Access:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Accounts are provisioned directly by the JSHEC State PMU via official `.gov.in` credentials.</li>
                  <li>State nodal officers receive an invitation authorization token by Department email.</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToLogin) onNavigateToLogin();
                    else setCurrentView('login');
                  }}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Authorized Officer Login</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Verification Modal triggered after citizen signup */}
      {pendingVerificationUser && (
        <EmailVerificationModal
          isOpen={!!pendingVerificationUser}
          user={pendingVerificationUser}
          onClose={() => {
            setPendingVerificationUser(null);
          }}
          onVerified={() => {
            setPendingVerificationUser(null);
            setCurrentUser(authService.getCurrentUser());
            setCurrentView('citizen-dashboard');
            showToast('success', 'Email Verified', 'Your citizen account has been successfully created and verified.');
          }}
        />
      )}
    </div>
  );
};
