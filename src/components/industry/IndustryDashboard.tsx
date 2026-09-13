import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectLifecycle } from '../../types';
import { IndustryExpressInterestModal } from './IndustryExpressInterestModal';
import {
  Building2,
  Handshake,
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Cpu,
  MapPin,
  ArrowUpRight,
  Search,
  Plus,
} from 'lucide-react';

export const IndustryDashboard: React.FC = () => {
  const {
    activeIndustry,
    currentIndustryMember,
    projects,
    collaborations,
    setSelectedProjectId,
    setSelectedCollaborationId,
    setCurrentView,
  } = useApp();

  const [selectedExpressProject, setSelectedExpressProject] = useState<ProjectLifecycle | null>(null);

  const activeCollabs = collaborations.filter(
    (c) => c.status === 'Active' || c.status === 'Accepted'
  );
  const pendingRequests = collaborations.filter(
    (c) => c.status === 'Pending' || c.status === 'Under Review'
  );

  // Recommended matching projects
  const recommendedProjects = projects.slice(0, 3);

  const handleOpenDetail = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('industry-project-detail');
  };

  const handleOpenWorkspace = (collabId: string, projectId: string) => {
    setSelectedCollaborationId(collabId);
    setSelectedProjectId(projectId);
    setCurrentView('industry-collaboration-workspace');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Industry Portal
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                {(currentIndustryMember?.role || currentIndustryMember?.member_role || 'org_admin').replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good Morning, {currentIndustryMember?.name || 'Partner'}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200/90 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Organization: <strong>{activeIndustry?.organization_name || 'Tata Steel Innovation Centre'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                HQ: {activeIndustry?.district || 'East Singhbhum'}, {activeIndustry?.state || 'Jharkhand'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('industry-discovery')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <Search className="w-4 h-4" />
              Discover Academic Projects
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Relevant Projects */}
        <div
          onClick={() => setCurrentView('industry-discovery')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Relevant Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{projects.length}</span>
            <span className="text-xs text-emerald-700 font-bold">In State Registry</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Across 12 accredited state technical institutes
          </p>
        </div>

        {/* Card 2: Collaboration Requests */}
        <div
          onClick={() => setCurrentView('industry-requests')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Partnership Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{collaborations.length}</span>
            <span className="text-xs text-amber-700 font-bold">
              {pendingRequests.length} Pending Review
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Institutional proposals & agreements
          </p>
        </div>

        {/* Card 3: Active Collaborations */}
        <div
          onClick={() => setCurrentView('industry-collaborations')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Co-Dev Workspaces
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <Handshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{activeCollabs.length}</span>
            <span className="text-xs text-emerald-700 font-bold">Active Partnerships</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Joint student-industry engineering labs
          </p>
        </div>

        {/* Card 4: CSR Grant Deployments */}
        <div
          onClick={() => setCurrentView('industry-funding')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Supported Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              ₹{(250000).toLocaleString()}
            </span>
            <span className="text-xs text-purple-700 font-bold">Committed CSR</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Section 135 Schedule VII Compliant
          </p>
        </div>
      </div>

      {/* Recommended Opportunities Matching Capabilities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recommended Innovation Opportunities
            </h2>
            <p className="text-xs text-slate-500">
              Projects matched automatically with {activeIndustry?.organization_name || 'Industry'}'s registered testing and manufacturing matrix.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('industry-discovery')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            Explore All Catalog ({projects.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400/80 hover:shadow-md transition flex flex-col justify-between p-5 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    {project.currentStage || 'Prototype'} Stage
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.district || 'Khunti'}
                  </span>
                </div>

                <div>
                  <h3
                    onClick={() => handleOpenDetail(project.id)}
                    className="text-sm font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition leading-snug line-clamp-2"
                  >
                    {project.title || project.proposal?.title || project.challengeTitle}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{project.universityName || project.university?.name || 'Partner University'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {project.summary || project.proposal?.executiveSummary || project.proposal?.proposedSolution || 'Societal challenge solving innovation in Jharkhand.'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold">
                    Tooling & Fab Needed
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                    Pressure Testing Rig
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenDetail(project.id)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  View Details
                </button>
                <button
                  onClick={() => setSelectedExpressProject(project)}
                  disabled={!currentIndustryMember?.permissions?.canExpressCollaboration}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1 transition"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  Express Interest
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Collaborations & Health Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Co-Dev Workspaces */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Active Co-Development Workspaces
            </h3>
            <button
              onClick={() => setCurrentView('industry-collaborations')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              View Workspaces
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeCollabs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
              No active collaborations currently in progress. Browse projects to partner.
            </div>
          ) : (
            <div className="space-y-4">
              {activeCollabs.map((collab) => (
                <div
                  key={collab.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          Active Co-Development
                        </span>
                        <span className="text-xs text-slate-400">
                          {collab.university_name}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {collab.project_title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleOpenWorkspace(collab.id, collab.project_id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0"
                    >
                      Workspace
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Joint Execution Progress</span>
                      <span className="font-bold text-emerald-700">{collab.progress_percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${collab.progress_percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>
                      Contributions logged: <strong>{collab.contributions?.length || 0}</strong>
                    </span>
                    <span>
                      Lead: <strong>{collab.contact_person}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Action Launchpads & Verification */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Quick Launchpads</h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setCurrentView('industry-discovery')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left font-bold text-slate-800 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>Discover Research Projects</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setCurrentView('industry-requests')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left font-bold text-slate-800 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <Handshake className="w-4 h-4 text-emerald-600" />
                  <span>Track Partnership Proposals</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setCurrentView('industry-funding')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left font-bold text-slate-800 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Allocate CSR Grants</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setCurrentView('industry-reports')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left font-bold text-slate-800 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Review Authorized Reports</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Building2 className="w-4 h-4" />
              State Higher Education Council
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every partnership expression is logged under the official Department of Higher Education public-private co-development charter with zero licensing ambiguity.
            </p>
          </div>
        </div>
      </div>

      {/* Express Interest Modal */}
      {selectedExpressProject && (
        <IndustryExpressInterestModal
          project={selectedExpressProject}
          onClose={() => setSelectedExpressProject(null)}
        />
      )}
    </div>
  );
};
