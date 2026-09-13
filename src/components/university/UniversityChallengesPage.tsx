import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge, ChallengeCategory, ChallengeUrgency } from '../../types';
import { ChallengeEvaluationModal } from './ChallengeEvaluationModal';
import {
  Sparkles,
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

import { challengeService } from '../../services/challengeService';

export const UniversityChallengesPage: React.FC = () => {
  const {
    currentUser,
    challenges,
    navigateToChallenge,
    setCurrentView,
    showToast,
    refreshData,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<ChallengeCategory | 'All'>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<ChallengeUrgency | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'matched' | 'assigned'>('all');
  const [evaluatingChallenge, setEvaluatingChallenge] = useState<Challenge | null>(null);

  // Filter challenges
  const matchedChallenges = challenges.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      (c.trackingId && c.trackingId.toLowerCase().includes(search.toLowerCase()));

    const matchDomain = selectedDomain === 'All' || c.category === selectedDomain;
    const matchUrgency = selectedUrgency === 'All' || c.urgency === selectedUrgency;

    // Must be approved by Government or opened for solutions to appear as an open problem statement
    const isGovApproved =
      c.status === 'Validated' ||
      c.status === 'University Matching' ||
      c.openForSolutions === true ||
      c.trustStatus === 'Verified' ||
      c.status === 'Assigned' ||
      c.status === 'Project Proposed' ||
      c.status === 'In Development';

    if (!isGovApproved && (c.status === 'Submitted' || c.status === 'Under Review')) return false;

    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'matched'
        ? c.status === 'University Matching' || c.status === 'Validated' || c.openForSolutions
        : c.status === 'Assigned' || c.status === 'Project Proposed' || c.status === 'In Development';

    return matchSearch && matchDomain && matchUrgency && matchStatus;
  });

  const handleEvaluationAccept = async (facultyName: string, notes: string) => {
    if (evaluatingChallenge) {
      evaluatingChallenge.status = 'Assigned';
      evaluatingChallenge.assignedUniversityName = currentUser.organization || 'Birla Institute of Technology, Mesra';
      evaluatingChallenge.assignedFacultyName = facultyName;
      try {
        await challengeService.updateChallengeStatus(evaluatingChallenge.id, 'Assigned', {
          actorName: currentUser.name || facultyName,
          actorUserId: currentUser.id,
          notes: `Assigned to ${evaluatingChallenge.assignedUniversityName}, Mentor: ${facultyName}. ${notes || ''}`
        });
        await refreshData();
      } catch (err) {
        console.warn('Failed to update status in Supabase', err);
      }
      showToast('success', 'Assigned to BIT Mesra', `Faculty ${facultyName} designated as Project Director.`);
      setEvaluatingChallenge(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              AI Intelligent Ingestion Queue
            </span>
            <span className="text-xs text-slate-500 font-mono">Domain Match Engine v2.4</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            AI-Matched Community Challenges
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Challenges crowdsourced across 24 Jharkhand districts semantically routed to {currentUser.organization || 'BIT Mesra'} based on lab infrastructure, patent track record, and faculty specializations.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="text-right hidden sm:block">
            <span className="text-2xl font-black text-[#0d5c3a] block leading-tight">{matchedChallenges.length}</span>
            <span className="text-[11px] text-slate-500">Available for R&D</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Total Ingested</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{challenges.length}</span>
          <span className="text-[10px] text-emerald-700 font-bold">24 Districts Covered</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Top Match (&gt;90%)</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">
            {challenges.filter((c) => c.aiAnalysis?.priorityScore > 80).length}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">Recommended for Capstone</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Critical Urgency</span>
          <span className="text-xl font-black text-rose-600 mt-1 block">
            {challenges.filter((c) => c.urgency === 'Critical' || c.urgency === 'High').length}
          </span>
          <span className="text-[10px] text-rose-600 font-bold">Immediate R&D Needed</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Assigned / In Dev</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">
            {challenges.filter((c) => c.status === 'Assigned' || c.status === 'In Development').length}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">Active Capstone Cohorts</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2d6bc] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by problem title, keyword, district (e.g. Khunti, Fluoride, Solar)..."
              className="w-full pl-10 pr-4 py-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d5c3a] focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value as any)}
              className="px-3 py-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0d5c3a] cursor-pointer"
            >
              <option value="All">All Domains</option>
              <option value="Water Resources">Water Resources</option>
              <option value="Agriculture & Rural Economy">Agriculture & Rural Economy</option>
              <option value="Healthcare & Telemedicine">Healthcare & Telemedicine</option>
              <option value="Smart Education & Skilling">Smart Education & Skilling</option>
              <option value="Sanitation & Waste Management">Sanitation & Waste Management</option>
              <option value="Renewable Energy & Power">Renewable Energy & Power</option>
              <option value="Tribal Handicrafts & Value Addition">Tribal Handicrafts</option>
            </select>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value as any)}
              className="px-3 py-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0d5c3a] cursor-pointer"
            >
              <option value="All">All Urgency Levels</option>
              <option value="Critical">Critical Urgency</option>
              <option value="High">High Urgency</option>
              <option value="Medium">Medium Urgency</option>
              <option value="Low">Low Urgency</option>
            </select>

            <div className="flex items-center rounded-xl bg-[#fbf8ee] p-1 border border-[#e2d6bc] text-xs font-bold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-[#0d5c3a] shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('matched')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'matched' ? 'bg-white text-[#0d5c3a] shadow-xs' : 'text-slate-600'
                }`}
              >
                Available ({challenges.filter((c) => c.status === 'University Matching' || c.status === 'Validated').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('assigned')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'assigned' ? 'bg-white text-[#0d5c3a] shadow-xs' : 'text-slate-600'
                }`}
              >
                Assigned
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {matchedChallenges.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No matching challenges found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search criteria or resetting filters to view all available grassroots problems.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedDomain('All');
                setSelectedUrgency('All');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-[#0d5c3a] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#0b4d30] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          matchedChallenges.map((ch) => {
            const isAssigned = ch.status === 'Assigned' || ch.status === 'In Development';
            const matchScore = ch.aiAnalysis?.priorityScore || 88;

            return (
              <div
                key={ch.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2d6bc] shadow-xs hover:border-emerald-400 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2d6bc]/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#fbf8ee] text-slate-700 border border-[#e2d6bc]">
                        {ch.trackingId || ch.id}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ch.category}
                      </span>
                      {ch.subCategory && (
                        <span className="text-[10px] font-medium text-slate-500">
                          &bull; {ch.subCategory}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 hover:text-[#0d5c3a] cursor-pointer transition-colors"
                      onClick={() => navigateToChallenge(ch.id)}
                    >
                      {ch.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {matchScore}% HEI Fit
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        ch.urgency === 'Critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : ch.urgency === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ch.urgency} Urgency
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-3 text-xs text-slate-600">
                    <p className="leading-relaxed text-slate-700">{ch.description}</p>

                    {/* AI Recommendation Reasoning */}
                    {ch.aiAnalysis?.reasoning && (
                      <div className="p-3 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] text-[11px] text-slate-800 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>AI Triage & Recommended HEI Disciplines:</span>
                        </div>
                        <p className="text-slate-600 leading-normal">
                          {ch.aiAnalysis.recommendedDisciplines?.join(', ') || 'Chemical Engineering, Water Sanitation, IoT Sensors'}
                        </p>
                      </div>
                    )}

                    {/* Location & Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ch.village ? `${ch.village}, ` : ''}{ch.block}, {ch.district} District
                      </span>
                      <span>&bull;</span>
                      <span>Affected: <strong>{(ch.affectedPopulation || 0).toLocaleString()}</strong> citizens</span>
                      <span>&bull;</span>
                      <span>Reported by: {ch.submittedBy?.organization || ch.submittedBy?.userName || 'Gram Panchayat'}</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col justify-between gap-2.5 border-t lg:border-t-0 lg:border-l border-[#e2d6bc]/60 lg:pl-5 pt-3 lg:pt-0">
                    <div className="space-y-2">
                      {isAssigned ? (
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Assigned to Faculty</span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Mentor: <strong>{ch.assignedFacultyName || 'Dr. Alok Verma'}</strong>
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEvaluatingChallenge(ch)}
                          className="w-full py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>Assign Faculty Mentor</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setCurrentView('university-teams')}
                        className="w-full py-2 bg-[#fbf8ee] hover:bg-[#f7f2e4] text-slate-800 border border-[#e2d6bc] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-600" />
                        <span>Form Student Cohort</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentView('university-proposals')}
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Formulate Proposal</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateToChallenge(ch.id)}
                      className="w-full py-1.5 text-[#0d5c3a] hover:text-[#0b4d30] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Full Evidence Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Evaluation Modal */}
      {evaluatingChallenge && (
        <ChallengeEvaluationModal
          challenge={evaluatingChallenge}
          isOpen={!!evaluatingChallenge}
          onClose={() => setEvaluatingChallenge(null)}
          onAccept={handleEvaluationAccept}
        />
      )}
    </div>
  );
};
