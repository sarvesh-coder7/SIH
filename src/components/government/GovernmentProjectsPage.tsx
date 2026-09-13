import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectLifecycle, Milestone } from '../../types';
import { GovernmentSupportAction } from '../../types/government';
import {
  Rocket,
  Search,
  Filter,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Handshake,
  FileText,
  X,
  Eye,
  Plus,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export const GovernmentProjectsPage: React.FC = () => {
  const {
    projects,
    challenges,
    collaborations,
    supportActions,
    createGovernmentSupportAction,
    updateGovernmentSupportActionStatus,
    selectedProjectId,
    setSelectedProjectId,
    currentGovernmentMember,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [universityFilter, setUniversityFilter] = useState('All');
  const [stalledOnly, setStalledOnly] = useState(false);

  const [inspectProject, setInspectProject] = useState<ProjectLifecycle | null>(
    selectedProjectId ? projects.find((p) => p.id === selectedProjectId) || null : null
  );

  // Intervention modal state
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [actionType, setActionType] = useState('FIELD_ACCESS_PERMIT');
  const [actionDescription, setActionDescription] = useState('');
  const [actionPriority, setActionPriority] = useState<'Normal' | 'High' | 'Critical'>('High');
  const [actionTargetDate, setActionTargetDate] = useState('');


  const allStages = Array.from(new Set(projects.map((p) => p.currentStage || 'Planning'))).sort();
  const allUniversities = Array.from(
    new Set(projects.map((p) => p.universityName || p.university?.name || 'University Team'))
  ).sort();

  const isProjectStalled = (project: ProjectLifecycle) => {
    const hasDelayedMilestones = project.milestones?.some((m) => m.status === 'Delayed');
    const hasOpenIntervention = supportActions.some(
      (a) => a.project_id === project.id && a.status === 'Open'
    );
    return hasDelayedMilestones || hasOpenIntervention;
  };

  const filteredProjects = projects.filter((p) => {
    const univName = p.universityName || p.university?.name || '';
    if (stageFilter !== 'All' && p.currentStage !== stageFilter) return false;
    if (universityFilter !== 'All' && univName !== universityFilter) return false;
    if (stalledOnly && !isProjectStalled(p)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const mentor = p.leadFaculty || p.team?.leadFaculty?.name || '';
      return (
        p.id.toLowerCase().includes(q) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        univName.toLowerCase().includes(q) ||
        mentor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateIntervention = () => {
    if (!inspectProject || !actionTitle.trim() || !actionDescription.trim()) {
      alert('Please fill out the action title and description.');
      return;
    }

    createGovernmentSupportAction({
      project_id: inspectProject.id,
      challenge_id: inspectProject.challengeId,
      project_title: inspectProject.title || inspectProject.challengeTitle,
      issue_description: actionTitle.trim(),
      action_plan: actionDescription.trim(),
      responsible_department: currentGovernmentMember.department_name,
      priority: actionPriority,
      target_date: actionTargetDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    });

    setShowInterventionModal(false);
    setActionTitle('');
    setActionDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Rocket className="w-4 h-4" />
            <span>State Academic Capstone Monitoring</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Active Project Monitoring & Interventions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track university milestones, lab testing, pilot deployments, and deploy state administrative interventions when stalled.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStalledOnly(!stalledOnly)}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
              stalledOnly
                ? 'bg-rose-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Stalled Projects Only ({projects.filter(isProjectStalled).length})</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project ID, title, university, mentor..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Stages</option>
              {allStages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-56">
            <select
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Universities</option>
              {allUniversities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800">{filteredProjects.length}</strong> of{' '}
            <strong className="text-slate-800">{projects.length}</strong> active projects
          </span>
          {(stageFilter !== 'All' || universityFilter !== 'All' || stalledOnly || searchQuery) && (
            <button
              onClick={() => {
                setStageFilter('All');
                setUniversityFilter('All');
                setStalledOnly(false);
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Project ID & Title</th>
                <th className="py-3 px-4">University & Mentor</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Milestones Completed</th>
                <th className="py-3 px-4">Industry Partners</th>
                <th className="py-3 px-4">Intervention Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProjects.map((p) => {
                const completedMilestones = p.milestones.filter((m) => m.status === 'Completed').length;
                const progressPct = Math.round((completedMilestones / (p.milestones.length || 1)) * 100);
                const isStalled = isProjectStalled(p);
                const openActions = supportActions.filter(
                  (a) => a.project_id === p.id && a.status === 'Open'
                );

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-slate-900">
                        {p.id}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 max-w-xs truncate mt-0.5">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Challenge: {p.challengeId} • Stage #{p.currentStageIndex}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{p.universityName || p.university?.name}</div>
                      <div className="text-[11px] text-slate-500">Mentor: {p.leadFaculty || p.team?.leadFaculty?.name || 'Faculty Team'}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                        {p.currentStage}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="w-28">
                        <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                          <span>{completedMilestones}/{p.milestones.length}</span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {p.industryPartners && p.industryPartners.length > 0 ? (
                        <div className="flex items-center gap-1 text-teal-700 text-[11px] font-medium">
                          <Handshake className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[130px]">{p.industryPartners[0].partnerName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isStalled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Attention Needed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>On Track</span>
                        </span>
                      )}
                      {openActions.length > 0 && (
                        <div className="text-[10px] text-indigo-700 font-medium mt-0.5">
                          {openActions.length} State Action(s) Active
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectProject(p)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No projects found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Detail / Lifecycle Modal */}
      {inspectProject && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600">
                    {inspectProject.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    {inspectProject.currentStage}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {inspectProject.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Lead University: <strong className="text-slate-800">{inspectProject.universityName || inspectProject.university?.name || 'Assigned University'}</strong> • Faculty Mentor: {inspectProject.leadFaculty || inspectProject.team?.leadFaculty?.name || 'Faculty Team'}
                </div>
              </div>
              <button
                onClick={() => setInspectProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lifecycle Stages */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Project Development Lifecycle
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {[
                  'Research & Planning',
                  'Prototype Development',
                  'Testing & Simulation',
                  'Pilot Deployment',
                  'Scale-up & Policy Integration',
                ].map((st, idx) => {
                  const isCurrent = inspectProject.currentStage === st;
                  return (
                    <div
                      key={st}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] opacity-75">Stage {idx + 1}</div>
                      <div className="mt-0.5 text-[11px] leading-tight">{st}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Milestones Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Project Milestones & Deliverables
              </h4>
              <div className="space-y-2">
                {inspectProject.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Target Date: {m.targetDate || 'TBD'} • Deliverable: {m.deliverable || 'Documentation'}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : m.status === 'Delayed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Government Support Actions for this Project */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Government Support Actions & Administrative Interventions
                </h4>
                <button
                  onClick={() => setShowInterventionModal(true)}
                  className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create State Intervention</span>
                </button>
              </div>

              {supportActions.filter((a) => a.project_id === inspectProject.id).length > 0 ? (
                <div className="space-y-2">
                  {supportActions
                    .filter((a) => a.project_id === inspectProject.id)
                    .map((act) => (
                      <div
                        key={act.id}
                        className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-purple-950">{act.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                              {act.action_type}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                act.priority === 'Urgent'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {act.priority}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{act.description}</p>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Assigned to: {act.assigned_department} • Target: {act.target_completion_date}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {act.status !== 'Completed' && act.status !== 'Resolved' ? (
                            <button
                              onClick={() =>
                                updateGovernmentSupportActionStatus(act.id, 'Resolved')
                              }
                              className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                          ) : (
                            <span className="text-purple-700 font-bold text-[11px]">Resolved</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
                  No state interventions logged for this project. University is progressing independently.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setInspectProject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Intervention Modal */}
      {showInterventionModal && inspectProject && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2d6bc] space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#e2d6bc]/60">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Government Support Mandate
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Authorize State Administrative Intervention
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Project #{inspectProject.id}: {inspectProject.title}
                </div>
              </div>
              <button
                onClick={() => setShowInterventionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Intervention Title *
                </label>
                <input
                  type="text"
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  placeholder="e.g. Facilitate Field Water Tank Testing Clearances"
                  className="w-full p-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Intervention Type
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full p-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900"
                  >
                    <option value="FIELD_ACCESS_PERMIT">Field Access Permit</option>
                    <option value="TESTING_FACILITY_ACCESS">Testing Facility Access</option>
                    <option value="POLICY_EXCEPTION">Policy / Regulatory Clearance</option>
                    <option value="CSR_MATCHING_GRANT">CSR Matching Grant</option>
                    <option value="INTER_DEPARTMENTAL_COORDINATION">Inter-Department Coordination</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={actionPriority}
                    onChange={(e) => setActionPriority(e.target.value as any)}
                    className="w-full p-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Resolution Date
                </label>
                <input
                  type="date"
                  value={actionTargetDate}
                  onChange={(e) => setActionTargetDate(e.target.value)}
                  className="w-full p-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Intervention Scope & Actions Required *
                </label>
                <textarea
                  value={actionDescription}
                  onChange={(e) => setActionDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail the exact administrative clearance, test bed authorization, or departmental coordination required..."
                  className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2d6bc]/60">
              <button
                onClick={() => setShowInterventionModal(false)}
                className="px-4 py-2 bg-[#fbf8ee] hover:bg-[#f7f2e4] text-slate-700 border border-[#e2d6bc] text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateIntervention}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Dispatch State Intervention
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
