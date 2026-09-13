import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  XCircle,
  Copy,
  Archive,
  Search,
  MapPin,
  FileText,
  Calendar,
  Users,
  ShieldCheck,
  Check,
  X,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const GovernmentVerificationPage: React.FC = () => {
  const {
    challenges,
    verifyChallenge,
    selectedChallengeId,
    setSelectedChallengeId,
    currentGovernmentMember,
    activityLogs,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQueueTab, setSelectedQueueTab] = useState<'ALL' | 'UNVERIFIED' | 'UNDER_REVIEW' | 'VERIFIED'>('UNVERIFIED');

  // Modal states
  const [activeModalChallenge, setActiveModalChallenge] = useState<Challenge | null>(
    selectedChallengeId
      ? challenges.find(
          (c) => c.id === selectedChallengeId || (c.trackingId && c.trackingId === selectedChallengeId)
        ) || null
      : null
  );
  const [decisionAction, setDecisionAction] = useState<
    'VERIFIED' | 'REQUEST_MORE_INFO' | 'FLAG' | 'REJECT' | 'DUPLICATE' | 'ARCHIVE' | null
  >(null);
  const [officialReason, setOfficialReason] = useState('');
  const [duplicateOfId, setDuplicateOfId] = useState('');

  // Request more info checkboxes
  const [requestedCheckboxes, setRequestedCheckboxes] = useState({
    needClearPhoto: false,
    needGpsCoordinates: false,
    needGramSabhaResolution: false,
    needPopulationEstimate: false,
    needSeasonalNotes: false,
  });

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Filter queue
  const filteredQueue = challenges.filter((c) => {
    const trust = c.trustStatus || 'Community Report';
    const isVerified = trust === 'Verified' || c.status === 'Validated';
    const isUnderReview = trust === 'Under Review' || c.status === 'Under Review';

    if (selectedQueueTab === 'UNVERIFIED' && isVerified) return false;
    if (selectedQueueTab === 'UNDER_REVIEW' && !isUnderReview) return false;
    if (selectedQueueTab === 'VERIFIED' && !isVerified) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.trackingId && c.trackingId.toLowerCase().includes(q)) ||
        c.district.toLowerCase().includes(q) ||
        c.block.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenActionModal = (
    challenge: Challenge,
    action: 'VERIFIED' | 'REQUEST_MORE_INFO' | 'FLAG' | 'REJECT' | 'DUPLICATE' | 'ARCHIVE'
  ) => {
    setActiveModalChallenge(challenge);
    setDecisionAction(action);
    setOfficialReason('');
    setDuplicateOfId('');
    setRequestedCheckboxes({
      needClearPhoto: false,
      needGpsCoordinates: false,
      needGramSabhaResolution: false,
      needPopulationEstimate: false,
      needSeasonalNotes: false,
    });
    setShowConfirmDialog(false);
  };

  const handleTriggerConfirm = () => {
    if (!officialReason.trim() && decisionAction !== 'VERIFIED') {
      alert('Please provide an official reason/note for this decision.');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleExecuteVerification = () => {
    if (!activeModalChallenge || !decisionAction) return;

    let finalReason = officialReason.trim() || 'Verified by State Authority after field review.';

    if (decisionAction === 'REQUEST_MORE_INFO') {
      const neededItems: string[] = [];
      if (requestedCheckboxes.needClearPhoto) neededItems.push('Clear Geo-Tagged Photo of Site');
      if (requestedCheckboxes.needGpsCoordinates) neededItems.push('Accurate GPS Coordinates');
      if (requestedCheckboxes.needGramSabhaResolution) neededItems.push('Gram Sabha / PRI Verification Letter');
      if (requestedCheckboxes.needPopulationEstimate) neededItems.push('Verified Beneficiary / Population Count');
      if (requestedCheckboxes.needSeasonalNotes) neededItems.push('Seasonal / Frequency Details');

      if (neededItems.length > 0) {
        finalReason += ` Required Items: [${neededItems.join(', ')}].`;
      }
    }

    if (decisionAction === 'DUPLICATE' && duplicateOfId) {
      finalReason += ` Marked as duplicate of Challenge #${duplicateOfId}.`;
    }

    // Call context method
    verifyChallenge(activeModalChallenge.id, decisionAction, finalReason);

    // Close modals
    setShowConfirmDialog(false);
    setActiveModalChallenge(null);
    setDecisionAction(null);
    setSelectedChallengeId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>State Verification & Due Diligence Desk</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Challenge Verification Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Validate grassroots problems submitted by citizens. Approved challenges proceed to university matching and official capstone R&D.
          </p>
        </div>

        {/* Verification Stats pill */}
        <div className="flex items-center gap-2 text-xs font-semibold bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500">Queue Status:</span>
          <span className="text-amber-800 font-bold">
            {challenges.filter((c) => c.trustStatus !== 'Verified' && c.status !== 'Validated').length} Awaiting Verification
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            {[
              { id: 'UNVERIFIED', label: 'Needs Verification' },
              { id: 'UNDER_REVIEW', label: 'Under Review' },
              { id: 'VERIFIED', label: 'Verified & Approved' },
              { id: 'ALL', label: 'All Submissions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedQueueTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedQueueTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, title, block..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Verification Process Explanation */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">1</span>
            <span>Citizen / PRI Submission</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-900 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center text-[10px]">2</span>
            <span>Ground Evidence Check</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-amber-50 text-amber-900 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 font-bold flex items-center justify-center text-[10px]">3</span>
            <span>Desk Due Diligence</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-900 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-[10px]">4</span>
            <span>State Verification Granted</span>
          </div>
        </div>
      </div>

      {/* Queue Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQueue.map((ch) => {
          const isVerified = ch.trustStatus === 'Verified' || ch.status === 'Validated';

          return (
            <div
              key={ch.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs ${
                isVerified ? 'border-slate-200' : 'border-amber-200 bg-amber-50/10'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {ch.trackingId || ch.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ch.trustStatus || 'Community Report'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {ch.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Submitted: {ch.submittedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                    {ch.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ch.district}, {ch.block}, {ch.village}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Affected Population: {ch.affectedPopulation.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ch.evidence.length} Evidence Artifacts</span>
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  {!isVerified ? (
                    <>
                      <button
                        onClick={() => handleOpenActionModal(ch, 'VERIFIED')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify Challenge</span>
                      </button>

                      <button
                        onClick={() => handleOpenActionModal(ch, 'REQUEST_MORE_INFO')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <FileQuestion className="w-3.5 h-3.5 text-amber-600" />
                        <span>Request Info</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenActionModal(ch, 'FLAG')}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-lg"
                        >
                          Flag
                        </button>
                        <button
                          onClick={() => handleOpenActionModal(ch, 'REJECT')}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold rounded-lg"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleOpenActionModal(ch, 'DUPLICATE')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg"
                        >
                          Duplicate
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Officially Verified</span>
                      </span>
                      <button
                        onClick={() => handleOpenActionModal(ch, 'FLAG')}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-2"
                      >
                        Re-evaluate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredQueue.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No challenges found in this queue category.
          </div>
        )}
      </div>

      {/* Verification Decision Modal */}
      {activeModalChallenge && decisionAction && !showConfirmDialog && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Government Verification Action
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {decisionAction === 'VERIFIED' && 'Confirm Official State Verification'}
                  {decisionAction === 'REQUEST_MORE_INFO' && 'Request Additional Verification Details'}
                  {decisionAction === 'FLAG' && 'Flag Challenge for Internal Review'}
                  {decisionAction === 'REJECT' && 'Reject Grassroots Challenge'}
                  {decisionAction === 'DUPLICATE' && 'Link as Duplicate Challenge'}
                  {decisionAction === 'ARCHIVE' && 'Archive Challenge'}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Challenge #{activeModalChallenge.id}: {activeModalChallenge.title}
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveModalChallenge(null);
                  setDecisionAction(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checklist for REQUEST_MORE_INFO */}
            {decisionAction === 'REQUEST_MORE_INFO' && (
              <div className="space-y-2 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                <div className="font-bold text-amber-900">Select Specific Information Required:</div>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={requestedCheckboxes.needClearPhoto}
                    onChange={(e) =>
                      setRequestedCheckboxes({ ...requestedCheckboxes, needClearPhoto: e.target.checked })
                    }
                    className="rounded text-emerald-600"
                  />
                  <span>Clear geo-tagged photo of physical problem site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={requestedCheckboxes.needGpsCoordinates}
                    onChange={(e) =>
                      setRequestedCheckboxes({ ...requestedCheckboxes, needGpsCoordinates: e.target.checked })
                    }
                    className="rounded text-emerald-600"
                  />
                  <span>Precise GPS coordinates (latitude / longitude)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={requestedCheckboxes.needGramSabhaResolution}
                    onChange={(e) =>
                      setRequestedCheckboxes({ ...requestedCheckboxes, needGramSabhaResolution: e.target.checked })
                    }
                    className="rounded text-emerald-600"
                  />
                  <span>Gram Sabha / Panchayat endorsement letter or resolution</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={requestedCheckboxes.needPopulationEstimate}
                    onChange={(e) =>
                      setRequestedCheckboxes({ ...requestedCheckboxes, needPopulationEstimate: e.target.checked })
                    }
                    className="rounded text-emerald-600"
                  />
                  <span>Survey / estimate of affected households or beneficiaries</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={requestedCheckboxes.needSeasonalNotes}
                    onChange={(e) =>
                      setRequestedCheckboxes({ ...requestedCheckboxes, needSeasonalNotes: e.target.checked })
                    }
                    className="rounded text-emerald-600"
                  />
                  <span>Seasonal variability or timeline history details</span>
                </label>
              </div>
            )}

            {/* Input for Duplicate ID */}
            {decisionAction === 'DUPLICATE' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Original Master Challenge ID *
                </label>
                <input
                  type="text"
                  value={duplicateOfId}
                  onChange={(e) => setDuplicateOfId(e.target.value)}
                  placeholder="e.g. CH-2026-001"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            )}

            {/* Reason Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Review Notes / Reason {decisionAction !== 'VERIFIED' ? '*' : '(Optional)'}
              </label>
              <textarea
                value={officialReason}
                onChange={(e) => setOfficialReason(e.target.value)}
                placeholder={
                  decisionAction === 'VERIFIED'
                    ? 'State verification remarks, desk inspection findings, or allocation priority notes...'
                    : 'Explain the reasoning for this decision. This will be recorded in the audit trail and shared with the submitter...'
                }
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveModalChallenge(null);
                  setDecisionAction(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerConfirm}
                className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs text-white ${
                  decisionAction === 'VERIFIED'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : decisionAction === 'REJECT'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                Continue to Finalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Confirmation Dialog */}
      {showConfirmDialog && activeModalChallenge && decisionAction && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Official Decision
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  You are about to record <strong className="text-slate-900">{decisionAction}</strong> for Challenge #{activeModalChallenge.id}.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
              <div><strong>Official:</strong> {currentGovernmentMember.name}</div>
              <div><strong>Department:</strong> {currentGovernmentMember.department_name}</div>
              <div><strong>Audit Reason:</strong> {officialReason || 'Official verification completed.'}</div>
            </div>

            <p className="text-[11px] text-slate-500">
              This action will be stamped permanently into the immutable state activity log, and will notify the citizen submitter.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleExecuteVerification}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Execute Official Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
