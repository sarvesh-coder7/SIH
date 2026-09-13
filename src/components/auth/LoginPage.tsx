import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';
import { SIX_ROLES, RoleConfig } from '../common/RoleCarousel';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  Rocket,
} from 'lucide-react';

interface LoginPageProps {
  initialRole?: UserRole;
  onNavigateToSignUp?: () => void;
  onNavigateToRoleSelection?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole,
  onNavigateToSignUp,
  onNavigateToRoleSelection,
}) => {
  const { currentRole, switchRole, setCurrentView, showToast, setCurrentUser } = useApp();

  // Determine active role configuration from SIX_ROLES or fallback to citizen
  const effectiveRole = initialRole || currentRole || 'citizen';
  const roleConfig =
    SIX_ROLES.find((r) => r.role === effectiveRole) ||
    SIX_ROLES.find((r) => r.role === 'citizen') ||
    SIX_ROLES[0];

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email address or mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.login(identifier, password, roleConfig.role, rememberMe);
      setIsLoading(false);

      if (res.success && res.user) {
        // Sync context state directly with authenticated Supabase user
        setCurrentUser(res.user as any);
        showToast('success', 'Authentication Successful', res.message);

        // Direct immediately to tailored dashboard
        const target = roleConfig.targetView || (res.user.role === 'citizen' ? 'citizen-dashboard' : 'role-selection');
        setCurrentView(target as any);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    }
  };

  const IconComp = roleConfig.icon;

  return (
    <div className="w-full max-w-lg mx-auto py-4 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Return to Role Selector */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateToRoleSelection) onNavigateToRoleSelection();
          else setCurrentView('role-selection');
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors py-1 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Return to Role Selection</span>
      </button>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-[#e2d6bc] overflow-hidden">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-7 bg-[#0d5c3a] text-white relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/20 bg-white/10 text-amber-300">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Official Stakeholder Gateway</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {roleConfig.name} Login
              </h2>
              <p className="text-xs text-emerald-100">
                {roleConfig.subtitle} &bull; JH Innovation Connect
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
        <div className="p-6 sm:p-8 space-y-5">
          <div className="p-3.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-2xl text-xs text-slate-600">
            Sign in with the email address and password registered in Supabase Auth.
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Identifier Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {roleConfig.role === 'citizen'
                  ? 'Mobile Number or Email Address'
                  : roleConfig.role === 'university_admin' || roleConfig.role === 'faculty_mentor'
                  ? 'AISHE Code'
                  : roleConfig.role === 'csr_org' || roleConfig.role === 'industry_msme'
                  ? 'Industry / Organization Code'
                  : roleConfig.role === 'govt_department'
                  ? 'Officer ID'
                  : 'Login ID / Code'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={
                    roleConfig.role === 'citizen'
                      ? 'e.g. 9835144210 or citizen@jharkhand.in'
                      : roleConfig.role === 'university_admin' || roleConfig.role === 'faculty_mentor'
                      ? 'e.g. U-1057'
                      : roleConfig.role === 'csr_org'
                      ? 'e.g. C0001'
                      : roleConfig.role === 'industry_msme'
                      ? 'e.g. I0001'
                      : roleConfig.role === 'govt_department'
                      ? 'e.g. G0001'
                      : 'Enter Code / ID'
                  }
                  className="w-full pl-10 pr-4 py-3 text-xs border border-[#e2d6bc] rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-[#fbf8ee] text-slate-900"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-10 py-3 text-xs border border-[#e2d6bc] rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-[#fbf8ee] text-slate-900"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 z-10 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Session Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Keep session active on this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${roleConfig.accentColor.button}`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Verifying Credentials...' : `Log In to ${roleConfig.name}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Change Role Link */}
          <div className="pt-3 border-t border-[#e2d6bc] text-center space-y-2">
            <p className="text-xs text-slate-600">
              Not a <span className="font-bold text-slate-900">{roleConfig.name}</span> account?{' '}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToRoleSelection) onNavigateToRoleSelection();
                  else setCurrentView('role-selection');
                }}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
              >
                Change role
              </button>
            </p>

            {/* Registration Action */}
            {roleConfig.role !== 'citizen' ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 text-left">
                <strong>Administrative Access Note:</strong> {roleConfig.name} accounts require institutional pre-provisioning from JSHEC. Public registration is restricted for this role.
              </div>
            ) : (
              <div className="text-xs text-slate-600 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToSignUp) onNavigateToSignUp();
                    else setCurrentView('signup' as any);
                  }}
                  className="font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  Register as {roleConfig.name} &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={identifier.includes('@') ? identifier : ''}
        onSuccess={(msg) => {
          setIsForgotModalOpen(false);
          showToast('success', 'Password Reset', msg);
        }}
      />
    </div>
  );
};
