import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge, ExpressionOfInterest } from '../../types';
import {
  Building2,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
  History,
  Info,
  Check,
  X,
} from 'lucide-react';

export const GovernmentAssignmentsPage: React.FC = () => {
  const {
    challenges,
    confirmUniversityAssignment,
    selectedChallengeId,
    setSelectedChallengeId,
    currentGovernmentMember,
  } = useApp();

  // Find challenges that are Validated or have EOIs or need official assignment
  const assignableChallenges = challenges.filter(
    (c) => c.status === 'Validated' || c.status === 'Assigned' || (c.expressionsOfInterest && c.expressionsOfInterest.length > 0)
  );

  const [activeChallengeId, setActiveChallengeId] = useState<string>(
    selectedChallengeId || (assignableChallenges[0]?.id || '')
  );

  const activeChallenge = challenges.find((c) => c.id === activeChallengeId) || assignableChallenges[0];

  // Assignment form state
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [assignmentReason, setAssignmentReason] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSelectUniversity = (eoi: ExpressionOfInterest) => {
    setSelectedUniversityName(eoi.universityName);
    setAssignmentReason(`Assigned based on multidisciplinary feasibility, strong faculty leadership (${eoi.facultyLead}), and practical timeline (${eoi.projectedTimelineMonths} months).`);
  };

  const handleOpenConfirm = () => {
    if (!selectedUniversityName) {
      alert('Please select a university to assign.');
      return;
    }
    if (!assignmentReason.trim()) {
      alert('Please enter an official justification/reason for this academic assignment.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecuteAssignment = () => {
    if (!activeChallenge || !selectedUniversityName) return;

    confirmUniversityAssignment(
      activeChallenge.id,
      selectedUniversityName,
      assignmentReason,
      assignmentNotes
    );

    setShowConfirmModal(false);
    setSelectedUniversityName('');
    setAssignmentReason('');
    setAssignmentNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>State Academic Allocation Desk</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            University Assignment & Cohort Sanctioning
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate Expressions of Interest (EOIs) from universities and sanction official capstone project mandates with full attempt lineage.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500">Assignable Queue:</span>
          <span className="text-indigo-800 font-bold">{assignableChallenges.length} Challenges</span>
        </div>
      </div>

      {/* Main Split Layout: Challenge Selector on Left, Detail & Decision on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Challenges */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Challenges Ready for University Matching ({assignableChallenges.length})
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {assignableChallenges.map((ch) => {
              const isSelected = ch.id === activeChallenge?.id;
              const hasAssignment = ch.officialAssignment || ch.assignedUniversityName;
              const eoiCount = ch.expressionsOfInterest?.length || 0;

              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setActiveChallengeId(ch.id);
                    setSelectedUniversityName('');
                    setAssignmentReason('');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-slate-700">{ch.id}</span>
                    {hasAssignment ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Assigned
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        {eoiCount} EOIs Submitted
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {ch.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                    <span>{ch.district}</span>
                    <span>•</span>
                    <span>Pop: {ch.affectedPopulation.toLocaleString()}</span>
                  </div>

                  {hasAssignment && (
                    <div className="mt-2 text-[11px] font-semibold text-indigo-700 bg-white/70 p-1.5 rounded-lg border border-indigo-100">
                      Assigned: {ch.assignedUniversityName || ch.officialAssignment?.assignedToUniversity}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail & Assignment Console */}
        <div className="lg:col-span-8 space-y-6">
          {activeChallenge ? (
            <>
              {/* Challenge Overview Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {activeChallenge.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {activeChallenge.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {activeChallenge.trustStatus || 'Verified'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    District: <strong className="text-slate-800">{activeChallenge.district}</strong> ({activeChallenge.block})
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeChallenge.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {activeChallenge.description}
                  </p>
                </div>

                {/* Multi-University Attempt History */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <History className="w-4 h-4 text-indigo-600" />
                      <span>University Attempt History & Lineage</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Total Attempts: {(activeChallenge.attemptsHistory?.length || 0) + (activeChallenge.officialAssignment ? 1 : 0)}
                    </span>
                  </div>

                  {activeChallenge.attemptsHistory && activeChallenge.attemptsHistory.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {activeChallenge.attemptsHistory.map((att) => (
                        <div
                          key={att.attemptNumber}
                          className="p-3 bg-white rounded-lg border border-slate-200 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              Attempt #{att.attemptNumber}: {att.universityName}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {att.status} ({att.period})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1">
                            <strong>What was tried:</strong> {att.approach}
                          </div>
                          <div className="text-[11px] text-amber-800 mt-0.5">
                            <strong>Outcome / Reason for Failure:</strong> {att.failureReason}
                          </div>
                          <div className="text-[11px] text-emerald-800 mt-0.5">
                            <strong>Lessons learned:</strong> {att.lessonsLearned}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic">
                      This is Attempt #1 for this challenge. No previous institutional attempts recorded.
                    </div>
                  )}

                  {activeChallenge.officialAssignment && (
                    <div className="mt-3 p-3 bg-indigo-50/80 rounded-lg border border-indigo-200 text-xs text-indigo-900">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        <span>Active Official Sanction: {activeChallenge.officialAssignment.assignedToUniversity}</span>
                      </div>
                      <div className="text-[11px] text-indigo-700 mt-0.5">
                        Sanctioned by {activeChallenge.officialAssignment.assignedBy} on {activeChallenge.officialAssignment.assignedDate}. Project Workspace is active.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Competing University EOIs */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>Interested Universities & Expressions of Interest</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Compare technical approaches, faculty leadership, and feasibility before sanctioning official mandate
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                    {activeChallenge.expressionsOfInterest?.length || 0} EOIs
                  </span>
                </div>

                {activeChallenge.expressionsOfInterest && activeChallenge.expressionsOfInterest.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeChallenge.expressionsOfInterest.map((eoi) => {
                      const isSelectedForAssignment = selectedUniversityName === eoi.universityName;
                      const isAlreadyAssigned =
                        activeChallenge.officialAssignment?.assignedToUniversity === eoi.universityName ||
                        activeChallenge.assignedUniversityName === eoi.universityName;

                      return (
                        <div
                          key={eoi.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isSelectedForAssignment
                              ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-400'
                              : isAlreadyAssigned
                              ? 'bg-emerald-50/50 border-emerald-300'
                              : 'bg-white border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {eoi.department}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                                {eoi.universityName}
                              </h4>
                            </div>
                            {isAlreadyAssigned ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                                Officially Sanctioned
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-500">
                                Submitted {eoi.submittedDate}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                            <div><strong>Lead Faculty:</strong> {eoi.facultyLead}</div>
                            <div><strong>Cohort Size:</strong> {eoi.studentCohortSize} Students</div>
                            <div><strong>Projected Timeline:</strong> {eoi.projectedTimelineMonths} Months</div>
                            <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 mt-2">
                              <strong>Proposed Approach:</strong> {eoi.approachProposal}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-700">
                              Feasibility: {eoi.feasibilityScore || 'High (88%)'}
                            </span>

                            {!isAlreadyAssigned && (
                              <button
                                onClick={() => handleSelectUniversity(eoi)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  isSelectedForAssignment
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                }`}
                              >
                                {isSelectedForAssignment ? 'Selected for Sanction' : 'Select University'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    No academic EOIs received yet for this challenge.
                  </div>
                )}
              </div>

              {/* Sanction Decision Panel */}
              <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xs border border-[#e2d6bc] space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    Official State Sanction
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Sanction University Capstone Assignment
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Issuing this sanction creates an official state mandate for the university team to begin Phase 1 R&D.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assigned University *
                    </label>
                    <input
                      type="text"
                      value={selectedUniversityName}
                      onChange={(e) => setSelectedUniversityName(e.target.value)}
                      placeholder="e.g. Birla Institute of Technology, Mesra"
                      className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sanctioning Authority
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`${currentGovernmentMember.name} (${currentGovernmentMember.department_name})`}
                      className="w-full p-2.5 bg-[#f7f2e4] border border-[#e2d6bc] rounded-xl text-xs text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Reason / Technical Justification *
                  </label>
                  <textarea
                    value={assignmentReason}
                    onChange={(e) => setAssignmentReason(e.target.value)}
                    placeholder="Enter the justification for assigning this challenge to this university (e.g. domain expertise, past record, lab capabilities)..."
                    rows={2}
                    className="w-full p-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Attempt #
                    {(activeChallenge.attemptsHistory?.length || 0) + 1}
                  </div>
                  <button
                    onClick={handleOpenConfirm}
                    className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Sanction & Notify University</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-[#e2d6bc] shadow-xs">
              Select a challenge to view expressions of interest and sanction university assignments.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmModal && activeChallenge && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e2d6bc] space-y-4 text-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Official Sanction
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  You are sanctioning an official state assignment of Challenge #{activeChallenge.id} to{' '}
                  <strong className="text-slate-900">{selectedUniversityName}</strong>.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs space-y-1 text-slate-700">
              <div><strong>Sanctioning Official:</strong> {currentGovernmentMember.name}</div>
              <div><strong>Department:</strong> {currentGovernmentMember.department_name}</div>
              <div><strong>Attempt Number:</strong> #{(activeChallenge.attemptsHistory?.length || 0) + 1}</div>
              <div><strong>Recorded Justification:</strong> {assignmentReason}</div>
            </div>

            <p className="text-[11px] text-slate-500">
              This will update the challenge to 'Assigned', activate the project workspace, and dispatch official notifications to the university and citizen.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAssignment}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Sanction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
