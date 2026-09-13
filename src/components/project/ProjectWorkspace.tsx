import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStage } from '../../types';
import {
  Layers,
  CheckCircle2,
  Clock,
  Circle,
  Users,
  GraduationCap,
  Briefcase,
  DollarSign,
  FileText,
  Upload,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';

export const ALL_PROJECT_STAGES: { stage: ProjectStage; label: string; trl: string; description: string }[] = [
  { stage: '1_Challenge_Ingestion', label: '1. Ingestion & Triage', trl: 'TRL 1', description: 'Citizen problem verification and AI screening' },
  { stage: '2_Institutional_Assignment', label: '2. HEI Assignment', trl: 'TRL 2', description: 'Matched to BIT Mesra / IIT ISM' },
  { stage: '3_Team_Formation', label: '3. Team Formation', trl: 'TRL 2', description: 'Multidisciplinary student & faculty team' },
  { stage: '4_Proposal_Design', label: '4. Proposal & Design', trl: 'TRL 3', description: 'Technical specs & budget itemization' },
  { stage: '5_Proposal_Evaluation_Funding', label: '5. Funding Clearance', trl: 'TRL 3', description: 'CSR & State R&D grant sanction' },
  { stage: '6_Solution_Prototyping', label: '6. Prototyping', trl: 'TRL 4', description: 'Hardware fabrication and firmware code' },
  { stage: '7_Lab_Testing', label: '7. Lab Testing', trl: 'TRL 5', description: 'Water spectrometry & accuracy calibration' },
  { stage: '8_Community_CoDesign_PilotPrep', label: '8. Pilot Prep & Co-Design', trl: 'TRL 6', description: 'Gram Sabha site readiness and orientation' },
  { stage: '9_Field_Deployment', label: '9. Field Deployment', trl: 'TRL 7', description: 'Live pilot testbed installation' },
  { stage: '10_User_Feedback_Iteration', label: '10. Community Feedback', trl: 'TRL 7', description: 'SHG & Jal Sahiya feedback loop' },
  { stage: '11_Govt_Industry_Handover', label: '11. Govt/Industry Handover', trl: 'TRL 8', description: 'PHED & CSR maintenance transfer' },
  { stage: '12_Large_Scale_Implementation', label: '12. Scale Rollout', trl: 'TRL 9', description: 'District-wide replication' },
  { stage: '13_Impact_Measurement', label: '13. Impact Verification', trl: 'TRL 9', description: 'Health & water data validation' },
  { stage: '14_Policy_Feedback_Loop', label: '14. Policy Feedback', trl: 'TRL 9', description: 'State innovation policy update' },
];

export const ProjectWorkspace: React.FC = () => {
  const {
    selectedProjectId,
    projects,
    challenges,
    navigateToChallenge,
    showToast,
    refreshData,
  } = useApp();

  const rawProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [activeTab, setActiveTab] = useState<'lifecycle' | 'milestones' | 'team' | 'budget' | 'evidence'>('lifecycle');

  if (!rawProject) {
    return <div className="p-8 text-center text-slate-500">Project not found.</div>;
  }

  const anyP = rawProject as any;
  const projectTitle =
    rawProject.proposal?.title ||
    rawProject.challengeTitle ||
    anyP.title ||
    'Jal-Shuddhi: Biochar & Alumina Dual-Stage Filtration System';
  const universityName = rawProject.universityName || 'BIT Mesra & IIT (ISM) Dhanbad';
  const trlLevel = rawProject.prototypeStatus?.trlLevel
    ? `TRL ${rawProject.prototypeStatus.trlLevel}`
    : anyP.trlLevel || 'TRL 5';
  const totalBudget =
    rawProject.proposal?.totalBudget ||
    rawProject.proposal?.totalBudgetINR ||
    anyP.totalBudgetINR ||
    480000;
  const teamMembers =
    rawProject.team?.members ||
    anyP.teamMembers ||
    [];
  const milestones = rawProject.milestones || anyP.milestones || [];
  const rawIdx =
    typeof rawProject.currentStageIndex === 'number'
      ? rawProject.currentStageIndex
      : ALL_PROJECT_STAGES.findIndex((s) => s.stage === anyP.currentStage);
  const activeIdx = rawIdx >= 0 ? Math.min(rawIdx, ALL_PROJECT_STAGES.length - 1) : 6;
  const completionPercentage =
    anyP.completionPercentage ||
    Math.min(100, Math.round(((activeIdx + 1) / ALL_PROJECT_STAGES.length) * 100));

  const csrPartner: any = rawProject.industryPartners?.[0] || anyP.csrFunding;
  const csrSponsorName = csrPartner?.partnerName || csrPartner?.sponsorName;
  const csrAmount = csrPartner?.fundingAmount || csrPartner?.amountINR || 350000;


  const handleAdvanceStage = () => {
    if (activeIdx < ALL_PROJECT_STAGES.length - 1) {
      const nextIdx = activeIdx + 1;
      rawProject.currentStageIndex = nextIdx;
      if (rawProject.prototypeStatus) {
        rawProject.prototypeStatus.trlLevel = Math.min(9, Math.floor(nextIdx * 0.6) + 1);
      }
      const nextStageObj = ALL_PROJECT_STAGES[nextIdx];
      showToast(
        'success',
        'Lifecycle Stage Advanced',
        `Project moved to stage ${nextIdx + 1}: ${nextStageObj.label} (${nextStageObj.trl}).`
      );
      refreshData();
    }
  };

  const handleToggleMilestone = (mId: string) => {
    const m = milestones.find((item: any) => item.id === mId);
    if (m) {
      m.completed = !m.completed;
      m.status = m.completed ? 'Completed' : 'In Progress';
      showToast('info', 'Milestone Updated', `Milestone marked as ${m.completed ? 'Completed' : 'Pending'}.`);
      refreshData();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Project Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              {trlLevel} Readiness
            </span>
            <span className="text-slate-400 text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded">
              ID: {rawProject.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
              CSR: {csrSponsorName || 'Open for Co-Sponsor'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              {rawProject.team?.status || anyP.status || 'Active R&D'}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {projectTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              Lead HEI: <strong>{universityName}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Cohort: {teamMembers.length} Multidisciplinary Researchers
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Grant: ₹{(totalBudget || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
            <span>Overall Lifecycle Progress ({activeIdx + 1}/14 Stages)</span>
            <span className="text-amber-400 font-black">{completionPercentage}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
          <button
            onClick={() => navigateToChallenge(rawProject.challengeId)}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
          >
            <span>&larr; View Linked Grassroots Challenge</span>
          </button>

          <button
            onClick={handleAdvanceStage}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Advance to Next Lifecycle Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'lifecycle'
              ? 'border-emerald-700 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>14-Stage Visual Lifecycle</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'milestones'
              ? 'border-emerald-700 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Milestones & Deliverables ({milestones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'team'
              ? 'border-emerald-700 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Multidisciplinary Roster ({teamMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
            activeTab === 'budget'
              ? 'border-emerald-700 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Budget & CSR Utilisation</span>
        </button>
      </div>

      {/* Tab 1: 14-Stage Lifecycle Grid */}
      {activeTab === 'lifecycle' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Full 14-Stage Problem-Solving Lifecycle
              </h3>
              <p className="text-xs text-slate-500">
                End-to-End translation pipeline from citizen submission to state policy integration
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              Current: Stage {activeIdx + 1} of 14
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ALL_PROJECT_STAGES.map((s, idx) => {
              const isCompleted = idx < activeIdx;
              const isCurrent = idx === activeIdx;

              return (
                <div
                  key={s.stage}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20'
                      : isCompleted
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50/60 border-slate-200 opacity-70'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className={`${isCurrent ? 'text-amber-950 font-black' : 'text-slate-900'}`}>
                        {s.label}
                      </strong>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {s.trl}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Project Milestones & Field Deliverables
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Click checkmark to toggle status</span>
          </div>

          <div className="space-y-3">
            {milestones.map((m: any) => (
              <div
                key={m.id}
                onClick={() => handleToggleMilestone(m.id)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  m.completed
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      m.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {m.completed ? '✓' : '○'}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${m.completed ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{m.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Deliverable: <strong>{m.deliverable || 'Field prototype & report'}</strong> &bull; Target: {m.targetDate || m.dueDate || '2026-Q3'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    m.completed ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {m.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Multidisciplinary Team */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-150">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Active Multidisciplinary Research Cohort
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((m: any) => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900">{m.name}</span>
                      {m.isLead && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[9px] font-black uppercase">
                          Lead
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium block">{m.role}</span>
                    <span className="text-[10px] text-slate-400">
                      {m.department} &bull; {m.institution || universityName}
                    </span>
                  </div>
                </div>

                {m.skills && m.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200/60">
                    {m.skills.map((sk: string) => (
                      <span
                        key={sk}
                        className="px-1.5 py-0.5 rounded bg-white text-slate-700 text-[9px] border border-slate-200 font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Budget & CSR */}
      {activeTab === 'budget' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-150">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Grant Allocation & CSR Matching Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-emerald-900 block">Total Sanctioned R&D Budget</span>
              <span className="text-2xl font-black text-emerald-800 mt-1 block">
                ₹{(totalBudget || 0).toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl">
              <span className="text-xs font-bold text-purple-900 block">CSR Matching Partner</span>
              <span className="text-sm font-bold text-purple-950 mt-1 block">
                {csrSponsorName || 'Unsponsored'}
              </span>
              <span className="text-[11px] text-purple-700">
                Grant: ₹{(csrAmount || 0).toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl">
              <span className="text-xs font-bold text-indigo-900 block">Lead Mentorship Cell</span>
              <span className="text-sm font-bold text-indigo-950 mt-1 block">{universityName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
