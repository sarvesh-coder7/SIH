import React, { useState } from 'react';
import { X, MailCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types/auth';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onVerified: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  user,
  onVerified,
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setErrorMsg('Please enter the 6-digit code sent to your email.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    const res = await authService.verifyEmail(user.id, user.email, code);
    setIsVerifying(false);

    if (res.success) {
      onVerified();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResend = async () => {
    const success = await authService.generateVerificationCode(user.email);
    if (success) {
      setResendStatus('New 6-digit verification code sent to your email.');
    } else {
      setResendStatus('Failed to send verification code. Please try again.');
    }
    setTimeout(() => setResendStatus(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#e2d6bc] overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#0d5c3a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-amber-300">
              <MailCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Email Address Verification</h3>
              <p className="text-[11px] text-emerald-100">JH Innovation Connect &bull; Security Protocol</p>
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
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            We have sent an authentication verification code to{' '}
            <strong className="text-slate-900 font-bold">{user.email}</strong>. Please enter the 6-digit code below to confirm your account identity.
          </p>
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <span className="font-bold shrink-0">&bull;</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {resendStatus && (
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full text-center font-mono text-xl font-bold tracking-[0.5em] py-3 text-slate-900 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleResend}
                className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-[#e2d6bc] text-slate-700 text-xs font-semibold rounded-xl hover:bg-[#fbf8ee] cursor-pointer"
              >
                Verify Later
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isVerifying ? 'Verifying...' : 'Verify & Activate'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
