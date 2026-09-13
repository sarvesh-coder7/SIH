import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { JharkhandEmblem } from '../common/JharkhandEmblem';
import assemblyHeroImg from '../../assets/images/jharkhand_assembly_1788342750288.jpg';
import { authService } from '../../services/authService';
import {
  Users,
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  X,
} from 'lucide-react';

interface RoleCardData {
  id: 'citizen' | 'university' | 'industry' | 'government';
  role: UserRole;
  title: string;
  subtitle: string;
  position: 'top' | 'left' | 'right' | 'bottom';
  icon: React.ComponentType<{ className?: string }>;
  color: {
    accent: string;
    border: string;
    bg: string;
    iconBg: string;
    iconColor: string;
    nodeColor: string;
    ring: string;
    button: string;
  };
  demoAccount: {
    name: string;
    email: string;
    org: string;
    desc: string;
  };
  targetView: string;
}

const FOUR_ROLES: RoleCardData[] = [
  {
    id: 'citizen',
    role: 'citizen',
    title: 'Citizen',
    subtitle: 'Report issues and contribute to change',
    position: 'top',
    icon: Users,
    color: {
      accent: 'text-amber-700',
      border: 'border-amber-400',
      bg: 'bg-amber-50/80 hover:bg-amber-50',
      iconBg: 'bg-amber-500 text-white',
      iconColor: 'text-amber-600',
      nodeColor: 'bg-amber-500 ring-amber-300',
      ring: 'ring-4 ring-amber-400/40 border-amber-500 shadow-amber-200/50',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    demoAccount: {
      name: 'Sunita Devi (Citizen, Khunti)',
      email: 'sunita.devi@jhcitizen.in',
      org: 'Gram Panchayat Diyakel, Khunti',
      desc: 'Grassroots community reporter for drinking water & agro issues',
    },
    targetView: 'citizen-dashboard',
  },
  {
    id: 'university',
    role: 'university_admin',
    title: 'University',
    subtitle: 'Research, innovate and develop solutions',
    position: 'left',
    icon: GraduationCap,
    color: {
      accent: 'text-emerald-800',
      border: 'border-emerald-400',
      bg: 'bg-emerald-50/80 hover:bg-emerald-50',
      iconBg: 'bg-emerald-600 text-white',
      iconColor: 'text-emerald-600',
      nodeColor: 'bg-emerald-500 ring-emerald-300',
      ring: 'ring-4 ring-emerald-500/40 border-emerald-600 shadow-emerald-200/50',
      button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
    demoAccount: {
      name: 'AIIMS Deoghar (University Admin)',
      email: 'U-1057',
      org: 'All India Institute of Medical Science Deoghar',
      desc: 'Dean of Research & Innovation; AISHE Code: U-1057',
    },
    targetView: 'university-dashboard',
  },
  {
    id: 'industry',
    role: 'csr_org',
    title: 'Industry',
    subtitle: 'Collaborate, support and drive innovation',
    position: 'right',
    icon: Building2,
    color: {
      accent: 'text-blue-800',
      border: 'border-blue-400',
      bg: 'bg-blue-50/80 hover:bg-blue-50',
      iconBg: 'bg-blue-600 text-white',
      iconColor: 'text-blue-600',
      nodeColor: 'bg-blue-500 ring-blue-300',
      ring: 'ring-4 ring-blue-500/40 border-blue-600 shadow-blue-200/50',
      button: 'bg-blue-700 hover:bg-blue-800 text-white',
    },
    demoAccount: {
      name: 'Vikram Sengupta (Tata Steel CSR)',
      email: 'C0001',
      org: 'Tata Steel Rural Development Society (TSRDS)',
      desc: 'CSR Sponsor & Industrial Partner; Organization Code: C0001',
    },
    targetView: 'industry-dashboard',
  },
  {
    id: 'government',
    role: 'govt_department',
    title: 'Government',
    subtitle: 'Enable, monitor and create impact',
    position: 'bottom',
    icon: Landmark,
    color: {
      accent: 'text-purple-800',
      border: 'border-purple-400',
      bg: 'bg-purple-50/80 hover:bg-purple-50',
      iconBg: 'bg-purple-600 text-white',
      iconColor: 'text-purple-600',
      nodeColor: 'bg-purple-500 ring-purple-300',
      ring: 'ring-4 ring-purple-500/40 border-purple-600 shadow-purple-200/50',
      button: 'bg-purple-700 hover:bg-purple-800 text-white',
    },
    demoAccount: {
      name: 'Dr. Vivek H. Topno, IAS',
      email: 'G0001',
      org: 'Dept of Higher & Technical Education (DHTE)',
      desc: 'Special Secretary & State PMU Nodal Officer; Officer ID: G0001',
    },
    targetView: 'government-dashboard',
  },
];

export const RoleSelectionPage: React.FC = () => {
  const { switchRole, setCurrentView, showToast, setCurrentUser } = useApp();

  // Selected active role in the 4-way hub
  const [selectedRole, setSelectedRole] = useState<RoleCardData>(FOUR_ROLES[0]);
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Quick Login Form State inside the panel
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectRole = (roleItem: RoleCardData) => {
    setSelectedRole(roleItem);
    setIdentifier('');
    setPassword('');
    setErrorMessage('');
  };

  const handleContinue = () => {
    // Open the tailored login / register panel for the selected role
    setIsAuthPanelOpen(true);
  };

  const handleDirectDashboardAccess = () => {
    switchRole(selectedRole.role);
    showToast(
      'success',
      `${selectedRole.title} Session Active`,
      `Entering ${selectedRole.demoAccount.name} portal.`
    );
    setCurrentView(selectedRole.targetView as any);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.login(identifier, password, selectedRole.role, true);
      setIsLoading(false);

      if (res.success && res.user) {
        setCurrentUser(res.user as any);
        showToast('success', 'Authentication Successful', res.message);
        const target = selectedRole.targetView || (res.user.role === 'citizen' ? 'citizen-dashboard' : 'role-selection');
        setCurrentView(target as any);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#fbf8ee] via-[#f7f2e4] to-[#f2ecdb] text-slate-800 p-6 sm:p-10 lg:p-12 font-sans-body selection:bg-emerald-600 selection:text-white">
      {/* Faint watermark of Jharkhand Vidhan Sabha in background matching Screenshot 2 */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply overflow-hidden">
        <img
          src={assemblyHeroImg}
          alt="Vidhan Sabha Background Watermark"
          className="w-full h-full object-cover object-center filter grayscale contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbf8ee]/90 via-[#f7f2e4]/70 to-[#f2ecdb]/95"></div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (MATCHING SCREENSHOT 2) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pb-5 border-b border-[#e2d6bc]">
        {/* Left Brand */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3.5 cursor-pointer select-none group"
        >
          <JharkhandEmblem size={48} className="ring-2 ring-emerald-700/30 shadow-sm" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-900 leading-tight">
              JH Innovation Connect
            </h1>
            <p className="text-xs text-slate-600 font-serif-quote italic">
              Where Jharkhand&apos;s Challenges Meet Innovation
            </p>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setCurrentView('how-it-works')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-amber-100/60 rounded-xl transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>About the Platform</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('landing')}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/95 hover:bg-white text-slate-800 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTER HEADING (MATCHING SCREENSHOT 2) */}
      {/* ========================================================================= */}
      <div className="relative z-10 text-center max-w-3xl mx-auto my-auto py-4 space-y-2">
        <h2 className="text-3xl sm:text-5xl font-serif-display font-bold text-[#0d5c3a] tracking-tight">
          Welcome to JH Innovation Connect
        </h2>
        <p className="text-sm sm:text-base text-slate-700 font-medium">
          Select your role to access the portal
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. 4-WAY CIRCULAR HUB DIAGRAM (MATCHING SCREENSHOT 2) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto py-4 flex flex-col items-center justify-center">
        {/* Desktop Radial Grid Layout */}
        <div className="relative w-full max-w-2xl h-[460px] hidden sm:flex items-center justify-center">
          {/* Circular Orbit Ring connecting the 4 roles */}
          <div className="absolute w-[360px] h-[360px] rounded-full border-2 border-dashed border-amber-400/80 bg-white/20 backdrop-blur-xs flex items-center justify-center pointer-events-none">
            {/* Subtle Inner Glow Ring */}
            <div className="w-[300px] h-[300px] rounded-full border border-amber-300/40"></div>
          </div>

          {/* Central Hub Circle: "One Platform. Endless Possibilities." */}
          <div className="relative z-20 w-44 h-44 rounded-full bg-white shadow-xl border-2 border-amber-300 p-3 flex flex-col items-center justify-center text-center space-y-1 select-none">
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-0.5 shadow-2xs">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              One Platform.
            </span>
            <span className="text-[11px] text-slate-700 font-medium leading-tight">
              Endless Possibilities.
            </span>
          </div>

          {/* TOP CARD: Citizen */}
          {(() => {
            const cit = FOUR_ROLES[0];
            const isSelected = selectedRole.id === cit.id;
            const Icon = cit.icon;
            return (
              <div
                onClick={() => handleSelectRole(cit)}
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-white border-2 cursor-pointer transition-all duration-200 z-30 shadow-md flex items-center gap-3 ${
                  isSelected
                    ? `${cit.color.ring} bg-amber-50/90 scale-105`
                    : 'border-amber-300 hover:border-amber-400 hover:shadow-lg'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${cit.color.iconBg} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-amber-900">{cit.title}</h3>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{cit.subtitle}</p>
                </div>
                {/* Node Connector at bottom */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-xs"></div>
              </div>
            );
          })()}

          {/* LEFT CARD: University */}
          {(() => {
            const uni = FOUR_ROLES[1];
            const isSelected = selectedRole.id === uni.id;
            const Icon = uni.icon;
            return (
              <div
                onClick={() => handleSelectRole(uni)}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-64 p-3.5 rounded-2xl bg-white border-2 cursor-pointer transition-all duration-200 z-30 shadow-md flex items-center gap-3 ${
                  isSelected
                    ? `${uni.color.ring} bg-emerald-50/90 scale-105`
                    : 'border-emerald-300 hover:border-emerald-400 hover:shadow-lg'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${uni.color.iconBg} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-900">{uni.title}</h3>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{uni.subtitle}</p>
                </div>
                {/* Node Connector on right */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></div>
              </div>
            );
          })()}

          {/* RIGHT CARD: Industry */}
          {(() => {
            const ind = FOUR_ROLES[2];
            const isSelected = selectedRole.id === ind.id;
            const Icon = ind.icon;
            return (
              <div
                onClick={() => handleSelectRole(ind)}
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-64 p-3.5 rounded-2xl bg-white border-2 cursor-pointer transition-all duration-200 z-30 shadow-md flex items-center gap-3 ${
                  isSelected
                    ? `${ind.color.ring} bg-blue-50/90 scale-105`
                    : 'border-blue-300 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${ind.color.iconBg} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-blue-900">{ind.title}</h3>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>}
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{ind.subtitle}</p>
                </div>
                {/* Node Connector on left */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-xs"></div>
              </div>
            );
          })()}

          {/* BOTTOM CARD: Government */}
          {(() => {
            const gov = FOUR_ROLES[3];
            const isSelected = selectedRole.id === gov.id;
            const Icon = gov.icon;
            return (
              <div
                onClick={() => handleSelectRole(gov)}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-white border-2 cursor-pointer transition-all duration-200 z-30 shadow-md flex items-center gap-3 ${
                  isSelected
                    ? `${gov.color.ring} bg-purple-50/90 scale-105`
                    : 'border-purple-300 hover:border-purple-400 hover:shadow-lg'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${gov.color.iconBg} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-purple-900">{gov.title}</h3>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>}
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{gov.subtitle}</p>
                </div>
                {/* Node Connector at top */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white shadow-xs"></div>
              </div>
            );
          })()}
        </div>

        {/* Mobile Responsive Vertical Cards Grid */}
        <div className="sm:hidden w-full space-y-3">
          <div className="p-3 bg-white/90 rounded-xl border border-amber-300 text-center mb-3">
            <span className="text-xs font-bold text-slate-900 block">One Platform. Endless Possibilities.</span>
            <span className="text-[10px] text-slate-600">Tap your stakeholder role to enter:</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {FOUR_ROLES.map((roleItem) => {
              const isSelected = selectedRole.id === roleItem.id;
              const Icon = roleItem.icon;
              return (
                <div
                  key={roleItem.id}
                  onClick={() => handleSelectRole(roleItem)}
                  className={`p-3.5 rounded-xl bg-white border-2 flex items-center gap-3 cursor-pointer shadow-xs transition-all ${
                    isSelected
                      ? `${roleItem.color.ring} bg-amber-50`
                      : 'border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${roleItem.color.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-xs font-bold text-slate-900">{roleItem.title}</h4>
                    <p className="text-[10px] text-slate-600">{roleItem.subtitle}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM TRUST FOOTER & CONTINUE BUTTON (MATCHING SCREENSHOT 2) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full text-center space-y-4 pt-2 border-t border-[#e2d6bc]/80">
        {/* Shield Trust Note */}
        <div className="flex flex-col items-center justify-center gap-1 max-w-lg mx-auto">
          <div className="flex items-center gap-2 text-xs font-serif-quote italic font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Secure. Trusted. Collaborative.</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Your role helps build a better Jharkhand through innovation and collaboration.
          </p>
        </div>

        {/* Selected Role Quick Status & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto min-w-[260px] py-3.5 px-8 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue as {selectedRole.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Instant Evaluation Demo Bypass for Judges */}
          <button
            type="button"
            onClick={handleDirectDashboardAccess}
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Demo Fast-Pass ({selectedRole.demoAccount.name.split('(')[0].trim()})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ROLE LOGIN / SIGNUP MODAL / DRAWER (INTERACTIVE AUTH) */}
      {/* ========================================================================= */}
      {isAuthPanelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Top Banner */}
            <div className={`p-6 text-white relative overflow-hidden bg-slate-900 border-b border-slate-800`}>
              <button
                type="button"
                onClick={() => setIsAuthPanelOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedRole.color.iconBg} shadow-sm`}>
                  {React.createElement(selectedRole.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedRole.title} Authentication
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {selectedRole.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Fast Evaluation Pre-Fill Box */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-900 block">Jury Evaluation Account</span>
                  <span className="text-[11px] text-slate-600 block">{selectedRole.demoAccount.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedRole.demoAccount.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier(selectedRole.demoAccount.email);
                    setPassword('••••••••••••');
                    setErrorMessage('');
                    showToast('info', 'Demo Loaded', `Using credentials for ${selectedRole.demoAccount.name}`);
                  }}
                  className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-[10px] shrink-0"
                >
                  Load Demo
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole.id === 'citizen'
                      ? 'Mobile / Email'
                      : selectedRole.id === 'university'
                      ? 'AISHE Code'
                      : selectedRole.id === 'industry'
                      ? 'Industry / Organization Code'
                      : selectedRole.id === 'government'
                      ? 'Officer ID'
                      : 'Login ID'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        selectedRole.id === 'citizen'
                          ? 'e.g. 9835144210 or citizen@jharkhand.in'
                          : selectedRole.id === 'university'
                          ? 'e.g. U-1057'
                          : selectedRole.id === 'industry'
                          ? 'e.g. C0001 or I0001'
                          : selectedRole.id === 'government'
                          ? 'e.g. G0001'
                          : selectedRole.demoAccount.email
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <span className="text-[10px] text-slate-500">Default: any password</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                      }}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 z-10 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${selectedRole.color.button}`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isLoading ? 'Verifying...' : `Login as ${selectedRole.title}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectDashboardAccess}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all text-center cursor-pointer"
                  >
                    Instant Direct Access (Bypass Login)
                  </button>
                </div>
              </form>

              {/* Toggle to Signup */}
              {selectedRole.id === 'citizen' ? (
                <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-600">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthPanelOpen(false);
                      switchRole(selectedRole.role);
                      setCurrentView('signup' as any);
                    }}
                    className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                  >
                    Register as {selectedRole.title}
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-500">
                  {selectedRole.title} accounts are pre-provisioned by JSHEC Administration.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
