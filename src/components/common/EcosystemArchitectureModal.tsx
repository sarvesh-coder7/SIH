import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Layers,
  Users,
  GraduationCap,
  Briefcase,
  Landmark,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Search,
  Zap,
} from 'lucide-react';

interface EcosystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcosystemArchitectureModal: React.FC<EcosystemArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { challenges, selectedChallengeId, setSelectedChallengeId, navigateToChallenge } = useApp();
  const [activeTab, setActiveTab] = useState<'architecture' | 'record-lifecycle'>('architecture');

  if (!isOpen) return null;

  const currentChallenge =
    challenges.find((c) => c.id === selectedChallengeId) ||
    challenges.find((c) => c.id === 'JH-2026-0042') ||
    challenges[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 text-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                Unified Ecosystem Core
              </span>
              <span className="text-xs text-slate-400 font-mono">
                JH Innovation Connect Architecture
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              4-Pillar Collaborative Platform Engine
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mt-0.5">
              &ldquo;One single Challenge record travels seamlessly through the entire ecosystem rather than turning into four disconnected silos.&rdquo;
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-1 border-b border-slate-800 flex gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`pb-2 transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pillar Architecture (Visual Tree)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('record-lifecycle')}
            className={`pb-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'record-lifecycle'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Live Challenge Record Traveler</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">
              {currentChallenge.id}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'architecture' ? (
            <div className="space-y-6">
              {/* Architecture Tree Diagram */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-xs font-black tracking-wider uppercase shadow-md">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>JH INNOVATION CONNECT PLATFORM</span>
                </div>

                {/* Vertical Trunk */}
                <div className="w-0.5 h-6 bg-slate-700 mx-auto my-1"></div>

                {/* Horizontal Branch Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <div className="h-0.5 bg-slate-700 w-full"></div>

                  {/* 3 Top Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                    {/* Citizen Pillar */}
                    <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-left space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-300 block tracking-wide">
                          CITIZEN
                        </span>
                        <span className="text-[11px] text-emerald-100/90 font-medium">
                          Reports Ground Problems
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Ground truth data, photo/spectrometry evidence, Gram Sabha endorsement, voice notes in tribal dialects.
                      </p>
                    </div>

                    {/* University Pillar */}
                    <div className="bg-blue-950/40 border border-blue-500/40 p-4 rounded-xl text-left space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-blue-300 block tracking-wide">
                          UNIVERSITY
                        </span>
                        <span className="text-[11px] text-blue-100/90 font-medium">
                          Discovers Challenges & R&D
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Multidisciplinary labs, student capstone cohorts, patent development, public failure lessons preserved.
                      </p>
                    </div>

                    {/* Industry Pillar */}
                    <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl text-left space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-300 block tracking-wide">
                          INDUSTRY / CSR
                        </span>
                        <span className="text-[11px] text-amber-100/90 font-medium">
                          Supports & Co-funds
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        CSR seed funding (Tata Trusts, BCCL, SAIL), pilot testbeds, industrial mentorship, supply-chain scaling.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Convergence to Government */}
                <div className="w-0.5 h-6 bg-slate-700 mx-auto my-1"></div>
                <div className="flex justify-center">
                  <div className="max-w-md w-full bg-purple-950/40 border border-purple-500/40 p-4 rounded-xl text-center space-y-1.5 shadow-lg">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-purple-300 block tracking-wide">
                      GOVERNMENT (State PMU / JSHEC)
                    </span>
                    <span className="text-[11px] text-purple-200 font-medium block">
                      Monitors / Officially Assigns / Verifies / Scales Statewide
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Evaluates Initial Approaches, issues official Assignment decrees, releases R&D tranche disbursements, and adopts successful patents into statewide schemes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Principle Callout */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-white block">
                    The Single Unified Record Advantage:
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Rather than a citizen filing a grievance in one portal, a university applying in another grant portal, and an industry partner writing independent CSR checks, <strong>the exact same challenge ID travels through each phase</strong>. Verification, failure lessons, IP milestones, and field telemetry stay attached to the challenge indefinitely.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Live Record Lifecycle Traveler */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    ACTIVE TRAVEL RECORD: {currentChallenge.id}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    Status: {currentChallenge.status}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {currentChallenge.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {currentChallenge.description}
                </p>
              </div>

              {/* Step-by-Step Travel Track */}
              <div className="space-y-3">
                {/* Stage 1: Citizen */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-emerald-300 block">
                      Citizen Ingestion (Field Truth)
                    </span>
                    <p className="text-slate-300">
                      Reported by {currentChallenge.submittedBy.userName} ({currentChallenge.submittedBy.organization || 'Gram Sabha'}). Evidence attached: PHED water testing lab certificate.
                    </p>
                  </div>
                </div>

                {/* Stage 2: Discovery & Matching */}
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-blue-300 block">
                      University Discovery: Status OPEN FOR SOLUTIONS
                    </span>
                    <p className="text-slate-300">
                      Broadcasted to all universities: BIT Mesra 👁, IIT ISM 👁, NIT Jamshedpur 👁, BAU 👁. Prior attempt failure analyses unlocked for public review.
                    </p>
                  </div>
                </div>

                {/* Stage 3: Expression of Interest */}
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-indigo-300 block">
                      University Expression of Interest & Initial Approach
                    </span>
                    <p className="text-slate-300">
                      University submits proposed technical approach. Challenge is placed &ldquo;Under Review&rdquo;. University does not own the challenge yet.
                    </p>
                  </div>
                </div>

                {/* Stage 4: Government Official Assignment */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-purple-300 block">
                      Government Official Assignment & Tranche Release
                    </span>
                    <p className="text-slate-300">
                      State PMU sanctions Official Attempt #1. Project Workspace unlocked with multidisciplinary lab cohort, industry mentors, and CSR co-funding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            JH Innovation Connect &bull; Government of Jharkhand Initiative
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
