import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModerationRecord } from '../../types/government';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  UserX,
  Compass,
  History,
  Lock,
} from 'lucide-react';

export const GovernmentModerationPage: React.FC = () => {
  const {
    moderationRecords,
    moderateContent,
    challenges,
    projectReports,
    currentGovernmentMember,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [targetType, setTargetType] = useState<'Challenge' | 'Report' | 'Document' | 'User' | 'Project'>('Challenge');
  const [targetId, setTargetId] = useState('');
  const [actionType, setActionType] = useState<ModerationRecord['action']>('Flag');
  const [moderationReason, setModerationReason] = useState('');

  const filteredRecords = moderationRecords.filter((rec) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rec.target_id.toLowerCase().includes(q) ||
        rec.reason.toLowerCase().includes(q) ||
        rec.actor_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExecuteModeration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim() || !moderationReason.trim()) {
      alert('Please fill out the Target ID and the official justification.');
      return;
    }

    moderateContent({
      targetType,
      targetId: targetId.trim(),
      targetTitle: `${targetType} #${targetId.trim()}`,
      action: actionType,
      reason: moderationReason.trim(),
    });
    setTargetId('');
    setModerationReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>State Compliance & Content Integrity</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Platform Moderation & Content Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            State-level authority to flag, quarantine, or restrict inappropriate submissions, reports, or unauthorized accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-rose-50 text-rose-800 px-3 py-2 rounded-xl border border-rose-200">
          <Lock className="w-4 h-4 text-rose-600" />
          <span>Restricted: State Level Clearance Only</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Take Moderation Action */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Execute Content Governance Action
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              All moderation actions are immutably timestamped in the state audit log.
            </p>
          </div>

          <form onSubmit={handleExecuteModeration} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Entity Type *</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Challenge">Grassroots Challenge</option>
                <option value="Report">University Project Report</option>
                <option value="Document">Evidence Document</option>
                <option value="Project">Academic Project</option>
                <option value="User">User Profile</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target ID *</label>
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="e.g. CH-2026-001 or REP-JH-001"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Action Mandate *</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Flag">Flag for Administrative Review</option>
                <option value="Restrict">Restrict Visibility</option>
                <option value="Request Correction">Request Correction</option>
                <option value="Archive">Archive Entity</option>
                <option value="Remove">Remove Entity</option>
                <option value="Review">Mark Reviewed & Cleared</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Official Justification & Policy Reference *
              </label>
              <textarea
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                rows={3}
                placeholder="Provide precise regulatory or compliance reasoning for this action..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Authorize Governance Sanction
            </button>
          </form>
        </div>

        {/* Right List: Moderation History */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-500" />
                <span>State Moderation Audit Log</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Historical record of all content restrictions and compliance actions
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {moderationRecords.length} Actions Logged
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search moderation history..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {filteredRecords.map((rec) => (
              <div key={rec.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{rec.target_id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {rec.target_type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.action === 'Review'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rec.action}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{rec.timestamp}</span>
                </div>

                <div className="text-slate-700 text-[11px] leading-relaxed">
                  <strong>Reason:</strong> {rec.reason}
                </div>

                <div className="text-[10px] text-slate-400">
                  Moderated by: {rec.actor_name}
                </div>
              </div>
            ))}

            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                No moderation records match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
