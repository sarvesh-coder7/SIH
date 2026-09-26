import React, { useState } from 'react';
import { X, MailCheck, ArrowRight, RefreshCw, CheckCircle2, ChevronLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types/auth';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onVerified: () => void;
  asInlineCard?: boolean;
  onBack?: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  user,
  onVerified,
  asInlineCard,
  onBack,
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  if (!isOpen) return null;

  const submitCode = async (codeToSubmit: string) => {
    setIsVerifying(true);
    setErrorMsg('');

    const res = await authService.verifyEmail(user.id, user.email, codeToSubmit);
    setIsVerifying(false);

    if (res.success) {
      onVerified();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setErrorMsg('Please enter the 6-digit code sent to your email.');
      return;
    }
    submitCode(code);
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
    <div className="relative z-20 w-full max-w-[480px] mx-auto animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 flex flex-col justify-center max-h-full">
      <div className="bg-white shadow-xl overflow-hidden overflow-y-auto max-h-[85vh] rounded-[18px] border border-[#D8DEE8]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0B1228] text-white relative overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3.5 top-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#0d5c3a] flex items-center justify-center shadow-md shrink-0 text-white">
              <MailCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                Email Verification
              </h2>
              <p className="text-[11px] text-slate-400 leading-tight">
                JH Innovation Connect &bull; Security Protocol
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            We have sent a verification code to{' '}
            <strong className="text-slate-900 font-bold">{user.email}</strong>. Please enter the 6-digit code below to confirm your account.
          </p>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <span className="font-bold shrink-0">&bull;</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {resendStatus && (
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-800 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#10182D] mb-1">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={code}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                  setCode(pasted);
                  if (pasted.length === 6) {
                    submitCode(pasted);
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(val);
                  if (val.length === 6) {
                    submitCode(val);
                  }
                }}
                placeholder="e.g. 123456"
                className="w-full text-center font-mono text-xl font-bold tracking-[0.5em] py-3 text-slate-900 bg-[#fbf8ee] border border-[#D8DEE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59A00] focus:border-[#F59A00] placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleResend}
                className="text-[#F59A00] hover:text-[#e08a00] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 px-4 bg-[#F59A00] hover:bg-[#FF9800] text-white rounded-lg text-[13px] font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{isVerifying ? 'Verifying...' : 'Verify & Activate'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Registration</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


