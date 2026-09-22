import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Rocket,
  Search,
  Filter,
  Layers,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  Activity,
  ChevronRight,
  Award,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';

export const UniversityProjectsPage: React.FC = () => {
  const {
    currentUser,
    projects,
    navigateToProject,
    setCurrentView,
    setSelectedProjectId,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTRL, setSelectedTRL] = useState<string>('All');

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const anyP = p as any;
    const title = (p.proposal?.title || p.challengeTitle || anyP.title || '').toLowerCase();
    const id = (p.id || '').toLowerCase();
    const faculty = (anyP.facultyMentor || anyP.assignedFacultyName || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = !search || title.includes(search) || id.includes(search) || faculty.includes(search);

    const trlString = p.prototypeStatus?.trlLevel ? `TRL ${p.prototypeStatus.trlLevel}` : (anyP.trlLevel || 'TRL 5');
    const matchesTRL = selectedTRL === 'All' || trlString.includes(selectedTRL);

    const statusString = p.team?.status || anyP.status || 'Active';
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Active' && statusString.toLowerCase().includes('active')) ||
      (selectedStatus === 'TRL 5+' && (p.prototypeStatus?.trlLevel || 5) >= 5) ||
      (selectedStatus === 'CSR Funded' && (p.industryPartners?.length || anyP.csrFunding));

    return matchesSearch && matchesTRL && matchesStatus;
  });

  const handleOpenWorkspace = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-workspace', { projectId });
    showToast('info', 'Workspace Opened', `Navigated to multidisciplinary workspace for ${projectId}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              R&D Workspaces & Capstone Cohorts
            </span>
            <span className="text-xs text-slate-500 font-mono">14-Stage Innovation Lifecycle</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Institutional Projects
          </h1>
          <p className="text-xs text-slate-600 max-w-xl">
            Active multidisciplinary research cohorts, prototype engineering (TRL 1 to TRL 9), patent clearances, and milestone deliverables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={() => setCurrentView('university-proposals')}
            className="px-4 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>+ New Solution Proposal</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('university-teams')}
            className="px-4 py-2.5 bg-[#fbf8ee] border border-[#e2d6bc] hover:bg-[#f7f2e4] text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#0d5c3a]" />
            <span>Assemble Team</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active R&D Projects', value: `${projects.length} Cohorts`, icon: Rocket, color: 'text-emerald-800', bg: 'bg-emerald-50/70' },
          { label: 'TRL 5+ Prototypes', value: '2 Lab-Validated', icon: FlaskConical, color: 'text-indigo-800', bg: 'bg-indigo-50/70' },
          { label: 'Patents Under Filing', value: '1 Clearance', icon: ShieldCheck, color: 'text-amber-800', bg: 'bg-amber-50/70' },
          { label: 'Industry Co-Sponsors', value: '₹14.0L Disbursed', icon: DollarSign, color: 'text-teal-800', bg: 'bg-teal-50/70' },
        ].map((kpi, idx) => (
          <div key={idx} className={`${kpi.bg} p-4 rounded-2xl border border-[#e2d6bc] shadow-xs flex items-center justify-between`}>
            <div>
              <span className="text-xs font-bold text-slate-600 block">{kpi.label}</span>
              <span className={`text-xl font-black ${kpi.color} mt-1 block`}>{kpi.value}</span>
            </div>
            <kpi.icon className={`w-8 h-8 opacity-30 ${kpi.color}`} />
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project name, ID (e.g. PROJ-JH-2026-0081), faculty mentor, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 px-2">Status:</span>
              {['All', 'Active', 'TRL 5+', 'CSR Funded'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-[#0d5c3a] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects List Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2d6bc] p-12 text-center space-y-3 shadow-xs">
          <Rocket className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No projects matched your search criteria. Try clearing filters or create a new solution proposal.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('All');
              setSelectedTRL('All');
            }}
            className="px-4 py-2 bg-[#fbf8ee] border border-[#e2d6bc] hover:bg-[#f7f2e4] text-xs font-bold text-slate-800 rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProjects.map((p) => {
            const anyP = p as any;
            const title = p.proposal?.title || p.challengeTitle || anyP.title || 'Multidisciplinary R&D Project';
            const trl = p.prototypeStatus?.trlLevel ? `TRL ${p.prototypeStatus.trlLevel}` : (anyP.trlLevel || 'TRL 5');
            const membersCount = p.team?.members?.length || anyP.teamMembers?.length || 4;
            const partner: any = p.industryPartners?.[0] || anyP.csrFunding;
            const sponsorName = partner?.partnerName || partner?.sponsorName || 'Tata Steel CSR Foundation';
            const facultyLead = anyP.facultyMentor || anyP.assignedFacultyName || 'Dr. Meenakshi Soren';
            const rawIdx = typeof p.currentStageIndex === 'number' ? p.currentStageIndex : 6;
            const progressPct = anyP.completionPercentage || Math.min(100, Math.round(((rawIdx + 1) / 14) * 100));

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs hover:border-[#0d5c3a] transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#fbf8ee] text-slate-800 border border-[#e2d6bc]">
                          {p.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {trl} &bull; Stage {rawIdx + 1}/14
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug line-clamp-2">
                        {title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {p.proposal?.executiveSummary ||
                      'Decentralized defluoridation unit engineered with activated alumina paired with IoT real-time telemetry sensors.'}
                  </p>
                </div>

                {/* Metadata Pill Box */}
                <div className="p-3.5 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] text-xs text-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lead Faculty:</span>
                    <strong className="text-slate-900 font-semibold">{facultyLead}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Student Cohort:</span>
                    <span className="font-semibold text-slate-800">{membersCount} Members (Chemical + IoT)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Industry / CSR Partner:</span>
                    <span className="font-semibold text-purple-900">{sponsorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Grant Allocated:</span>
                    <span className="font-bold text-emerald-800">₹4.80 Lakhs (Tranche 1 Disbursed)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>14-Stage Lifecycle Progress</span>
                    <span className="text-[#0d5c3a]">{progressPct}% Completed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-[#0d5c3a] transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-[#e2d6bc]/70 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenWorkspace(p.id)}
                    className="w-full sm:flex-1 py-2.5 px-3 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Rocket className="w-3.5 h-3.5 text-amber-300" />
                    <span>Open Project Workspace &rarr;</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('university-reports')}
                    className="w-full sm:w-auto py-2.5 px-3 bg-[#fbf8ee] border border-[#e2d6bc] hover:bg-[#f7f2e4] text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reports & IP</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
