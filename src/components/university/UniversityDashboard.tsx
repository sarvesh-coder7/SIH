import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge } from '../../types';
import { ChallengeEvaluationModal } from './ChallengeEvaluationModal';
import { MultidisciplinaryTeamBuilder } from './MultidisciplinaryTeamBuilder';
import { SolutionProposalBuilder } from './SolutionProposalBuilder';
import {
  GraduationCap,
  Sparkles,
  Users,
  Layers,
  MapPin,
  FileText,
  DollarSign,
} from 'lucide-react';

export const UniversityDashboard: React.FC = () => {
  const {
    currentUser,
    challenges,
    projects,
    navigateToChallenge,
    navigateToProject,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'incoming' | 'projects' | 'team-builder' | 'proposals'
  >('incoming');

  const [evaluatingChallenge, setEvaluatingChallenge] =
    useState<Challenge | null>(null);

  // Existing HEI matching logic — unchanged.
  const incomingMatched = challenges.filter(
    (c) => c.status === 'University Matching' || c.status === 'Validated'
  );

  const activeProjects = projects;

  const handleEvaluationAccept = (facultyName: string, _notes: string) => {
    if (evaluatingChallenge) {
      evaluatingChallenge.status = 'Assigned';
      evaluatingChallenge.assignedUniversityName =
        currentUser.organization || 'Birla Institute of Technology, Mesra';
      evaluatingChallenge.assignedFacultyName = facultyName;

      showToast(
        'success',
        'Assigned to BIT Mesra',
        `Faculty ${facultyName} designated as Project Director.`
      );

      setEvaluatingChallenge(null);
    }
  };

  const tabs = [
    {
      id: 'incoming' as const,
      label: 'AI Matched Challenges',
      count: incomingMatched.length,
      icon: Sparkles,
      iconClass: 'text-amber-500',
    },
    {
      id: 'projects' as const,
      label: 'Active R&D Projects',
      count: activeProjects.length,
      icon: Layers,
      iconClass: 'text-emerald-700',
    },
    {
      id: 'team-builder' as const,
      label: 'Team Builder',
      icon: Users,
      iconClass: 'text-emerald-700',
    },
    {
      id: 'proposals' as const,
      label: 'Proposal & CSR Grants',
      icon: FileText,
      iconClass: 'text-emerald-700',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Institutional Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
              <GraduationCap className="h-6 w-6 text-emerald-700" />
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                  HEI Portal
                </span>

                <span className="text-[11px] font-medium text-slate-500">
                  JSHEC Accreditation: A++
                </span>
              </div>

              <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {currentUser.organization ||
                  'Birla Institute of Technology (BIT Mesra)'}
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
                R&D Cell, Incubation Center & Multidisciplinary Capstone
                Innovation Cohorts.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('team-builder')}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 sm:w-auto"
          >
            <Users className="h-4 w-4" />
            Assemble Student Team
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'AI Matched Challenges',
            value: incomingMatched.length,
            icon: Sparkles,
            color: 'text-amber-700',
            bg: 'bg-amber-50',
          },
          {
            label: 'Active R&D Projects',
            value: activeProjects.length,
            icon: Layers,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Student Innovators',
            value: '48 Active',
            icon: Users,
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
          },
          {
            label: 'R&D / CSR Grants',
            value: '₹42.5 Lakhs',
            icon: DollarSign,
            color: 'text-teal-700',
            bg: 'bg-teal-50',
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex min-h-[92px] items-center justify-between rounded-xl border border-slate-200 ${item.bg} px-4 py-3.5 shadow-sm`}
          >
            <div className="min-w-0">
              <span className="block truncate text-[11px] font-semibold text-slate-600">
                {item.label}
              </span>
              <span
                className={`mt-1 block text-lg font-black ${item.color} sm:text-xl`}
              >
                {item.value}
              </span>
            </div>

            <item.icon
              className={`h-7 w-7 shrink-0 opacity-25 ${item.color}`}
            />
          </div>
        ))}
      </section>

      {/* Dashboard Tabs */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex min-h-[62px] items-center justify-center gap-2 border-b-2 px-3 py-3 text-center text-[11px] font-bold transition sm:text-xs ${
                  isActive
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${tab.iconClass}`} />
                <span>
                  {tab.label}
                  {typeof tab.count === 'number' && (
                    <span className="ml-1">({tab.count})</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Incoming Challenges */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 shadow-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <p className="text-xs leading-relaxed text-slate-600">
              These community challenges have been ranked by AI specifically
              for <strong className="text-slate-800">BIT Mesra</strong> based
              on departmental research capacity in Chemical, Water, Solar, and
              IoT domains.
            </p>
          </div>

          <div className="space-y-3">
            {incomingMatched.map((ch) => (
              <article
                key={ch.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                {/* Challenge top row */}
                <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {ch.title}
                      </h3>

                      <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[9px] font-bold text-slate-500">
                        {ch.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                      94% Domain Match
                    </span>

                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                      {ch.urgency} Urgency
                    </span>
                  </div>
                </div>

                {/* Challenge content */}
                <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
                  <div className="min-w-0 p-4 sm:p-5">
                    <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">
                      {ch.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {ch.block}, {ch.district}
                      </span>

                      <span className="hidden text-slate-300 sm:inline">
                        •
                      </span>

                      <span>
                        Affected:{' '}
                        {(ch.affectedPopulation || 0).toLocaleString()}{' '}
                        citizens
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center gap-2 border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5 lg:border-l lg:border-t-0">
                    <button
                      onClick={() => setEvaluatingChallenge(ch)}
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
                    >
                      <GraduationCap className="h-4 w-4 shrink-0" />
                      Evaluate & Assign Faculty Mentor
                    </button>

                    <button
                      onClick={() => navigateToChallenge(ch.id)}
                      className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      View Full Dossier & Evidence →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Active R&D Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {activeProjects.map((p) => {
              const anyP = p as any;

              const title =
                p.proposal?.title ||
                p.challengeTitle ||
                anyP.title ||
                'Multidisciplinary R&D Project';

              const trl = p.prototypeStatus?.trlLevel
                ? `TRL ${p.prototypeStatus.trlLevel}`
                : anyP.trlLevel || 'TRL 5';

              const membersCount =
                p.team?.members?.length || anyP.teamMembers?.length || 4;

              const partner: any =
                p.industryPartners?.[0] || anyP.csrFunding;

              const sponsorName =
                partner?.partnerName ||
                partner?.sponsorName ||
                'Open for Co-Sponsor';

              const rawIdx =
                typeof p.currentStageIndex === 'number'
                  ? p.currentStageIndex
                  : 6;

              const progressPct =
                anyP.completionPercentage ||
                Math.min(100, Math.round(((rawIdx + 1) / 14) * 100));

              return (
                <article
                  key={p.id}
                  onClick={() => navigateToProject(p.id)}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-400 hover:shadow-md sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
                        {title}
                      </h3>

                      <span className="mt-1 block truncate font-mono text-[10px] text-slate-500">
                        {p.id} • {p.universityName}
                      </span>
                    </div>

                    <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase text-emerald-800">
                      {p.team?.status || anyP.status || 'Active R&D'}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
                    <div>
                      <span className="block text-[10px] text-slate-500">
                        TRL Level
                      </span>
                      <strong className="mt-0.5 block text-xs text-emerald-800">
                        {trl}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500">
                        Cohort
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold text-slate-800">
                        {membersCount} Members
                      </span>
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[10px] text-slate-500">
                        CSR Sponsor
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-semibold text-purple-800">
                        {sponsorName}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>Lifecycle Milestone Progress</span>
                      <span className="text-emerald-700">{progressPct}%</span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Team Builder */}
      {activeTab === 'team-builder' && (
        <MultidisciplinaryTeamBuilder
          challengeId={challenges[0].id}
          onTeamCreated={(teamName) => {
            showToast(
              'success',
              'Cohort Registered',
              `${teamName} created and saved to active HEI repository.`
            );
            setActiveTab('projects');
          }}
        />
      )}

      {/* Proposal Builder */}
      {activeTab === 'proposals' && (
        <SolutionProposalBuilder
          challengeId={challenges[0].id}
          onProposalSubmitted={() => {
            showToast(
              'success',
              'Proposal Forwarded',
              'Proposal forwarded to State PMU for funding clearance.'
            );
            setActiveTab('projects');
          }}
        />
      )}

      {/* Evaluation Modal */}
      {evaluatingChallenge && (
        <ChallengeEvaluationModal
          challenge={evaluatingChallenge}
          isOpen={!!evaluatingChallenge}
          onClose={() => setEvaluatingChallenge(null)}
          onAccept={handleEvaluationAccept}
        />
      )}
    </div>
  );
};

