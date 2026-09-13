import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectLifecycle } from '../../types';
import {
  TrendingUp,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const IndustryProjectProgressPage: React.FC = () => {
  const {
    projects,
    collaborations,
    setSelectedProjectId,
    setCurrentView,
  } = useApp();

  const [selectedProjectId, setSelectedProjId] = useState<string>(projects[0]?.id || '');
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const stages = [
    { name: 'Research', desc: 'Baseline survey, water quality sampling, adsorption kinetic modeling' },
    { name: 'Development', desc: 'Formulation of biochar and activated alumina media' },
    { name: 'Prototype', desc: 'Assembly of dual-column benchtop unit & solar telemetry breadboard' },
    { name: 'Testing', desc: '48-hour hydraulic pressure burst test and thermal cycling' },
    { name: 'Pilot', desc: 'Field trial across 10 vulnerable village habitations in Torpa block' },
    { name: 'Deployment', desc: 'District-wide handpump attachment rollout' },
    { name: 'Impact', desc: 'Verified reduction in fluoride levels and child dental fluorosis' },
  ];

  const getCurrentStageIndex = (stage: string) => {
    const idx = stages.findIndex((s) => s.name.toLowerCase() === stage.toLowerCase());
    return idx >= 0 ? idx : 2; // Default prototype
  };

  const currentIdx = getCurrentStageIndex(activeProject?.currentStage || 'Prototype');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">State Project Lifecycle Verification</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track stage progression across academic R&D teams. Official stage sign-offs are conducted by state peer review.
          </p>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Stage advancement is certified exclusively by University Faculty & State PMU.</span>
        </div>
      </div>

      {/* Project Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Selected Innovation:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjId(e.target.value)}
            className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 flex-1 sm:w-80"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title || p.proposal?.title || p.challengeTitle} ({p.universityName || p.university?.name || 'Academic Institution'})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedProjectId(activeProject.id);
            setCurrentView('industry-project-detail');
          }}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 self-end sm:self-center"
        >
          View Full Project Dossier
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Timeline Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                Current: {activeProject.currentStage || 'Prototype'} Stage
              </span>
              <span className="text-xs text-slate-400">ID: {activeProject.id}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{activeProject.title || activeProject.proposal?.title || activeProject.challengeTitle}</h2>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Assigned: <strong>{activeProject.universityName || activeProject.university?.name || 'Academic Institution'}</strong></span>
              <span>•</span>
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>District: <strong>{activeProject.district || 'Khunti'}</strong></span>
            </div>
          </div>
        </div>

        {/* 8-Stage Interactive Pipeline */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            8-Stage Innovation Pipeline
          </h3>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {stages.map((st, idx) => {
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const isUpcoming = idx > currentIdx;

                return (
                  <div
                    key={st.name}
                    className={`p-4 rounded-xl border transition text-left flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                        : isCompleted
                        ? 'border-slate-200 bg-slate-50 text-slate-700'
                        : 'border-slate-100 bg-white opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                          Stage {idx + 1}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <Clock className="w-4 h-4 text-emerald-700 animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-900">{st.name}</div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug">{st.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCurrent
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isCompleted ? 'Verified' : isCurrent ? 'Active Now' : 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage Verification Notes */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Independent University Peer Review Process
          </div>
          <p className="text-slate-600 leading-relaxed">
            Transitioning between stages requires peer review by the State Higher Education Technology Evaluation Committee. Industry partners contribute testing data, environmental reports, and manufacturing verification signoffs to support the academic team's dossier.
          </p>
        </div>
      </div>
    </div>
  );
};
