import React, { useState } from 'react';
import { X, Mail, KeyRound, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess: (msg: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccess,
}) => {
  const [step, setStep] = useState<'request' | 'verify' | 'completed'>('request');
  const [email, setEmail] = useState(initialEmail);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid official or personal email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await authService.requestPasswordReset(email);
    setIsLoading(false);

    if (res.success) {
      setGeneratedCode(res.resetCode || '123456');
      setStep('verify');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await authService.resetPassword(email, resetCode, newPassword);
    setIsLoading(false);

    if (res.success) {
      setStep('completed');
      onSuccess('Password reset successful. You can now log in with your new password.');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#e2d6bc] overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#0d5c3a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-amber-300">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Reset Account Password</h3>
              <p className="text-[11px] text-emerald-100">JH Innovation Connect &bull; Security Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <span className="font-bold shrink-0">&bull;</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered email address below. We will send a secure verification code to reset your password.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@domain.in"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-[#e2d6bc] text-slate-700 text-xs font-semibold rounded-xl hover:bg-[#fbf8ee]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>{isLoading ? 'Sending...' : 'Send Reset Code'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <p className="font-semibold">Verification code generated for {email}:</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-base font-black text-emerald-800 tracking-wider">
                    {generatedCode}
                  </span>
                  <span className="text-[10px] text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                    Simulated Email Dispatch
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full text-center font-mono text-sm tracking-widest p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {isLoading ? 'Updating...' : 'Set New Password'}
                </button>
              </div>
            </form>
          )}

          {step === 'completed' && (
            <div className="text-center space-y-4 py-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Password Updated Successfully</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your credentials have been securely updated. You may now return to the login screen.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
