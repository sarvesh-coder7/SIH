import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Layers,
  History,
  Building2,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ChallengeAttemptsHistory } from './ChallengeAttemptsHistory';

export const UniversityApplicationsPage: React.FC = () => {
  const {
    challenges,
    currentUser,
    setCurrentView,
    setSelectedChallengeId,
    setSelectedProjectId,
    grantOfficialAssignment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'under_review' | 'assigned'>('all');
  const [historyChallengeId, setHistoryChallengeId] = useState<string | null>(null);

  // Find all challenges where this university has submitted an EOI or is assigned
  const univName = currentUser.organization || 'Birla Institute of Technology (BIT) Mesra';

  const relevantChallenges = challenges.filter((c) => {
    const hasEoi = (c.expressionsOfInterest || []).some(
      (e) => e.universityName === univName || e.universityId === currentUser.id
    );
    const isAssigned =
      c.assignedUniversityName === univName ||
      c.officialAssignment?.assignedToUniversity === univName;
    return hasEoi || isAssigned || c.id === 'JH-2026-0042';
  });

  const filteredChallenges = relevantChallenges.filter((c) => {
    const isAssigned =
      c.status === 'Assigned' ||
      c.status === 'In Development' ||
      c.officialAssignment?.status === 'Active Workspace';
    if (activeTab === 'assigned') return isAssigned;
    if (activeTab === 'under_review') return !isAssigned;
    return true;
  });

  const selectedChallengeForHistory = challenges.find((c) => c.id === historyChallengeId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                Institutional Portfolio
              </span>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {univName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              My Applications & Expressions of Interest
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Track the full workflow from <strong>Express Interest &rarr; Initial Approach Submitted &rarr; Under Review &rarr; Official Assignment (Official Attempt #1)</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('university-challenges')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <span>Discover New Challenges</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Workflow Concept Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Step 1</span>
            <span className="font-bold text-slate-800 block mt-0.5">Discover</span>
            <p className="text-[11px] text-slate-500 mt-0.5">All universities see: &ldquo;Problem is available&rdquo;.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">Step 2</span>
            <span className="font-bold text-blue-800 block mt-0.5">Express Interest</span>
            <p className="text-[11px] text-slate-500 mt-0.5">&ldquo;We believe we can work on this&rdquo; + Initial Approach.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-amber-300 bg-amber-50/50">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Step 3 (Status)</span>
            <span className="font-bold text-amber-900 block mt-0.5">Under Review</span>
            <p className="text-[11px] text-amber-700 mt-0.5">University does not own challenge yet.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-emerald-300 bg-emerald-50/50">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Step 4 (Decision)</span>
            <span className="font-bold text-emerald-900 block mt-0.5">Official Assignment</span>
            <p className="text-[11px] text-emerald-700 mt-0.5">Official Attempt #1 &rarr; Workspace Unlocked.</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Applications ({relevantChallenges.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('under_review')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'under_review'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Under Review (Not Owned Yet)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
            {relevantChallenges.filter((c) => c.status !== 'Assigned' && c.status !== 'In Development').length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assigned')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'assigned'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Officially Assigned (Active Workspaces)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
            {relevantChallenges.filter((c) => c.status === 'Assigned' || c.status === 'In Development').length}
          </span>
        </button>
      </div>

      {/* History Dossier Modal if triggered */}
      {selectedChallengeForHistory && (
        <ChallengeAttemptsHistory
          challenge={selectedChallengeForHistory}
          onClose={() => setHistoryChallengeId(null)}
          onOpenWorkspace={() => {
            setSelectedProjectId(selectedChallengeForHistory.projectId || 'PROJ-JH-2026-0081');
            setCurrentView('project-workspace');
          }}
        />
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No applications in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore open community challenges and express interest with your university&apos;s initial technical approach.
            </p>
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const isAssigned =
              challenge.status === 'Assigned' ||
              challenge.status === 'In Development' ||
              challenge.officialAssignment?.status === 'Active Workspace';

            const userEoi =
              (challenge.expressionsOfInterest || []).find(
                (e) => e.universityName === univName || e.universityId === currentUser.id
              ) || (challenge.expressionsOfInterest || [])[0];

            return (
              <div
                key={challenge.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {challenge.id}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {challenge.category} &bull; {challenge.district}
                      </span>

                      {isAssigned ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          OFFICIAL ASSIGNMENT (Attempt #1 Active)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          UNDER REVIEW (Not Owned Yet)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedChallengeId(challenge.id);
                          setCurrentView('challenge-detail');
                        }}>
                      {challenge.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Attempt History Button */}
                    <button
                      type="button"
                      onClick={() => setHistoryChallengeId(challenge.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Preserved Attempts ({challenge.attemptsHistory?.length || 3})</span>
                    </button>
                  </div>
                </div>

                {/* Submitted Initial Approach Box */}
                {userEoi && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>Submitted Initial Technical Approach</span>
                      <span>Faculty Lead: {userEoi.facultyLead} ({userEoi.department})</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {userEoi.initialApproach}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                      <span>Target Timeline: <strong>{userEoi.targetTimeline}</strong></span>
                      <span>Student Cohort: <strong>{userEoi.studentCohortSize} researchers</strong></span>
                      <span>Equipment/Lab: <strong>{userEoi.resourcesNeeded}</strong></span>
                    </div>
                  </div>
                )}

                {/* State Government Decision & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-slate-600">
                    {isAssigned ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Official Assignment Sanctioned by Jharkhand State PMU. Project Workspace is active.
                      </span>
                    ) : (
                      <span className="text-amber-800 font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Under review by State Higher Education Screening Committee. Final decision expected within 5 working days.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isAssigned ? (
                      <button
                        type="button"
                        onClick={() => grantOfficialAssignment(challenge.id, univName, 1)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        title="Simulate Government Official Assignment decision"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Simulate Govt Decision &rarr; Grant Official Assignment</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProjectId(challenge.projectId || 'PROJ-JH-2026-0081');
                          setCurrentView('project-workspace');
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Launch Project Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
