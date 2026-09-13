import React from 'react';
import { ChallengeStatus } from '../../types';
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';

interface LifecycleTimelineProps {
  currentStatus: ChallengeStatus;
  className?: string;
  onSelectStage?: (stage: string) => void;
}

export const LIFECYCLE_STAGES: { status: ChallengeStatus; label: string; description: string }[] = [
  { status: 'Submitted', label: 'Submitted', description: 'Citizen / PRI submits challenge with evidence' },
  { status: 'Under Review', label: 'Under Review', description: 'AI triage & district screening' },
  { status: 'Validated', label: 'Validated', description: 'State Nodal Officer approves challenge' },
  { status: 'University Matching', label: 'Matching HEIs', description: 'AI routes to top Jharkhand universities' },
  { status: 'Assigned', label: 'Assigned', description: 'University accepts and assigns faculty mentor' },
  { status: 'Project Proposed', label: 'Proposal Formed', description: 'Multidisciplinary student team & proposal' },
  { status: 'In Development', label: 'In Development', description: 'Lab prototyping & hardware synthesis' },
  { status: 'Pilot', label: 'Field Pilot', description: 'Village testbed validation & SHG feedback' },
  { status: 'Implemented', label: 'Implemented', description: 'Full community rollout with CSR / Govt' },
  { status: 'Impact Measured', label: 'Impact Measured', description: 'Health / Economic metrics verified' },
];

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({ currentStatus, className = '', onSelectStage }) => {
  const currentIndex = LIFECYCLE_STAGES.findIndex((s) => s.status === currentStatus);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className={`w-full bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Societal Innovation Lifecycle Stage Tracker
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Current Phase:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {LIFECYCLE_STAGES[activeIdx]?.label || currentStatus} ({activeIdx + 1}/{LIFECYCLE_STAGES.length})
          </span>
        </div>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden lg:grid grid-cols-10 gap-1 relative">
        {/* Connecting background track */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-800 z-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
            style={{ width: `${(activeIdx / (LIFECYCLE_STAGES.length - 1)) * 100}%` }}
          ></div>
        </div>

        {LIFECYCLE_STAGES.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isPending = idx > activeIdx;

          return (
            <div
              key={step.status}
              onClick={() => onSelectStage && onSelectStage(step.status)}
              className={`relative z-10 flex flex-col items-center text-center cursor-pointer group ${
                isCurrent ? 'scale-105' : 'opacity-85 hover:opacity-100'
              }`}
            >
              {/* Step Circle Node */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                  isCompleted
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40'
                    : isCurrent
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 animate-pulse font-black'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : idx + 1}
              </div>

              {/* Step Title */}
              <span
                className={`mt-2 text-[11px] font-semibold leading-tight max-w-[85px] transition-colors ${
                  isCurrent
                    ? 'text-amber-300 font-bold'
                    : isCompleted
                    ? 'text-emerald-300'
                    : 'text-slate-500 group-hover:text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet Vertical/Scrollable Stepper */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {LIFECYCLE_STAGES.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={step.status}
              className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isCurrent
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 ring-1 ring-amber-400/30'
                  : isCompleted
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                  : 'bg-slate-800/40 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                {isCompleted ? '✓' : idx + 1}
              </span>
              <span>{step.label}</span>
              {idx < LIFECYCLE_STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600 ml-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
