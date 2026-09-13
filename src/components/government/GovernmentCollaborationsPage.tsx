import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryCollaboration } from '../../types/industry';
import { IndustrySolutionSubmission } from '../../types';
import {
  Handshake,
  Search,
  Building2,
  DollarSign,
  Briefcase,
  FileCheck,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  Clock,
  Send,
  Check,
  X,
  MessageSquare,
  FileText,
  Layers,
  GraduationCap,
  ShieldCheck,
  Filter,
} from 'lucide-react';

export const GovernmentCollaborationsPage: React.FC = () => {
  const {
    collaborations,
    projects,
    challenges,
    industrySubmissions,
    reviewIndustrySubmission,
    showToast,
    setSelectedChallengeId,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'submissions' | 'collaborations'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<string>('All');

  // Modal for Government Decision
  const [decisionModalSub, setDecisionModalSub] = useState<IndustrySolutionSubmission | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'COLLABORATION_ACCEPTED' | 'REJECTED'>('APPROVED');
  const [decisionNotes, setDecisionNotes] = useState('');

  const formatFullDateTime = (dateVal?: string | Date) => {
    if (!dateVal) return 'Recent';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Filtered Collaborations
  const filteredCollaborations = collaborations.filter((c) => {
    if (typeFilter !== 'All' && !c.collaboration_types.some((t) => t.includes(typeFilter))) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.industry_name.toLowerCase().includes(q) ||
        c.project_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Industry Submissions
  const filteredSubmissions = industrySubmissions.filter((s) => {
    if (submissionStatusFilter !== 'All' && s.status !== submissionStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchIndustry = s.industryName.toLowerCase().includes(q);
      const matchTitle = s.solutionTitle.toLowerCase().includes(q);
      const matchChallenge = s.challengeTitle.toLowerCase().includes(q) || s.challengeId.toLowerCase().includes(q);
      if (!matchIndustry && !matchTitle && !matchChallenge) return false;
    }
    return true;
  });

  const totalCSRCommitted = collaborations.reduce((acc, c) => {
    return acc + (c.collaboration_types.some((t) => t.toLowerCase().includes('funding')) ? 750000 : 350000);
  }, 0);

  const handleOpenDecisionModal = (
    sub: IndustrySolutionSubmission,
    type: 'APPROVED' | 'COLLABORATION_ACCEPTED' | 'REJECTED'
  ) => {
    setDecisionModalSub(sub);
    setDecisionType(type);
    setDecisionNotes(
      type === 'APPROVED'
        ? 'Solution vetted and sanctioned by State PMU. Selected as primary implementation package.'
        : type === 'COLLABORATION_ACCEPTED'
        ? `Sanctioned public-private joint collaboration with ${sub.targetUniversityName || 'University Partner'}. Milestone tranches linked to capstone schedule.`
        : 'Please update testing telemetry with 3 additional panchayat field readings and submit revised BOM.'
    );
  };

  const handleConfirmDecision = () => {
    if (!decisionModalSub) return;
    reviewIndustrySubmission(decisionModalSub.id, decisionType, decisionNotes);
    setDecisionModalSub(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider">
            <Handshake className="w-4 h-4 text-purple-600" />
            <span>Public-Private & Industry Partnerships Desk</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Industry & MSME Collaboration Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review industry solutions submitted for Open Problem Statements, choose official implementation solutions,
            and sanction joint university-industry collaborations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-[#e2d6bc] shadow-xs text-xs">
            <span className="text-slate-500">Total CSR Committed:</span>{' '}
            <strong className="text-purple-800 font-bold">
              ₹{(totalCSRCommitted / 100000).toFixed(2)} Lakhs
            </strong>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#e2d6bc] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-[#e2d6bc]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Industry Problem Submissions & Results</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'submissions'
                ? 'bg-purple-900/60 text-purple-100'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {industrySubmissions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('collaborations')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'collaborations'
              ? 'bg-purple-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-[#e2d6bc]'
          }`}
        >
          <Handshake className="w-4 h-4 text-purple-300" />
          <span>Active Collaborations & CSR</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'collaborations'
                ? 'bg-purple-900/60 text-purple-100'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {collaborations.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INDUSTRY PROBLEM STATEMENT SUBMISSIONS & RESULTS */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {/* Submissions Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search industry name, challenge title, or solution..."
                className="w-full pl-9 pr-4 py-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="w-full sm:w-64">
              <select
                value={submissionStatusFilter}
                onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="All">All Review Statuses</option>
                <option value="Submitted to Government">Submitted to Government</option>
                <option value="Government Approved">Government Approved</option>
                <option value="Collaboration Accepted">Collaboration Accepted</option>
                <option value="Revision Requested">Revision Requested</option>
              </select>
            </div>
          </div>

          {/* Submissions List */}
          <div className="grid grid-cols-1 gap-5">
            {filteredSubmissions.map((sub) => {
              const matchedChallenge = challenges.find((c) => c.id === sub.challengeId);

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all p-5 sm:p-6 space-y-4"
                >
                  {/* Top Meta */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {sub.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            sub.status === 'Government Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : sub.status === 'Collaboration Accepted'
                              ? 'bg-teal-100 text-teal-800 border border-teal-300'
                              : sub.status === 'Revision Requested'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {sub.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Submitted: {formatFullDateTime(sub.submittedAt)}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-700 shrink-0" />
                        <span>{sub.industryName}</span>
                        <span className="text-slate-400 font-normal text-xs">
                          (Lead: {sub.submittedBy} • {sub.contactEmail})
                        </span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1.5">
                        {sub.collaborationMode === 'Collaborate with University' ? (
                          <>
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Collab: {sub.targetUniversityName || 'University Partner'}</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Direct Turnkey Industry Solution</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Target Challenge Info */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Target Problem Statement
                      </span>
                      <span className="font-bold text-slate-800">
                        {sub.challengeId}: {sub.challengeTitle}
                      </span>
                    </div>
                    {matchedChallenge && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChallengeId(matchedChallenge.id);
                          setCurrentView('government-challenges');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Statement</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Solution Details & Test Results */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Solution Title & Mechanism
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{sub.solutionTitle}</h4>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{sub.summary}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-xs">
                      <span className="font-bold text-purple-950 block mb-1">
                        Prototype Test Results & Performance Metrics:
                      </span>
                      <p className="text-purple-900 leading-relaxed">{sub.technicalDetails}</p>
                      {sub.resultsMetrics && (
                        <p className="text-purple-800 font-semibold mt-1">
                          Key Metrics: {sub.resultsMetrics}
                        </p>
                      )}
                    </div>

                    {/* Deliverable Documents */}
                    {sub.resultsDocuments && sub.resultsDocuments.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Attached Deliverables & Test Logs ({sub.resultsDocuments.length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sub.resultsDocuments.map((doc, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-1.5 bg-[#fbf8ee] rounded-lg border border-[#e2d6bc] text-xs text-slate-700 flex items-center gap-2"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-medium">{doc.name}</span>
                              <span className="text-[10px] text-slate-400">({doc.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Budget & Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>CSR / Budget Commitment: <strong className="text-slate-900">{sub.budgetOrCsrCommitment || 'N/A'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Estimated Deployment Timeline: <strong className="text-slate-900">{sub.timelineEstimate}</strong></span>
                      </div>
                    </div>

                    {/* Government Notes if already reviewed */}
                    {sub.governmentNotes && (
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                        <span className="font-bold text-slate-800 block">State PMU Review Record:</span>
                        <span className="text-slate-600 mt-0.5 block">{sub.governmentNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Government Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Government Action Required: Choose solution for implementation or sanction university collaboration.
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDecisionModal(sub, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Request Revision</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDecisionModal(sub, 'COLLABORATION_ACCEPTED')}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Handshake className="w-3.5 h-3.5" />
                        <span>Sanction University Collaboration</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDecisionModal(sub, 'APPROVED')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Choose / Sanction Industry Solution</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No Submissions Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No industry solutions match the active search or filter. Submissions uploaded from the Industry portal will appear here immediately for Government sanction.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACTIVE COLLABORATIONS & CSR (EXISTING) */}
      {/* ========================================================================= */}
      {activeTab === 'collaborations' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company name or project ID..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="w-full sm:w-60">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="All">All Partnership Types</option>
                <option value="Funding / CSR Support">Funding / CSR Support</option>
                <option value="Manufacturing & Prototyping">Manufacturing & Prototyping</option>
                <option value="Testing & Validation Lab">Testing & Validation Lab</option>
                <option value="Technical Mentorship">Technical Mentorship</option>
                <option value="Pilot Deployment Site">Pilot Deployment Site</option>
              </select>
            </div>
          </div>

          {/* Collaborations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCollaborations.map((collab) => {
              const associatedProject = projects.find((p) => p.id === collab.project_id);

              return (
                <div
                  key={collab.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          {collab.industry_id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          {collab.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {collab.industry_name}
                      </h3>
                      <div className="text-xs text-indigo-700 font-medium mt-0.5">
                        Co-developing Project: {collab.project_id}
                        {associatedProject && ` (${associatedProject.title})`}
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Supported types */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Active Contributions
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {collab.collaboration_types.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contribution details */}
                  {collab.contributions && collab.contributions.length > 0 && (
                    <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-teal-900">
                          Documented Deliverables ({collab.contributions.length})
                        </span>
                        <strong className="text-teal-800 text-xs">
                          {collab.contributions[0].contribution_type}
                        </strong>
                      </div>
                      <div className="text-[11px] text-teal-700 mt-1 line-clamp-2">
                        {collab.contributions[0].description}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>Started {collab.started_at ? new Date(collab.started_at).toLocaleDateString() : 'Active'}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Entity</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredCollaborations.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No industry partnerships match the selected filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DECISION MODAL */}
      {/* ========================================================================= */}
      {decisionModalSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  State Government Sanction
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {decisionType === 'APPROVED'
                    ? 'Sanction Industry Implementation Solution'
                    : decisionType === 'COLLABORATION_ACCEPTED'
                    ? 'Sanction University-Industry Joint Collaboration'
                    : 'Request Submission Revision'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDecisionModalSub(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                <strong>Industry Partner:</strong> {decisionModalSub.industryName}
              </p>
              <p>
                <strong>Solution:</strong> {decisionModalSub.solutionTitle}
              </p>
              <p>
                <strong>Challenge Target:</strong> #{decisionModalSub.challengeId}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Official Sanction Order / Review Notes:
              </label>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDecisionModalSub(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 ${
                  decisionType === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : decisionType === 'COLLABORATION_ACCEPTED'
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Confirm Decision</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
