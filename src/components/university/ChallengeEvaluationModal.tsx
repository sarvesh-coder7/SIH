import React, { useState } from 'react';
import { Challenge } from '../../types';
import { useApp } from '../../context/AppContext';
import { AIAnalysisCard } from '../ai/AIAnalysisCard';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users,
  GraduationCap,
  Sparkles,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface ChallengeEvaluationModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (facultyName: string, notes: string) => void;
}

export const ChallengeEvaluationModal: React.FC<ChallengeEvaluationModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onAccept,
}) => {
  const { showToast } = useApp();
  const [selectedFaculty, setSelectedFaculty] = useState('Dr. Ramesh Kumar Sinha (Chemical & Environmental Engg)');
  const [notes, setNotes] = useState('');
  const [actionType, setActionType] = useState<'accept' | 'clarification' | 'reject'>('accept');

  if (!isOpen) return null;

  const facultyOptions = [
    'Dr. Ramesh Kumar Sinha (Chemical & Environmental Engg - BIT Mesra)',
    'Dr. Meenakshi Soren (Environmental Science - IIT ISM Dhanbad)',
    'Prof. K. K. Sharma (IoT & Embedded Telemetry - NIT Jamshedpur)',
    'Dr. Anita Toppo (Post-Harvest Technology - BAU Kanke)',
    'Dr. S. K. Mahato (Biomedical Signal Processing - BIT Mesra)',
  ];

  const handleAction = () => {
    if (actionType === 'accept') {
      onAccept(selectedFaculty, notes);
      showToast('success', 'Challenge Accepted by University', `Assigned mentor: ${selectedFaculty}. Team formation unlocked.`);
      onClose();
    } else if (actionType === 'clarification') {
      showToast('info', 'Clarification Sent to Citizen', 'Request for additional water test logs dispatched to submitter.');
      onClose();
    } else {
      showToast('warning', 'Challenge Declined', 'Reason submitted to State PMU for alternative HEI re-routing.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#e2d6bc] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0d5c3a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">University Challenge Evaluation</h3>
              <p className="text-xs text-emerald-100">HEI Innovation & Incubation Cell Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Challenge Summary */}
          <div className="p-4 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                {challenge.id} &bull; {challenge.category}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-rose-100 text-rose-800">
                {challenge.urgency} Urgency
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 leading-snug">{challenge.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{challenge.description}</p>
          </div>

          {/* AI Analysis Summary Preview */}
          <AIAnalysisCard analysis={challenge.aiAnalysis} compact={true} />

          {/* Action Choice Tabs */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Select University Institutional Action
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActionType('accept')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  actionType === 'accept'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-[#e2d6bc] text-slate-600 hover:bg-[#fbf8ee]'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Accept Challenge</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('clarification')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  actionType === 'clarification'
                    ? 'bg-amber-50 border-amber-600 text-amber-950 ring-2 ring-amber-500/20'
                    : 'border-[#e2d6bc] text-slate-600 hover:bg-[#fbf8ee]'
                }`}
              >
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span>Request Clarification</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('reject')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  actionType === 'reject'
                    ? 'bg-rose-50 border-rose-600 text-rose-950 ring-2 ring-rose-500/20'
                    : 'border-[#e2d6bc] text-slate-600 hover:bg-[#fbf8ee]'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Decline & Re-route</span>
              </button>
            </div>
          </div>

          {actionType === 'accept' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Assign Lead Faculty Mentor <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#e2d6bc] rounded-xl bg-[#fbf8ee] font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600"
                >
                  {facultyOptions.map((fac) => (
                    <option key={fac} value={fac}>
                      {fac}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Evaluation Review Remarks & Research Intent
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Approved for Capstone R&D under Chemical and IoT Innovation Hub. Mobilizing student team."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#e2d6bc] bg-[#fbf8ee] rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-600"
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fbf8ee] border-t border-[#e2d6bc] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#e2d6bc] rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className="px-6 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Institutional Decision</span>
          </button>
        </div>
      </div>
    </div>
  );
};
