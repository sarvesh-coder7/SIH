import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border flex items-start gap-3 transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'bg-emerald-900/95 text-white border-emerald-700'
                : isInfo
                ? 'bg-slate-900/95 text-white border-slate-700'
                : isWarning
                ? 'bg-amber-900/95 text-white border-amber-700'
                : 'bg-rose-900/95 text-white border-rose-700'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isInfo && <Info className="w-5 h-5 text-sky-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-slate-100">{toast.title}</div>
              <div className="text-slate-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
