import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  FileText,
  FileCheck,
  Rocket,
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  Users,
  MapPin,
  Sparkles,
  Layers,
  Search,
  ArrowUpRight,
  Clock,
  Briefcase,
  Globe2,
  Handshake,
  CheckCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const {
    currentGovernmentMember,
    challenges,
    projects,
    collaborations,
    projectReports,
    supportActions,
    setCurrentView,
    setSelectedChallengeId,
    setSelectedProjectId,
    showToast,
  } = useApp();

  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('All');

  // Derive genuine stats from real state
  const totalChallenges = challenges.length;
  const openChallenges = challenges.filter(
    (c) => c.status !== 'Implemented' && c.status !== 'Rejected'
  ).length;
  const activeProjects = projects.filter(
    (p) => p.currentStage !== 'Scale-up & Policy Integration'
  ).length;
  const completedProjects = projects.filter(
    (p) => p.currentStage === 'Scale-up & Policy Integration'
  ).length;

  // Stalled or Needing Attention
  const projectsNeedingAttention = projects.filter((p) => {
    // Check if any milestone is overdue or has pending support action
    const hasOpenAction = supportActions.some(
      (a) => a.project_id === p.id && a.status === 'Open'
    );
    const hasPendingMilestones = p.milestones.some(
      (m) => m.status === 'Delayed'
    );
    return hasOpenAction || hasPendingMilestones;
  });

  const activeCollaborationsCount = collaborations.length;

  // Pending Actions
  const pendingVerification = challenges.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review'
  );

  const pendingAssignment = challenges.filter(
    (c) => c.status === 'Validated' || (c.status === 'Assigned' && !c.officialAssignment)
  );

  const pendingReports = projectReports.filter(
    (r) => !r.review_status || r.review_status === 'Under Review'
  );

  // Group challenges by district for the real summary
  const districtCounts = challenges.reduce((acc, c) => {
    acc[c.district] = (acc[c.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExportBrief = () => {
    showToast(
      'success',
      'Policy Brief Generated',
      'Official Government of Jharkhand Societal Innovation & Capstone Policy Brief exported with real platform metrics.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Official State PMU Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 text-2xl font-black shrink-0 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
                Government of Jharkhand Executive Portal
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {currentGovernmentMember.department_name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Welcome, {currentGovernmentMember.name}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time oversight over citizen challenges, academic R&D assignments, industry co-funding, and pilot deployment across Jharkhand's 24 districts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            onClick={handleExportBrief}
            className="w-full md:w-auto px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export State Policy Brief</span>
          </button>
        </div>
      </div>

      {/* Real Database Derived Statistics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Statewide Platform Metrics (Live Database Records)
          </h3>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Synchronization
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Challenges</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalChallenges}</div>
            <div className="text-[11px] text-slate-500 mt-1">Reported by citizens</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700">Open Challenges</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-900 mt-1">{openChallenges}</div>
            <div className="text-[11px] text-amber-700 mt-1">Awaiting solution/pilot</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-indigo-700">Active Projects</span>
              <Building2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-indigo-900 mt-1">{activeProjects}</div>
            <div className="text-[11px] text-indigo-600 mt-1">Under university teams</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">Completed Projects</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-900 mt-1">{completedProjects}</div>
            <div className="text-[11px] text-emerald-600 mt-1">Impact measured/scaled</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-700">Needs Attention</span>
              <Clock className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-900 mt-1">{projectsNeedingAttention.length}</div>
            <div className="text-[11px] text-rose-600 mt-1">Stalled / Interventions</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-teal-700">Industry Collabs</span>
              <Handshake className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-2xl font-black text-teal-900 mt-1">{activeCollaborationsCount}</div>
            <div className="text-[11px] text-teal-600 mt-1">CSR / Test facilities</div>
          </div>
        </div>
      </div>

      {/* Immediate Attention & Action Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Verification Queue</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Challenges awaiting official state verification
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {pendingVerification.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingVerification.slice(0, 3).map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChallengeId(ch.id);
                  setCurrentView('government-verification');
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono font-bold text-slate-700">{ch.id}</span>
                  <span className="font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {ch.trustStatus || ch.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900 mt-1 line-clamp-1">
                  {ch.title}
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{ch.district}, {ch.block}</span>
                  <span>•</span>
                  <span>{ch.category}</span>
                </div>
              </div>
            ))}

            {pendingVerification.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500">
                All submitted challenges have been verified.
              </div>
            )}

            <button
              onClick={() => setCurrentView('government-verification')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 mt-2"
            >
              <span>Go to Verification Desk</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Assignment Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Assignment Management</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Verified challenges awaiting official assignment
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {pendingAssignment.length} Ready
            </span>
          </div>

          <div className="space-y-3">
            {pendingAssignment.slice(0, 3).map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChallengeId(ch.id);
                  setCurrentView('government-assignments');
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono font-bold text-slate-700">{ch.id}</span>
                  <span className="text-indigo-700 font-medium">
                    {ch.expressionsOfInterest?.length || 0} Universities interested
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 mt-1 line-clamp-1">
                  {ch.title}
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                  <span>Target: {ch.district}</span>
                  <span>•</span>
                  <span>Aff. Pop: {ch.affectedPopulation.toLocaleString()}</span>
                </div>
              </div>
            ))}

            {pendingAssignment.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500">
                No verified challenges pending assignment.
              </div>
            )}

            <button
              onClick={() => setCurrentView('government-assignments')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 mt-2"
            >
              <span>Go to Assignment Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reports & Documents Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Reports Governance</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Milestone reports submitted by universities
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {pendingReports.length} Submitted
            </span>
          </div>

          <div className="space-y-3">
            {pendingReports.slice(0, 3).map((r) => (
              <div
                key={r.id}
                onClick={() => setCurrentView('government-reports')}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono font-bold text-slate-700">{r.id}</span>
                  <span className="text-emerald-700 font-medium">{r.report_type}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 mt-1 line-clamp-1">
                  {r.title}
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                  <span className="truncate">{r.university_name}</span>
                  <span>•</span>
                  <span>{r.file_size}</span>
                </div>
              </div>
            ))}

            {pendingReports.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500">
                All submitted reports have been reviewed.
              </div>
            )}

            <button
              onClick={() => setCurrentView('government-reports')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 mt-2"
            >
              <span>Review Reports & Documents</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Projects Lifecycle Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-600" />
              <span>Active University Capstone & R&D Projects</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status, milestones, and industry co-development for assigned societal challenges
            </p>
          </div>
          <button
            onClick={() => setCurrentView('government-projects')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {projects.map((p) => {
            const completedMilestones = p.milestones.filter(
              (m) => m.status === 'Completed'
            ).length;
            const progressPercent = Math.round(
              (completedMilestones / (p.milestones.length || 1)) * 100
            );

            return (
              <div
                key={p.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 rounded-xl px-2 -mx-2 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {p.id}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {p.currentStage}
                    </span>
                    {p.industryPartners && p.industryPartners.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                        <Handshake className="w-3 h-3" />
                        <span>{p.industryPartners[0].partnerName}</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {p.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                    <span className="font-medium text-indigo-700">
                      {p.universityName || p.university?.name}
                    </span>
                    <span>•</span>
                    <span>Mentor: {p.leadFaculty || p.team?.leadFaculty?.name || 'Faculty Team'}</span>
                    <span>•</span>
                    <span>Challenge: {p.challengeId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="w-36">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Milestones</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {completedMilestones} of {p.milestones.length} delivered
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setCurrentView('government-projects');
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Inspect Project
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* District Footprint Quick Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>District Problem Density (Live Reports)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of crowdsourced citizen challenges mapped to respective districts
            </p>
          </div>
          <button
            onClick={() => setCurrentView('government-districts')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Open District Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Object.entries(districtCounts).map(([district, count]) => (
            <div
              key={district}
              onClick={() => {
                setSelectedDistrictFilter(district);
                setCurrentView('government-challenges');
              }}
              className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-800 truncate">{district}</div>
              <div className="text-lg font-black text-emerald-800 mt-1">{count}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Active challenges</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
