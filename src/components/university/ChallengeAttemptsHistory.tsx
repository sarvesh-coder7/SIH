import React, { useState } from 'react';
import { Challenge, ChallengeAttempt } from '../../types';
import {
  History,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Database,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Layers,
  ChevronRight,
  BookOpen,
  Share2,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface ChallengeAttemptsHistoryProps {
  challenge: Challenge;
  onClose?: () => void;
  onOpenWorkspace?: () => void;
}

export const ChallengeAttemptsHistory: React.FC<ChallengeAttemptsHistoryProps> = ({
  challenge,
  onClose,
  onOpenWorkspace,
}) => {
  const attempts: ChallengeAttempt[] = challenge.attemptsHistory || [];
  const [selectedAttemptNum, setSelectedAttemptNum] = useState<number>(
    attempts.length > 0 ? attempts[attempts.length - 1].attemptNumber : 1
  );

  const activeAttempt = attempts.find((a) => a.attemptNumber === selectedAttemptNum) || attempts[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-5 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200 flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-indigo-600" />
              Preserved Knowledge & History Layer
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-bold">{challenge.id}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Multi-Attempt Institutional Knowledge Base
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl">
            The next university doesn&apos;t start from zero. Public lessons, failure analyses, and raw datasets from past attempts are permanently archived to accelerate breakthrough solutions.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-start sm:self-center px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        )}
      </div>

      {/* Visual Architectural Diagram: Repeated Attempts Flow */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Repeated Attempt Lifecycle Architecture
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Ecosystem Knowledge Continuity
          </span>
        </div>

        {/* Tree Diagram */}
        <div className="relative py-2">
          {/* Top Challenge Root */}
          <div className="flex justify-center">
            <div className="bg-indigo-950 border border-indigo-400/50 text-indigo-200 px-4 py-2 rounded-xl text-center shadow-md max-w-sm">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">
                Root Community Challenge
              </span>
              <span className="text-xs font-bold text-white block truncate">
                &ldquo;{challenge.title}&rdquo;
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {challenge.id} &bull; {challenge.district}
              </span>
            </div>
          </div>

          {/* Connecting Trunk */}
          <div className="w-0.5 h-6 bg-indigo-500/40 mx-auto my-1"></div>

          {/* Horizontal Branch Line */}
          <div className="relative max-w-xl mx-auto">
            <div className="h-0.5 bg-indigo-500/40 w-full"></div>

            {/* University Attempts Nodes */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              {attempts.map((att) => {
                const isSelected = att.attemptNumber === selectedAttemptNum;
                const isSuccess = att.outcome === 'SUCCESS';

                return (
                  <button
                    key={att.attemptNumber}
                    type="button"
                    onClick={() => setSelectedAttemptNum(att.attemptNumber)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-900/90 border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg scale-102'
                        : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-300 truncate w-full">
                      {att.universityName.split('(')[0].trim()}
                    </span>
                    <span className="text-xs font-extrabold text-white mt-0.5">
                      Attempt #{att.attemptNumber}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full mt-1.5 uppercase ${
                        isSuccess
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                      }`}
                    >
                      {att.outcome}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Convergence to History Preserved */}
          <div className="w-0.5 h-5 bg-indigo-500/40 mx-auto my-1"></div>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xs">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>HISTORY PRESERVED &rarr; FINAL SCALED SOLUTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Attempt Detailed Breakdown */}
      {activeAttempt && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono">
                  Attempt #{activeAttempt.attemptNumber}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    activeAttempt.outcome === 'SUCCESS'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {activeAttempt.outcome === 'SUCCESS' ? 'Breakthrough Succeeded' : 'Halted / Technical Bottleneck'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeAttempt.startDate} to {activeAttempt.endDate || 'Ongoing'}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {activeAttempt.universityName} &bull; <span className="text-slate-600 font-normal">{activeAttempt.department}</span>
              </h4>
            </div>

            {activeAttempt.outcome === 'SUCCESS' && onOpenWorkspace && (
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
              >
                <span>Open Project Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Technical Approach */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Tested Methodology & Approach
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {activeAttempt.approach}
            </p>
          </div>

          {/* If Failed: Root Cause & Bottleneck Analysis */}
          {activeAttempt.failureReason && (
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Technical Bottleneck & Failure Cause (Why it didn&apos;t scale):</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                {activeAttempt.failureReason}
              </p>
            </div>
          )}

          {/* Public Lessons Learned (The Knowledge Layer) */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Preserved Public Lessons (The Knowledge Core):</span>
            </div>
            <div className="text-xs text-slate-800 space-y-1.5 leading-relaxed whitespace-pre-line bg-white/80 p-3 rounded-lg border border-amber-100 font-sans">
              {activeAttempt.publicLessonsLearned}
            </div>
          </div>

          {/* How Next Attempt Leveraged These Lessons */}
          {activeAttempt.howNextAttemptLeveraged && (
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-950 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>How Subsequent Attempt Built Upon This Foundation:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeAttempt.howNextAttemptLeveraged}
              </p>
            </div>
          )}

          {/* Preserved Research Artifacts & Datasets */}
          {activeAttempt.preservedArtifacts && activeAttempt.preservedArtifacts.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Preserved Research Artifacts, Telemetry & Open Datasets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeAttempt.preservedArtifacts.map((art, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        {art.type === 'dataset' ? (
                          <Database className="w-4 h-4 text-indigo-600" />
                        ) : art.type === 'sensor_log' ? (
                          <Clock className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {art.title}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {art.type.toUpperCase()} &bull; {art.size}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading archived artifact: ${art.title}`)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Download Preserved Dataset"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
