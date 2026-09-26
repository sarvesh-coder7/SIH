import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectLifecycle } from '../../types';
import { IndustryExpressInterestModal } from './IndustryExpressInterestModal';
import {
  Building2,
  Handshake,
  Layers,
  ChevronRight,
  ShieldCheck,
  Clock,
  DollarSign,
  MapPin,
  Search,
  Award,
} from 'lucide-react';

export const IndustryDashboard: React.FC = () => {
  const {
    activeIndustry,
    currentIndustryMember,
    challenges,
    projects,
    collaborations,
    setSelectedProjectId,
    setSelectedCollaborationId,
    setCurrentView,
  } = useApp();

  const [selectedExpressProject, setSelectedExpressProject] =
    useState<ProjectLifecycle | null>(null);

  /* -----------------------------
     Collaboration data
  ------------------------------ */

  const activeCollabs = collaborations.filter(
    (c) => c.status === 'Active' || c.status === 'Accepted'
  );

  const pendingRequests = collaborations.filter(
    (c) => c.status === 'Pending' || c.status === 'Under Review'
  );

  /* -----------------------------
     Real challenge data
  ------------------------------ */

  const industryChallenges = challenges.filter(
    (challenge) =>
      challenge.status !== 'Rejected' &&
      challenge.status !== 'Submitted' &&
      challenge.status !== 'Under Review'
  );

  const recommendedChallenges = industryChallenges.slice(0, 3);
  const recommendedProjects = projects.slice(0, 3);

  /* -----------------------------
     Navigation helpers
  ------------------------------ */

  const handleOpenProjectDetail = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('industry-project-detail');
  };

  const handleOpenWorkspace = (
    collaborationId: string,
    projectId: string
  ) => {
    setSelectedCollaborationId(collaborationId);
    setSelectedProjectId(projectId);
    setCurrentView('industry-collaboration-workspace');
  };

  const memberRole = (
    currentIndustryMember?.role ||
    currentIndustryMember?.member_role ||
    'org_admin'
  )
    .replace(/_/g, ' ')
    .toUpperCase();

  return (
    <div className="min-h-full space-y-8 pb-8">
      {/* =========================================================
          WELCOME HEADER
      ========================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-24 h-56 w-56 rounded-full bg-teal-50 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Industry Portal
                </span>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {memberRole}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-[32px]">
                Good Morning, {currentIndustryMember?.name || 'Partner'}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Building2 className="h-3.5 w-3.5" />
                  </span>

                  <span>
                    Organization:{' '}
                    <strong className="font-bold text-slate-700">
                      {activeIndustry?.organization_name ||
                        'Industry Partner'}
                    </strong>
                  </span>
                </span>

                <span className="hidden text-slate-300 sm:inline">•</span>

                <span className="inline-flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>

                  <span>
                    HQ:{' '}
                    <strong className="font-semibold text-slate-700">
                      {activeIndustry?.district || 'Jharkhand'},{' '}
                      {activeIndustry?.state || 'Jharkhand'}
                    </strong>
                  </span>
                </span>
              </div>
            </div>

            {/* BLUE ACTION BUTTON */}
            <button
              type="button"
              onClick={() => setCurrentView('industry-discovery')}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-extrabold text-white shadow-sm shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
            >
              <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
              Discover Academic Projects
              <ChevronRight className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          KPI CARDS
      ========================================================== */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Relevant Challenges */}
        <div
          onClick={() => setCurrentView('industry-discovery')}
          className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                Relevant Challenges
              </p>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-950">
                  {industryChallenges.length}
                </span>

                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                  Available
                </span>
              </div>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-transform group-hover:scale-105">
              <Layers className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-500">
            Societal challenges available for collaboration
          </p>
        </div>

        {/* Partnership Requests */}
        <div
          onClick={() => setCurrentView('industry-requests')}
          className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                Partnership Requests
              </p>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-950">
                  {collaborations.length}
                </span>

                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-extrabold text-amber-700">
                  {pendingRequests.length} Pending
                </span>
              </div>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100 transition-transform group-hover:scale-105">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-500">
            Institutional proposals & agreements
          </p>
        </div>

        {/* Active Collaborations */}
        <div
          onClick={() => setCurrentView('industry-collaborations')}
          className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                Active Co-Dev Workspaces
              </p>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-950">
                  {activeCollabs.length}
                </span>

                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                  Active
                </span>
              </div>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-transform group-hover:scale-105">
              <Handshake className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-500">
            Joint student-industry engineering labs
          </p>
        </div>

        {/* CSR / Funding */}
        <div
          onClick={() => setCurrentView('industry-funding')}
          className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                Supported Projects
              </p>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-3xl font-black tracking-tight text-slate-950">
                  ₹{(250000).toLocaleString()}
                </span>

                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[9px] font-extrabold text-purple-700">
                  Committed CSR
                </span>
              </div>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 ring-1 ring-purple-100 transition-transform group-hover:scale-105">
              <Award className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-500">
            Section 135 Schedule VII Compliant
          </p>
        </div>
      </section>

      {/* =========================================================
          RECOMMENDED INNOVATION OPPORTUNITIES
      ========================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-emerald-500" />

              <h2 className="text-lg font-black tracking-tight text-slate-950">
                Recommended Innovation Opportunities
              </h2>
            </div>

            <p className="mt-1.5 pl-3 text-xs text-slate-500">
              Real societal challenges currently available for industry
              collaboration.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('industry-discovery')}
            className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-900"
          >
            Explore All Catalog ({industryChallenges.length})
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recommendedChallenges.length > 0 ? (
            recommendedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="group flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="flex-1 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-emerald-800">
                      {challenge.status}
                    </span>

                    <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {challenge.district || 'Jharkhand'}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="line-clamp-2 min-h-[40px] text-sm font-extrabold leading-snug text-slate-950">
                      {challenge.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                      <Building2 className="h-3 w-3 shrink-0 text-slate-400" />

                      <span className="truncate">
                        {challenge.category}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 min-h-[51px] text-[11px] leading-relaxed text-slate-600">
                    {challenge.problemSummary ||
                      challenge.description ||
                      'Societal challenge requiring collaborative innovation.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-purple-50 px-2 py-1 text-[9px] font-bold text-purple-700">
                      {challenge.urgency} Urgency
                    </span>

                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                      {challenge.affectedPopulation.toLocaleString()}{' '}
                      Affected
                    </span>
                  </div>

                  {challenge.assignedUniversityName && (
                    <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-[10px] text-slate-500">
                      <Building2 className="h-3 w-3 shrink-0 text-emerald-600" />

                      <span className="truncate">
                        University: {challenge.assignedUniversityName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => setCurrentView('industry-discovery')}
                    className="rounded-lg px-2 py-1.5 text-[10px] font-extrabold text-slate-600 transition hover:bg-white hover:text-slate-950"
                  >
                    View Details
                  </button>

                  {/* BLUE COLLABORATE BUTTON */}
                  <button
                    type="button"
                    onClick={() => setCurrentView('industry-discovery')}
                    disabled={
                      !currentIndustryMember?.permissions
                        ?.canExpressCollaboration
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[10px] font-extrabold text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Handshake className="h-3.5 w-3.5" />
                    Collaborate
                  </button>
                </div>
              </div>
            ))
          ) : recommendedProjects.length > 0 ? (
            recommendedProjects.map((project) => (
              <div
                key={project.id}
                className="group flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="flex-1 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-emerald-800">
                      {project.currentStage || 'Active'}
                    </span>

                    <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {project.district || 'Jharkhand'}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="line-clamp-2 min-h-[40px] text-sm font-extrabold leading-snug text-slate-950">
                      {project.title ||
                        project.proposal?.title ||
                        project.challengeTitle ||
                        'Innovation Project'}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                      <Building2 className="h-3 w-3 shrink-0 text-slate-400" />

                      <span className="truncate">
                        {project.universityName ||
                          project.university?.name ||
                          'University Partner'}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 min-h-[51px] text-[11px] leading-relaxed text-slate-600">
                    {project.summary ||
                      project.proposal?.executiveSummary ||
                      project.proposal?.proposedSolution ||
                      'Collaborative innovation project.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-purple-50 px-2 py-1 text-[9px] font-bold text-purple-700">
                      Tooling & Fab Needed
                    </span>

                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                      Pressure Testing Rig
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleOpenProjectDetail(project.id)}
                    className="rounded-lg px-2 py-1.5 text-[10px] font-extrabold text-slate-600 transition hover:bg-white hover:text-slate-950"
                  >
                    View Details
                  </button>

                  {/* BLUE EXPRESS INTEREST BUTTON */}
                  <button
                    type="button"
                    onClick={() => setSelectedExpressProject(project)}
                    disabled={
                      !currentIndustryMember?.permissions
                        ?.canExpressCollaboration
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[10px] font-extrabold text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Handshake className="h-3.5 w-3.5" />
                    Express Interest
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Search className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-950">
                No innovation opportunities available yet
              </h3>

              <p className="mx-auto mt-1.5 max-w-md text-[11px] leading-relaxed text-slate-500">
                Verified societal challenges and academic projects will
                appear here when they become available for industry
                collaboration.
              </p>

              <button
                type="button"
                onClick={() => setCurrentView('industry-discovery')}
                className="mt-5 rounded-lg bg-emerald-600 px-4 py-2.5 text-[10px] font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Open Discovery
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          ACTIVE COLLABORATIONS + QUICK LAUNCHPADS
      ========================================================== */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Active Co-Development Workspaces */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-emerald-500" />

                <h3 className="text-base font-black tracking-tight text-slate-950">
                  Active Co-Development Workspaces
                </h3>
              </div>

              <p className="mt-1 pl-3 text-[10px] text-slate-500">
                Monitor ongoing university-industry execution.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('industry-collaborations')}
              className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-extrabold text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-900"
            >
              View Workspaces
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {activeCollabs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-[11px] text-slate-500 shadow-sm">
              No active collaborations currently in progress. Browse
              opportunities to partner.
            </div>
          ) : (
            <div className="space-y-4">
              {activeCollabs.map((collab) => (
                <div
                  key={collab.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-emerald-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-emerald-800">
                          Active Co-Development
                        </span>

                        <span className="text-[10px] font-medium text-slate-400">
                          {collab.university_name}
                        </span>
                      </div>

                      <h4 className="mt-2 text-sm font-extrabold text-slate-950">
                        {collab.project_title}
                      </h4>
                    </div>

                    {/* BLUE WORKSPACE BUTTON */}
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenWorkspace(
                          collab.id,
                          collab.project_id
                        )
                      }
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[10px] font-extrabold text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700"
                    >
                      Workspace
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <div className="flex items-center justify-between gap-3 text-[10px] font-semibold text-slate-600">
                      <span>Joint Execution Progress</span>

                      <span className="font-extrabold text-emerald-700">
                        {collab.progress_percent}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${collab.progress_percent}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-1 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Contributions logged:{' '}
                      <strong className="text-slate-700">
                        {collab.contributions?.length || 0}
                      </strong>
                    </span>

                    <span>
                      Lead:{' '}
                      <strong className="text-slate-700">
                        {collab.contact_person}
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Launchpads */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-950">
                  Quick Launchpads
                </h3>

                <p className="mt-1 text-[10px] text-slate-500">
                  Frequently used industry actions
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Search className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setCurrentView('industry-discovery')}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Search className="h-4 w-4" />
                  </div>

                  <span className="text-[10px] font-extrabold text-slate-800">
                    Discover Research Projects
                  </span>
                </div>

                <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('industry-requests')}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Handshake className="h-4 w-4" />
                  </div>

                  <span className="text-[10px] font-extrabold text-slate-800">
                    Track Partnership Proposals
                  </span>
                </div>

                <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('industry-funding')}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <DollarSign className="h-4 w-4" />
                  </div>

                  <span className="text-[10px] font-extrabold text-slate-800">
                    Allocate CSR Grants
                  </span>
                </div>

                <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('industry-reports')}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <span className="text-[10px] font-extrabold text-slate-800">
                    Review Authorized Reports
                  </span>
                </div>

                <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Council Information */}
          <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              <Building2 className="h-4 w-4" />
              State Higher Education Council
            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-300">
              Every partnership expression is logged under the official
              Department of Higher Education public-private co-development
              charter with zero licensing ambiguity.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          EXISTING EXPRESS INTEREST MODAL
      ========================================================== */}
      {selectedExpressProject && (
        <IndustryExpressInterestModal
          project={selectedExpressProject}
          onClose={() => setSelectedExpressProject(null)}
        />
      )}
    </div>
  );
};
