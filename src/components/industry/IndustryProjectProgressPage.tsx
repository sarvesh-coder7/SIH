import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
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
    setSelectedProjectId,
    setCurrentView,
  } = useApp();

  const [selectedProjectId, setSelectedProjId] = useState<string>(
    projects[0]?.id || ''
  );

  /*
   * Projects may arrive asynchronously from AppContext.
   * When they become available, automatically select the first project.
   */
  useEffect(() => {
    if (
      projects.length > 0 &&
      (!selectedProjectId ||
        !projects.some((project) => project.id === selectedProjectId))
    ) {
      setSelectedProjId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const activeProject =
    projects.find((project) => project.id === selectedProjectId) ||
    projects[0] ||
    null;

  const stages = [
    {
      name: 'Research',
      desc: 'Baseline survey, water quality sampling, adsorption kinetic modeling',
    },
    {
      name: 'Development',
      desc: 'Formulation of biochar and activated alumina media',
    },
    {
      name: 'Prototype',
      desc: 'Assembly of dual-column benchtop unit & solar telemetry breadboard',
    },
    {
      name: 'Testing',
      desc: '48-hour hydraulic pressure burst test and thermal cycling',
    },
    {
      name: 'Pilot',
      desc: 'Field trial across 10 vulnerable village habitations in Torpa block',
    },
    {
      name: 'Deployment',
      desc: 'District-wide handpump attachment rollout',
    },
    {
      name: 'Impact',
      desc: 'Verified reduction in fluoride levels and child dental fluorosis',
    },
  ];

  const getCurrentStageIndex = (stage?: string) => {
    if (!stage) return 2;

    const normalizedStage = stage.toLowerCase();

    const stageAliases: Record<string, string> = {
      'research & planning': 'research',
      'prototype development': 'prototype',
      'lab & simulation testing': 'testing',
      'field pilot testing': 'pilot',
      'industry co-implementation': 'deployment',
      'technology transfer': 'deployment',
      'social impact measurement': 'impact',
      'project completed': 'impact',
    };

    const mappedStage =
      stageAliases[normalizedStage] || normalizedStage;

    const idx = stages.findIndex(
      (stageItem) => stageItem.name.toLowerCase() === mappedStage
    );

    return idx >= 0 ? idx : 2;
  };

  /*
   * Empty-state protection.
   * Previously the page crashed here when projects = [].
   */
  if (!activeProject) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-50 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                Project Progress
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-3">
                State Project Lifecycle Verification
              </h1>

              <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                Track stage progression across academic R&D teams.
                Official stage sign-offs are conducted through the
                designated peer-review process.
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 max-w-sm">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Stage advancement is certified exclusively by
                University Faculty & State PMU.
              </span>
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-emerald-600" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-5">
              No Projects Available
            </h2>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              There are currently no projects available for lifecycle
              progress tracking. Projects will appear here once they
              are available to the Industry Portal.
            </p>

            <button
              onClick={() => setCurrentView('industry-discovery')}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition"
            >
              Explore Projects
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentIdx = getCurrentStageIndex(activeProject.currentStage);

  const projectTitle =
    activeProject.title ||
    activeProject.proposal?.title ||
    activeProject.challengeTitle ||
    'Untitled Innovation Project';

  const universityName =
    activeProject.universityName ||
    activeProject.university?.name ||
    'Academic Institution';

  const currentStage =
    activeProject.currentStage || 'Prototype';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-50 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              Project Progress
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-3">
              State Project Lifecycle Verification
            </h1>

            <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
              Track stage progression across academic R&D teams.
              Official stage sign-offs are conducted through state
              peer review.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 max-w-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Stage advancement is certified exclusively by
              University Faculty & State PMU.
            </span>
          </div>
        </div>
      </div>

      {/* Project Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Selected Innovation
            </div>

            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjId(e.target.value)}
              className="text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-96"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title ||
                    project.proposal?.title ||
                    project.challengeTitle ||
                    'Untitled Project'}{' '}
                  ({project.universityName ||
                    project.university?.name ||
                    'Academic Institution'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedProjectId(activeProject.id);
              setCurrentView('industry-project-detail');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-xs font-bold text-emerald-700 transition"
          >
            View Full Project Dossier
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Project Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                Current: {currentStage}
              </span>

              <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                ID: {activeProject.id}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              {projectTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-3">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Assigned:{' '}
                <strong className="text-slate-700">
                  {universityName}
                </strong>
              </span>

              <span className="hidden sm:inline text-slate-300">•</span>

              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                District:{' '}
                <strong className="text-slate-700">
                  {activeProject.district || 'Khunti'}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <Clock className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                Current Stage
              </p>
              <p className="text-xs font-bold text-slate-800">
                {currentStage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Innovation Pipeline
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track verified progress from research through impact.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {stages.map((stage, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isUpcoming = idx > currentIdx;

              return (
                <div
                  key={stage.name}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between min-h-[190px] ${
                    isCurrent
                      ? 'border-emerald-400 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/10'
                      : isCompleted
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wide ${
                          isCurrent
                            ? 'text-emerald-700'
                            : 'text-slate-400'
                        }`}
                      >
                        Stage {idx + 1}
                      </span>

                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Clock className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      {stage.name}
                    </div>

                    <p
                      className={`text-[10px] mt-2 leading-relaxed ${
                        isUpcoming
                          ? 'text-slate-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/70">
                    <span
                      className={`inline-flex text-[9px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-md ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCompleted
                        ? 'Verified'
                        : isCurrent
                        ? 'Active Now'
                        : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Notes */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />

            <span className="text-xs font-extrabold text-slate-800">
              Independent University Peer Review Process
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Transitioning between stages requires peer review by the
            State Higher Education Technology Evaluation Committee.
            Industry partners contribute testing data, environmental
            reports, and manufacturing verification signoffs to
            support the academic team's dossier.
          </p>
        </div>
      </div>
    </div>
  );
};
