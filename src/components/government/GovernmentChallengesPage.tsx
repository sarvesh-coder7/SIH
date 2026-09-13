import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge, ChallengeCategory, ChallengeStatus } from '../../types';
import {
  Search,
  Filter,
  Compass,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  Handshake,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

export const GovernmentChallengesPage: React.FC = () => {
  const {
    challenges,
    projects,
    collaborations,
    currentGovernmentMember,
    selectedChallengeId,
    setSelectedChallengeId,
    setCurrentView,
    setSelectedProjectId,
    approveProblemStatement,
  } = useApp();

  // Initial district filter: if government member is restricted to a district, default to it
  const defaultDistrict = currentGovernmentMember.district || 'All';
  const [districtFilter, setDistrictFilter] = useState(defaultDistrict);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [trustFilter, setTrustFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectModalChallenge, setInspectModalChallenge] = useState<Challenge | null>(null);

  // Extract unique filter lists
  const allDistricts = Array.from(new Set(challenges.map((c) => c.district))).sort();
  const allCategories = Array.from(new Set(challenges.map((c) => c.category))).sort();
  const allStatuses = Array.from(new Set(challenges.map((c) => c.status))).sort();

  // Filtered challenges
  const filteredChallenges = challenges.filter((c) => {
    if (districtFilter !== 'All' && c.district !== districtFilter) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (trustFilter !== 'All') {
      const trust = c.trustStatus || 'Community Report';
      if (trust !== trustFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchTrackingId = c.trackingId ? c.trackingId.toLowerCase().includes(q) : false;
      const matchBlock = c.block.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchTrackingId && !matchBlock && !matchDesc) return false;
    }
    return true;
  });

  const getAssociatedProject = (challengeId: string) => {
    return projects.find((p) => p.challengeId === challengeId);
  };

  const getAssociatedCollaborations = (challengeId: string) => {
    return collaborations.filter((c) => c.challenge_id === challengeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Statewide Challenge Repository</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Citizen Challenge Monitoring
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real records submitted by citizens, PRIs, and NGOs across Jharkhand. Real-time verification, assignment, and capstone progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('government-verification')}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verification Queue</span>
          </button>
          <button
            onClick={() => setCurrentView('government-assignments')}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4" />
            <span>Assign Universities</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Challenge ID, keyword, block, or description..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* District Filter */}
          <div className="w-full md:w-48">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Districts ({allDistricts.length})</option>
              {allDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-56">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Trust Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={trustFilter}
              onChange={(e) => setTrustFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Trust States</option>
              <option value="Community Report">Community Report</option>
              <option value="Evidence Submitted">Evidence Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Verified">Verified</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredChallenges.length}</strong> of{' '}
            <strong className="text-slate-800">{challenges.length}</strong> recorded challenges
          </span>
          {(districtFilter !== 'All' ||
            categoryFilter !== 'All' ||
            statusFilter !== 'All' ||
            trustFilter !== 'All' ||
            searchQuery) && (
            <button
              onClick={() => {
                setDistrictFilter(defaultDistrict);
                setCategoryFilter('All');
                setStatusFilter('All');
                setTrustFilter('All');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Challenges Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Challenge ID & Title</th>
                <th className="py-3 px-4">District / Block</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Trust Status</th>
                <th className="py-3 px-4">Challenge Status</th>
                <th className="py-3 px-4">Assigned University</th>
                <th className="py-3 px-4">Project Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredChallenges.map((ch) => {
                const project = getAssociatedProject(ch.id);
                const isAssigned = ch.officialAssignment || ch.assignedUniversityName;

                return (
                  <tr key={ch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-slate-900">
                        {ch.trackingId || ch.id}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 max-w-xs truncate mt-0.5">
                        {ch.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Pop: {ch.affectedPopulation.toLocaleString()} • Sub: {ch.submittedAt}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{ch.district}</div>
                      <div className="text-[11px] text-slate-500">{ch.block}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {ch.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ch.trustStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ch.trustStatus === 'Evidence Submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : ch.trustStatus === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ch.trustStatus === 'Verified' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{ch.trustStatus || 'Community Report'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {ch.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isAssigned ? (
                        <div className="text-xs font-semibold text-indigo-700 leading-tight">
                          {ch.assignedUniversityName || ch.officialAssignment?.assignedToUniversity}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">
                          {ch.expressionsOfInterest && ch.expressionsOfInterest.length > 0
                            ? `${ch.expressionsOfInterest.length} Universities interested`
                            : 'Unassigned'}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {project ? (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                          {project.currentStage}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {ch.status !== 'Validated' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              approveProblemStatement(ch.id);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Accept and approve this problem statement"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Accepted</span>
                          </span>
                        )}
                        <button
                          onClick={() => setInspectModalChallenge(ch)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredChallenges.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No challenges match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Challenge Modal */}
      {inspectModalChallenge && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {inspectModalChallenge.trackingId || inspectModalChallenge.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inspectModalChallenge.trustStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inspectModalChallenge.trustStatus || inspectModalChallenge.status}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {inspectModalChallenge.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {inspectModalChallenge.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{inspectModalChallenge.district}, {inspectModalChallenge.block}</span>
                  <span>•</span>
                  <span>Affected Population: {inspectModalChallenge.affectedPopulation.toLocaleString()}</span>
                  <span>•</span>
                  <span>Submitted: {inspectModalChallenge.submittedAt}</span>
                </div>
              </div>

              <button
                onClick={() => setInspectModalChallenge(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 py-4">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Public Problem Description
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed">
                  {inspectModalChallenge.description}
                </div>
              </div>

              {/* Multimedia Evidence */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Submitted Ground Evidence ({inspectModalChallenge.evidence.length} Artifacts)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inspectModalChallenge.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3"
                    >
                      <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                        {ev.type === 'image' ? (
                          <img
                            src={ev.url}
                            alt={ev.caption}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : ev.type === 'video' ? (
                          <video
                            src={ev.url}
                            controls
                            className="w-full h-full object-cover bg-black"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                            <FileText className="w-6 h-6 mb-1 text-slate-600" />
                            <span className="text-[9px] uppercase font-bold text-slate-500">Document</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {ev.caption}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {ev.geotagLocation || 'Geotagged'} • {ev.timestamp}
                        </div>
                        {ev.gpsCoordinates && (
                          <div className="text-[10px] text-emerald-700 font-mono mt-1">
                            GPS: {ev.gpsCoordinates.lat.toFixed(4)}° N, {ev.gpsCoordinates.lng.toFixed(4)}° E
                          </div>
                        )}
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline"
                        >
                          <span>Open File</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Assignment & Interested Universities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  University Assignment & Expressions of Interest
                </h4>
                {inspectModalChallenge.officialAssignment ? (
                  <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-indigo-900">
                        Officially Assigned to {inspectModalChallenge.officialAssignment.assignedToUniversity}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                        Official Attempt #{inspectModalChallenge.officialAssignment.attemptNumber}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-700 mt-1">
                      Sanctioned by: {inspectModalChallenge.officialAssignment.assignedBy} on {inspectModalChallenge.officialAssignment.assignedDate}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                    {inspectModalChallenge.expressionsOfInterest && inspectModalChallenge.expressionsOfInterest.length > 0 ? (
                      <div className="space-y-2">
                        <div className="font-semibold text-slate-800">
                          {inspectModalChallenge.expressionsOfInterest.length} Universities have submitted Expressions of Interest:
                        </div>
                        <div className="divide-y divide-slate-200">
                          {inspectModalChallenge.expressionsOfInterest.map((eoi) => (
                            <div key={eoi.id} className="py-2 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900">{eoi.universityName}</span>
                                <span className="text-slate-500 text-[11px] block">
                                  Lead: {eoi.facultyLead} ({eoi.department}) • Cohort: {eoi.studentCohortSize} Students
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedChallengeId(inspectModalChallenge.id);
                                  setInspectModalChallenge(null);
                                  setCurrentView('government-assignments');
                                }}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
                              >
                                Sanction Assignment
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span>No universities have applied yet. Open for university proposals.</span>
                    )}
                  </div>
                )}
              </div>

              {/* Activity Audit Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Official Audit History Timeline
                </h4>
                <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                  {inspectModalChallenge.timeline.map((entry, idx) => (
                    <div key={idx} className="relative pb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute -left-[21px] top-1 border-2 border-white" />
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900">{entry.stage}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 text-[11px]">{entry.date}</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{entry.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setInspectModalChallenge(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>

              {(inspectModalChallenge.status !== 'Validated' || inspectModalChallenge.trustStatus !== 'Verified') ? (
                <>
                  <button
                    onClick={() => {
                      approveProblemStatement(inspectModalChallenge.id);
                      setInspectModalChallenge(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve as Open Problem Statement</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedChallengeId(inspectModalChallenge.id);
                      setInspectModalChallenge(null);
                      setCurrentView('government-verification');
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Open in Verification Desk</span>
                  </button>
                </>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Approved as Open Problem Statement</span>
                </div>
              )}

              {!inspectModalChallenge.officialAssignment && (
                <button
                  onClick={() => {
                    setSelectedChallengeId(inspectModalChallenge.id);
                    setInspectModalChallenge(null);
                    setCurrentView('government-assignments');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Assign University</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
