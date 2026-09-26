import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { challengeService, isValidUUID } from '../../services/challengeService';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import { getCitizenStatusLabel, getCitizenTrustStatus } from './CitizenDashboard';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  Camera,
  Layers,
  ChevronRight,
  Sparkles,
  RotateCcw,
  MoreVertical,
  CheckCircle,
  Activity,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export const CitizenMyChallengesPage: React.FC = () => {
  const { challenges, currentUser, navigateToChallenge, setCurrentView, showToast, deleteChallenge } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [liveChallenges, setLiveChallenges] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchLiveChallenges = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      console.log("AUTH USER:", user);
      console.log("AUTH USER ID:", user?.id);

      // Determine the real Supabase Auth user UUID
      let targetAuthUuid: string | null = null;
      if (user?.id && isValidUUID(user.id)) {
        targetAuthUuid = user.id;
      } else if (currentUser?.id && isValidUUID(currentUser.id)) {
        targetAuthUuid = currentUser.id;
      } else if (currentUser?.email && !['guest', 'user-cit-01'].includes(currentUser.id)) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', currentUser.email)
          .maybeSingle();
        if (profile?.id && isValidUUID(profile.id)) {
          targetAuthUuid = profile.id;
        }
      }

      console.log("Active Supabase Auth UUID for submissions query:", targetAuthUuid);
      console.log("Citizen Application ID:", currentUser?.id);

      if (!targetAuthUuid) {
        // No valid Supabase Auth UUID available.
        // Do NOT send non-UUID strings (like 'user-cit-01') to PostgreSQL UUID column.
        if (currentUser?.id && !['guest'].includes(currentUser.id) && !isValidUUID(currentUser.id)) {
          // Demo Mode
          const fallback = challenges.filter((c: any) => c.submittedBy?.userId === currentUser?.id);
          setLiveChallenges(fallback);
        } else {
          setLiveChallenges([]);
        }
        setFetchError(null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('challenges')
        .select('*, profiles:submitted_by(id, name, email, phone, role)')
        .eq('submitted_by', targetAuthUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Failed to fetch citizen submissions:", error);
        setFetchError(error.message);
      } else {
        console.log("Citizen submissions:", data);
        const hydrated = await Promise.all((data || []).map((row: any) => challengeService.hydrate(row)));
        setLiveChallenges(hydrated);
      }
    } catch (err: any) {
      console.error("Failed to fetch citizen submissions:", err);
      setFetchError(err?.message || 'Error fetching citizen submissions.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, challenges]);

  useEffect(() => {
    void fetchLiveChallenges();
  }, [fetchLiveChallenges]);

  // Only show challenges submitted by the current user
  const myOwnChallenges = liveChallenges !== null
    ? liveChallenges
    : (currentUser?.id && !['guest'].includes(currentUser.id) && !isValidUUID(currentUser.id) ? challenges.filter((ch) => ch.submittedBy?.userId === currentUser.id) : []);

  // Filter list
  const filteredChallenges = myOwnChallenges.filter((ch) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ch.title.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.id.toLowerCase().includes(q) ||
        (ch.trackingId && ch.trackingId.toLowerCase().includes(q)) ||
        ch.district.toLowerCase().includes(q) ||
        (ch.village && ch.village.toLowerCase().includes(q));
      if (!match) return false;
    }

    // District filter
    if (selectedDistrict !== 'All' && ch.district !== selectedDistrict) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Submitted' && ch.status !== 'Submitted') return false;
      if (selectedStatus === 'Under Review' && ch.status !== 'Under Review') return false;
      if (selectedStatus === '✓ VERIFIED' && ch.status !== 'Validated') return false;
      if (selectedStatus === 'Open for Solutions' && ch.status !== 'University Matching') return false;
      if (
        selectedStatus === 'Solution in Progress' &&
        ch.status !== 'Assigned' &&
        ch.status !== 'In Development' &&
        ch.status !== 'Pilot' &&
        ch.status !== 'Project Proposed'
      )
        return false;
      if (
        selectedStatus === 'Completed' &&
        ch.status !== 'Implemented' &&
        ch.status !== 'Impact Measured'
      )
        return false;
      if (selectedStatus === 'Open for Another Attempt' && !ch.isReopened) return false;
    }

    return true;
  });

  const handleDeleteChallenge = async (id: string) => {
    setIsDeleting(true);
    const success = await deleteChallenge(id);
    setIsDeleting(false);
    setConfirmDeleteId(null);
    if (success) {
      setLiveChallenges((prev) => (prev ? prev.filter((c) => c.id !== id && c.trackingId !== id) : []));
      showToast('success', 'Complaint Deleted', 'Your complaint and all attached media have been permanently removed.');
    } else {
      showToast('error', 'Delete Failed', 'Could not delete this complaint. Please try again.');
    }
  };

  return (
    <div className="space-y-6 font-sans-body">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => setCurrentView('citizen-dashboard')}
              className="hover:text-amber-700 cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">My Challenges</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Reported Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Follow the full progress, university solutions, and public outcomes for all your reports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('submit-challenge')}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>+ Report a Problem</span>
        </button>
      </div>

      {/* Filters (Section 18) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, or village..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="✓ VERIFIED">✓ VERIFIED</option>
              <option value="Open for Solutions">Open for Solutions</option>
              <option value="Solution in Progress">Solution in Progress</option>
              <option value="Completed">Completed</option>
              <option value="Open for Another Attempt">Open for Another Attempt</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="All">All 24 Districts</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Count & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{filteredChallenges.length}</strong> of {myOwnChallenges.length} of your reports
          </span>
          {(searchQuery || selectedStatus !== 'All' || selectedDistrict !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setSelectedDistrict('All');
              }}
              className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Error display */}
      {fetchError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Failed to load submissions: {fetchError}</span>
          </div>
          <button
            type="button"
            onClick={() => void fetchLiveChallenges()}
            className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading state or Challenges List */}
      {isLoading && liveChallenges === null ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading your registered complaints...</p>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          {myOwnChallenges.length === 0 ? (
            <>
              <h3 className="text-sm font-bold text-slate-900">You haven't submitted any reports yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the button above to report a community problem. Your submissions will appear here.
              </p>
              <button
                type="button"
                onClick={() => setCurrentView('submit-challenge')}
                className="mx-auto mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>+ Report a Problem</span>
              </button>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-slate-900">No Challenges Match Your Filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search query or selecting a different status filter.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChallenges.map((ch, index) => {
            const statusInfo = getCitizenStatusLabel(ch.status, ch.isReopened);
            const trustInfo = getCitizenTrustStatus(ch);
            const photoEvidence = (ch.evidence || []).filter((e) => e.type === 'image' && e.url && !e.url.startsWith('blob:'));
            const photoCount = photoEvidence.length;
            const imageUrl = photoCount > 0 ? photoEvidence[0].url : null;
            const formattedDate = ch.submittedAt
              ? new Date(ch.submittedAt).toLocaleString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : 'Recent';

            // Derived Progress logic
            let progress = 10;
            let progressColor = 'bg-slate-300';
            let statusBoxBg = 'bg-slate-50';
            let statusBoxColor = 'text-slate-700';
            let statusBoxTitle = ch.status;
            let statusBoxDesc = 'Report is being processed';
            let statusIcon = <Clock className="w-3.5 h-3.5 mt-0.5 text-slate-500 shrink-0" />;

            switch (ch.status) {
              case 'Submitted':
              case 'Under Review':
                progress = 20;
                progressColor = 'bg-purple-500';
                statusBoxBg = 'bg-purple-50';
                statusBoxColor = 'text-purple-700';
                statusBoxDesc = 'Being evaluated by partners';
                statusIcon = <Clock className="w-3.5 h-3.5 mt-0.5 text-purple-600 shrink-0" />;
                break;
              case 'Validated':
                progress = 30;
                progressColor = 'bg-emerald-500';
                statusBoxBg = 'bg-emerald-50';
                statusBoxColor = 'text-emerald-700';
                statusBoxTitle = '✓ VERIFIED';
                statusBoxDesc = 'Report verified for action';
                statusIcon = <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0" />;
                break;
              case 'University Matching':
              case 'Assigned':
                progress = 40;
                progressColor = 'bg-violet-500';
                statusBoxBg = 'bg-violet-50';
                statusBoxColor = 'text-violet-700';
                statusBoxDesc = 'University being assigned';
                statusIcon = <Activity className="w-3.5 h-3.5 mt-0.5 text-violet-600 shrink-0" />;
                break;
              case 'Project Proposed':
              case 'In Development':
              case 'Pilot':
                progress = 60;
                progressColor = 'bg-blue-500';
                statusBoxBg = 'bg-blue-50';
                statusBoxColor = 'text-blue-700';
                statusBoxDesc = 'Solution development is underway';
                statusIcon = <Activity className="w-3.5 h-3.5 mt-0.5 text-blue-600 shrink-0" />;
                break;
              case 'Implemented':
              case 'Impact Measured':
                progress = 100;
                progressColor = 'bg-emerald-500';
                statusBoxBg = 'bg-emerald-50';
                statusBoxColor = 'text-emerald-700';
                statusBoxDesc = 'Solution deployed successfully';
                statusIcon = <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0" />;
                break;
            }

            const isHighlighted = index === 0;

            return (
              <div
                key={ch.id}
                className={`bg-[#ffffff] rounded-[16px] p-[14px] sm:p-[18px] transition-all duration-200 flex flex-col md:flex-row items-stretch gap-[16px] sm:gap-[20px] group ${
                  isHighlighted 
                    ? 'border border-[#f2b233] shadow-[0_3px_12px_rgba(245,158,11,0.12)] hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(245,158,11,0.18)]' 
                    : 'border border-[#e5eaf0] shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(15,23,42,0.08)]'
                }`}
              >
                {/* 1. LEFT IMAGE (20-22%) */}
                <div className="w-full md:w-[170px] lg:w-[180px] shrink-0 relative rounded-[12px] sm:rounded-[16px] overflow-hidden bg-slate-100 flex flex-col justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={ch.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200 ease-in-out"
                      onError={(e) => {
                        console.warn('[CitizenMyChallenges] Image failed to load:', imageUrl);
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.media-placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'media-placeholder absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400';
                          placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span style="font-size:10px;font-weight:600">No photo</span>';
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400 bg-slate-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <span className="text-[10px] font-semibold">No photo</span>
                    </div>
                  )}
                  <div className="pt-[75%] md:pt-[100%]"></div> {/* Aspect ratio hack for mobile */}
                  {photoCount > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/65 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-[8px] flex items-center gap-1.5 z-10">
                      <Camera className="w-3 h-3" /> {photoCount} Photo{photoCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* 2. MAIN CONTENT (53-58%) */}
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div>
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-[6px] border border-slate-200">
                        {ch.trackingId || ch.id}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {trustInfo.label !== 'Community Report' && (
                         <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${trustInfo.bg} ${trustInfo.color}`}>
                           {trustInfo.label}
                         </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h2
                      onClick={() => navigateToChallenge(ch.id)}
                      className="text-[18px] sm:text-[20px] font-bold text-slate-900 leading-[1.3] group-hover:text-amber-800 transition-colors cursor-pointer mt-1"
                    >
                      {ch.title}
                    </h2>
                    <p className="text-[13px] sm:text-[14px] text-slate-600 line-clamp-2 mt-2 leading-[1.5]">
                      {ch.description}
                    </p>
                  </div>

                  {/* Location & Category */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4 pt-1">
                    <span className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {ch.village ? `${ch.village}, ` : ''}{ch.block ? `${ch.block}, ` : ''}{ch.district} District
                    </span>
                    <span className="bg-blue-50/80 text-blue-700 text-[11px] sm:text-[12px] font-semibold px-2.5 py-1 rounded-[6px] border border-blue-100/50 whitespace-nowrap">
                      {ch.category}
                    </span>
                  </div>
                </div>

                {/* 3. RIGHT ACTION / PROGRESS (22-27%) */}
                <div className="w-full md:w-[220px] lg:w-[240px] shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-5">
                  <div className="space-y-4">
                    {/* Date and Menu */}
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{formattedDate}</span>
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[12px] font-medium text-slate-500">Progress</span>
                        <span className="text-[14px] font-bold text-slate-900">{progress}%</span>
                      </div>
                      <div className="h-[8px] bg-[#e8edf3] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status Info Box */}
                    <div className={`rounded-[10px] p-[10px] border border-transparent ${statusBoxBg}`}>
                      <div className="flex items-start gap-2">
                        {statusIcon}
                        <div className="flex-1 min-w-0">
                          <div className={`text-[12px] font-bold ${statusBoxColor} truncate`}>{statusBoxTitle}</div>
                          <div className="text-[11px] text-slate-600 leading-[1.3] mt-0.5 line-clamp-2">{statusBoxDesc}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 md:pt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => navigateToChallenge(ch.id)}
                      className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200/50 text-amber-800 font-semibold text-[13px] sm:text-[14px] py-[10px] sm:py-[12px] rounded-[10px] transition-colors cursor-pointer flex items-center justify-center gap-2 group/btn"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(ch.id)}
                      className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-700 font-semibold text-[12px] py-[8px] rounded-[10px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Complaint</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => { if (!isDeleting) setConfirmDeleteId(null); }}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-rose-600" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Delete this complaint?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This will <strong>permanently delete</strong> this complaint along with all attached photos, videos, and timeline data. This action cannot be undone.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteChallenge(confirmDeleteId)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

