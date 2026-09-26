import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';
import { SIX_ROLES } from '../common/RoleCarousel';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  KeyRound,
  AlertCircle,
  X,
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
  const {
    currentRole,
    setCurrentView,
    showToast,
    setCurrentUser,
  } = useApp();

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
      setErrorMessage(
        'Please enter your email address or mobile number.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.login(
        identifier,
        password,
        roleConfig.role,
        rememberMe
      );

      setIsLoading(false);

      if (res.success && res.user) {
        setCurrentUser(res.user as any);

        showToast(
          'success',
          'Authentication Successful',
          res.message
        );

        const target =
          roleConfig.targetView ||
          (res.user.role === 'citizen'
            ? 'citizen-dashboard'
            : 'role-selection');

        setCurrentView(target as any);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(
        err?.message ||
          'Authentication error. Please try again.'
      );
    }
  };

  const IconComp = roleConfig.icon;

  /*
   * Role-specific theme.
   * Citizen      → Orange
   * University   → Green
   * Industry     → Blue
   * Government   → Purple
   */
  const isCitizen = roleConfig.role === 'citizen';

  const isUniversity =
    roleConfig.role === 'university_admin' ||
    roleConfig.role === 'faculty_mentor';

  const isIndustry =
    roleConfig.role === 'csr_org' ||
    roleConfig.role === 'industry_msme';

  const theme = isCitizen
    ? {
        header: 'bg-amber-600',
        headerHover: 'hover:bg-amber-700',
        iconBg: 'bg-white/15 border-white/20',
        softBg: 'bg-amber-50',
        softBorder: 'border-amber-200',
        softText: 'text-amber-900',
        accent: 'text-amber-700',
        accentHover: 'hover:text-amber-900',
        focus:
          'focus:ring-amber-500 focus:border-amber-500',
        button: 'bg-amber-600 hover:bg-amber-700',
        checkbox: 'text-amber-600 focus:ring-amber-500',
      }
    : isUniversity
      ? {
          header: 'bg-emerald-600',
          headerHover: 'hover:bg-emerald-700',
          iconBg: 'bg-white/15 border-white/20',
          softBg: 'bg-emerald-50',
          softBorder: 'border-emerald-200',
          softText: 'text-emerald-900',
          accent: 'text-emerald-700',
          accentHover: 'hover:text-emerald-900',
          focus:
            'focus:ring-emerald-500 focus:border-emerald-500',
          button: 'bg-emerald-600 hover:bg-emerald-700',
          checkbox: 'text-emerald-600 focus:ring-emerald-500',
        }
      : isIndustry
        ? {
            header: 'bg-blue-600',
            headerHover: 'hover:bg-blue-700',
            iconBg: 'bg-white/15 border-white/20',
            softBg: 'bg-blue-50',
            softBorder: 'border-blue-200',
            softText: 'text-blue-900',
            accent: 'text-blue-700',
            accentHover: 'hover:text-blue-900',
            focus:
              'focus:ring-blue-500 focus:border-blue-500',
            button: 'bg-blue-600 hover:bg-blue-700',
            checkbox: 'text-blue-600 focus:ring-blue-500',
          }
        : {
            header: 'bg-purple-600',
            headerHover: 'hover:bg-purple-700',
            iconBg: 'bg-white/15 border-white/20',
            softBg: 'bg-purple-50',
            softBorder: 'border-purple-200',
            softText: 'text-purple-900',
            accent: 'text-purple-700',
            accentHover: 'hover:text-purple-900',
            focus:
              'focus:ring-purple-500 focus:border-purple-500',
            button: 'bg-purple-600 hover:bg-purple-700',
            checkbox: 'text-purple-600 focus:ring-purple-500',
          };

  const identifierLabel =
    roleConfig.role === 'citizen'
      ? 'Mobile Number or Email Address'
      : roleConfig.role === 'university_admin' ||
          roleConfig.role === 'faculty_mentor'
        ? 'AISHE Code'
        : roleConfig.role === 'csr_org' ||
            roleConfig.role === 'industry_msme'
          ? 'Industry / Organization Code'
          : roleConfig.role === 'govt_department'
            ? 'Officer ID'
            : 'Login ID / Code';

  const identifierPlaceholder =
    roleConfig.role === 'citizen'
      ? 'e.g. 9835144210 or citizen@jharkhand.in'
      : roleConfig.role === 'university_admin' ||
          roleConfig.role === 'faculty_mentor'
        ? 'e.g. U-1057'
        : roleConfig.role === 'csr_org' ||
            roleConfig.role === 'industry_msme'
          ? 'e.g. C0001'
          : roleConfig.role === 'govt_department'
            ? 'e.g. G0001'
            : 'Enter Code / ID';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Compact Role Header */}
          <div
            className={`p-5 sm:p-6 text-white relative overflow-hidden ${theme.header}`}
          >
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />

            <button
              type="button"
              onClick={() => {
                if (onNavigateToRoleSelection) {
                  onNavigateToRoleSelection();
                } else {
                  setCurrentView('role-selection');
                }
              }}
              className="absolute right-4 top-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors z-20"
              aria-label="Close login"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${theme.iconBg}`}
              >
                <IconComp className="w-6 h-6 text-white" />
              </div>

              <div className="min-w-0 pr-7">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {roleConfig.name} Authentication
                </h2>

                <p className="text-[11px] text-white/85 mt-0.5 leading-snug">
                  {roleConfig.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Information */}
            <div
              className={`p-3 rounded-xl border text-[11px] ${theme.softBg} ${theme.softBorder} ${theme.softText}`}
            >
              Sign in with the credentials registered in
              Supabase Auth.
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  {errorMessage}
                </div>
              </div>
            )}

            <form
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
              {/* Identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {identifierLabel}
                </label>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);

                      if (errorMessage) {
                        setErrorMessage('');
                      }
                    }}
                    placeholder={identifierPlaceholder}
                    className={`w-full pl-10 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 transition-all focus:outline-none focus:ring-2 ${theme.focus}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setIsForgotModalOpen(true)
                    }
                    className={`text-[11px] font-semibold transition-colors ${theme.accent} ${theme.accentHover}`}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

                  <input
                    type={
                      showPassword ? 'text' : 'password'
                    }
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (errorMessage) {
                        setErrorMessage('');
                      }
                    }}
                    placeholder="Enter your account password"
                    className={`w-full pl-10 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 transition-all focus:outline-none focus:ring-2 ${theme.focus}`}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword((prev) => !prev);
                    }}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Session */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className={`w-4 h-4 rounded border-slate-300 ${theme.checkbox}`}
                />

                <span className="text-[11px] text-slate-600 font-medium">
                  Keep session active on this device
                </span>
              </label>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${theme.button}`}
              >
                <KeyRound className="w-4 h-4" />

                <span>
                  {isLoading
                    ? 'Verifying Credentials...'
                    : `Log In to ${roleConfig.name}`}
                </span>

                {!isLoading && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 text-center space-y-2.5">
              {/* Change Role */}
              <p className="text-[11px] text-slate-600">
                Not a{' '}
                <span className="font-bold text-slate-900">
                  {roleConfig.name}
                </span>{' '}
                account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToRoleSelection) {
                      onNavigateToRoleSelection();
                    } else {
                      setCurrentView('role-selection');
                    }
                  }}
                  className={`font-bold underline cursor-pointer ${theme.accent} ${theme.accentHover}`}
                >
                  Change role
                </button>
              </p>

              {/* Registration / Admin Note */}
              {roleConfig.role !== 'citizen' ? (
                <div
                  className={`p-3 rounded-xl border text-[10px] text-left ${theme.softBg} ${theme.softBorder} ${theme.softText}`}
                >
                  <strong>Administrative Access Note:</strong>{' '}
                  {roleConfig.name} accounts require institutional
                  pre-provisioning from JSHEC. Public registration
                  is restricted for this role.
                </div>
              ) : (
                <div className="text-[11px] text-slate-600 pt-1">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToSignUp) {
                        onNavigateToSignUp();
                      } else {
                        setCurrentView('signup' as any);
                      }
                    }}
                    className={`font-bold underline cursor-pointer ${theme.accent} ${theme.accentHover}`}
                  >
                    Register as {roleConfig.name} →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Forgot Password */}
        <ForgotPasswordModal
          isOpen={isForgotModalOpen}
          onClose={() => setIsForgotModalOpen(false)}
          initialEmail={
            identifier.includes('@') ? identifier : ''
          }
          onSuccess={(msg) => {
            setIsForgotModalOpen(false);

            showToast(
              'success',
              'Password Reset',
              msg
            );
          }}
        />

        {/* Back to Role Selection */}
        <button
          type="button"
          onClick={() => {
            if (onNavigateToRoleSelection) {
              onNavigateToRoleSelection();
            } else {
              setCurrentView('role-selection');
            }
          }}
          className="mt-3 mx-auto flex items-center gap-1.5 text-[11px] font-semibold text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Return to Role Selection
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
