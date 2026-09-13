import React from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types/auth';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface ConcurrentMultiUserSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConcurrentMultiUserSwitcher: React.FC<ConcurrentMultiUserSwitcherProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, setCurrentUser, switchRole, showToast } = useApp();
  const allUsers = authService.getAllUsers();

  if (!isOpen) return null;

  const handleSelectUser = (user: AuthUser) => {
    const switched = authService.switchUser(user.id);
    if (switched) {
      setCurrentUser(switched as any);
      switchRole(switched.role);
      showToast(
        'info',
        `Switched Session: ${switched.name}`,
        `Now viewing dashboard as ${switched.name} (${switched.role.replace('_', ' ').toUpperCase()}). Data is isolated to this user ID.`
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#e2d6bc] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#0d5c3a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 font-bold border border-white/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Concurrent Multi-User Sandbox</h3>
                <span className="text-[10px] bg-white/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-white/30">
                  Isolated Sessions
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                Test concurrent role workflows without global state collision
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Banner */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Phase 1 Multi-User Architecture:</strong> Each simulated user holds an independent account ID, session token, role permissions, and dataset. Switch between profiles to verify that Citizen A only sees their own submissions, University A sees their allocated research challenges, and Government officers see state-level analytics.
          </div>
        </div>

        {/* User List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-[#e2d6bc]/50 space-y-2">
          {allUsers.map((user) => {
            const isCurrent = currentUser.id === user.id;

            return (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-[#e2d6bc] hover:border-slate-300 hover:bg-[#fbf8ee]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0d5c3a] text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-emerald-200">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{user.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded capitalize bg-[#fbf8ee] text-slate-700 border border-[#e2d6bc]">
                        {user.role.replace('_', ' ')}
                      </span>
                      {user.isEmailVerified && (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {user.designation || user.organization || user.district} &bull; <span className="font-mono text-[10px]">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCurrent ? (
                    <span className="px-2.5 py-1 bg-[#0d5c3a] text-white text-[11px] font-bold rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Session</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-white hover:bg-[#fbf8ee] text-slate-800 text-xs font-semibold rounded-lg border border-[#e2d6bc] transition-colors flex items-center gap-1"
                    >
                      <span>Switch</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#fbf8ee] border-t border-[#e2d6bc] text-center text-xs text-slate-500">
          Ready for Supabase Auth & PostgreSQL Row-Level Security (RLS) connection.
        </div>
      </div>
    </div>
  );
};
