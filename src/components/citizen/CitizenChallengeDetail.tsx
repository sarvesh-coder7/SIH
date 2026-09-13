import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getCitizenStatusLabel, getCitizenTrustStatus } from './CitizenDashboard';
import { challengeService } from '../../services/challengeService';
import { getCommunityImpactLevel } from './SubmitChallengeForm';
import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  ThumbsUp,
  Share2,
  Camera,
  Layers,
  History,
  Info,
  Check,
  X,
  ExternalLink,
  Award,
  Users,
  TrendingUp,
  RotateCcw,
  Maximize2,
  Video,
  Play,
  MessageSquare,
  Send,
  RefreshCw,
  Paperclip,
  Download,
} from 'lucide-react';
import { MultimediaEvidence, Challenge } from '../../types';

export const CitizenChallengeDetail: React.FC = () => {
  const {
    currentUser,
    currentRole,
    selectedChallengeId,
    challenges,
    setCurrentView,
    goBack,
    showToast,
    refreshData,
  } = useApp();

  const [liveChallenge, setLiveChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [endorsed, setEndorsed] = useState(false);
  const [following, setFollowing] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState<MultimediaEvidence | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; sender: string; role: string; text: string; date: string }>>([
    {
      id: 'c-1',
      sender: 'Nodal Verification Officer',
      role: 'Government of Jharkhand',
      text: 'Problem report registered and geotag metadata verified against district registry.',
      date: 'Official Notice',
    },
  ]);

  useEffect(() => {
    if (!selectedChallengeId) return;
    let mounted = true;
    setIsLoading(true);
    challengeService
      .getChallengeById(selectedChallengeId)
      .then((data) => {
        if (mounted) {
          if (data) setLiveChallenge(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Live challenge query failed:', err);
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedChallengeId]);

  const handleRefresh = async () => {
    if (!selectedChallengeId) return;
    setIsRefreshing(true);
    try {
      const data = await challengeService.getChallengeById(selectedChallengeId);
      if (data) {
        setLiveChallenge(data);
        showToast('success', 'Status Refreshed', 'Loaded latest verified milestones from the portal.');
      }
      await refreshData();
    } catch (err) {
      showToast('error', 'Refresh Failed', 'Could not refresh latest updates.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const challenge =
    liveChallenge ||
    challenges.find((c) => c.id === selectedChallengeId || c.trackingId === selectedChallengeId) ||
    challenges[0];

  if (isLoading && !challenge) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Retrieving Live Challenge Details...</h2>
        <p className="text-xs text-slate-500">Querying verified tracking status and evidence from the state repository.</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Challenge Not Found</h2>
        <p className="text-xs text-slate-500">The requested problem reference could not be located in the state database.</p>
        <button
          onClick={() => goBack(currentRole === 'citizen' ? 'citizen-dashboard' : 'explore-challenges')}
          className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer hover:bg-amber-400 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  const statusInfo = getCitizenStatusLabel(challenge.status, challenge.isReopened);
  const trustInfo = getCitizenTrustStatus(challenge);
  const isResolved = challenge.status === 'Implemented' || challenge.status === 'Impact Measured';
  const isReopened = challenge.isReopened || challenge.status === 'Rejected';

  const handleEndorse = () => {
    if (!endorsed) {
      challenge.endorsementsCount += 1;
      setEndorsed(true);
      showToast('success', 'Problem Endorsed', 'Your community endorsement helps prioritize this issue.');
    }
  };

  const handleFollow = () => {
    setFollowing(!following);
    showToast(
      'info',
      following ? 'Unfollowed Challenge' : 'Following Challenge',
      following ? 'You will no longer receive live SMS/portal updates.' : 'You will receive notifications on university assignments and solution progress.'
    );
  };

  // Helper to format ISO date and time into clear user-friendly string (e.g., '07 Sep 2026, 06:14 PM')
  const formatFullDateTime = (dateVal?: string | Date) => {
    if (!dateVal) return null;
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

  // Find relevant timeline entries for accurate real-time timestamps
  const submittedFormatted = formatFullDateTime(challenge.submittedAt) || 'Registered';
  
  const verificationEntry = challenge.timeline?.find(
    (t) =>
      t.stage.toLowerCase().includes('verification') ||
      t.stage.toLowerCase().includes('validated') ||
      t.stage.toLowerCase().includes('approved as open') ||
      t.stage.toLowerCase().includes('reviewed')
  );
  const verificationDate = verificationEntry
    ? formatFullDateTime(verificationEntry.date) || verificationEntry.date
    : challenge.trustStatus === 'Verified' || (challenge.status !== 'Submitted' && challenge.status !== 'Under Review')
    ? 'Verified by State Authority'
    : 'Awaiting Government Review';

  const publishedEntry = challenge.timeline?.find(
    (t) =>
      t.stage.toLowerCase().includes('open problem') ||
      t.stage.toLowerCase().includes('published') ||
      t.stage.toLowerCase().includes('matching')
  );
  const publishedDate = publishedEntry
    ? formatFullDateTime(publishedEntry.date) || publishedEntry.date
    : challenge.status !== 'Submitted' && challenge.status !== 'Under Review'
    ? 'Published to Open Innovation Desk'
    : 'Pending Government Approval';

  const interestEntry = challenge.timeline?.find(
    (t) =>
      t.stage.toLowerCase().includes('interest') ||
      t.stage.toLowerCase().includes('industry solution') ||
      t.stage.toLowerCase().includes('assignment')
  );
  const interestDate = interestEntry
    ? formatFullDateTime(interestEntry.date) || interestEntry.date
    : (challenge.expressionsOfInterest && challenge.expressionsOfInterest.length > 0) ||
      (challenge.industrySubmissions && challenge.industrySubmissions.length > 0) ||
      challenge.assignedUniversityName
    ? 'Expressions / Solutions Received'
    : 'Open for Institutions & Industry';

  const assignmentEntry = challenge.timeline?.find((t) => t.stage.toLowerCase().includes('assign'));
  const assignmentDate = challenge.officialAssignment?.assignedDate
    ? formatFullDateTime(challenge.officialAssignment.assignedDate) || challenge.officialAssignment.assignedDate
    : assignmentEntry
    ? formatFullDateTime(assignmentEntry.date) || assignmentEntry.date
    : challenge.status === 'Assigned' || challenge.status === 'In Development' || challenge.status === 'Pilot' || challenge.status === 'Implemented'
    ? 'Solution Partner Designated'
    : 'Allocation Pending';

  // Exact 8-Stage Timeline per Civic Platform Workflow
  const timelineStages = [
    {
      id: 'submitted',
      label: 'Complaint Submitted',
      date: submittedFormatted,
      done: true,
      description: 'Complaint registered and persisted in the state database.',
    },
    {
      id: 'verification',
      label: 'Under Verification',
      date: verificationDate,
      done: challenge.trustStatus === 'Verified' || (challenge.status !== 'Submitted' && challenge.status !== 'Under Review'),
      isCurrent: challenge.status === 'Submitted' && challenge.trustStatus !== 'Verified',
      description: challenge.trustStatus === 'Verified' || challenge.status !== 'Submitted'
        ? 'Geotag metadata and ground validity verified by authorities.'
        : 'Nodal verification desk inspecting site authenticity.',
    },
    {
      id: 'govt_review',
      label: 'Government Review',
      date: publishedDate,
      done: challenge.status !== 'Submitted' && challenge.status !== 'Under Review',
      isCurrent: challenge.status === 'Under Review' || (challenge.status === 'Submitted' && challenge.trustStatus === 'Verified'),
      description: challenge.status !== 'Submitted' && challenge.status !== 'Under Review'
        ? 'Approved by Government authority as valid public problem statement.'
        : 'Government department reviewing administrative prioritization.',
    },
    {
      id: 'university_review',
      label: 'University Review',
      date: interestDate,
      done:
        Boolean(challenge.assignedUniversityId) ||
        Boolean(challenge.assignedUniversityName) ||
        ['Assigned', 'In Development', 'Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status),
      isCurrent: challenge.status === 'University Matching' || (challenge.status === 'Validated' && !challenge.assignedUniversityId),
      description: challenge.assignedUniversityName
        ? `Academic review completed by ${challenge.assignedUniversityName}.`
        : 'Higher Education Institutions examining technical feasibility.',
    },
    {
      id: 'industry_support',
      label: 'Industry Support',
      date: interestDate,
      done:
        (challenge.industrySubmissions && challenge.industrySubmissions.length > 0) ||
        (challenge.expressionsOfInterest && challenge.expressionsOfInterest.length > 0) ||
        ['In Development', 'Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status),
      isCurrent: challenge.status === 'Validated' && !['In Development', 'Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status),
      description: (challenge.industrySubmissions && challenge.industrySubmissions.length > 0)
        ? `${challenge.industrySubmissions.length} Industry partner proposal(s) received.`
        : 'Industry CSR and technology partners reviewing deployment support.',
    },
    {
      id: 'solution_dev',
      label: 'Solution Development',
      date: assignmentDate,
      done: ['In Development', 'Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status),
      isCurrent: challenge.status === 'In Development',
      description: ['In Development', 'Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status)
        ? 'R&D prototype and engineering solution designed.'
        : 'Solution engineering pending formal partner assignment.',
    },
    {
      id: 'work_in_progress',
      label: 'Work In Progress',
      date: ['Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status) ? 'On-Site Execution' : 'Pending',
      done: ['Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status),
      isCurrent: challenge.status === 'Pilot',
      description: ['Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status)
        ? 'Field installation, civil work, or trial implementation underway on site.'
        : 'Awaiting completion of development phase.',
    },
    {
      id: 'resolved',
      label: 'Resolved',
      date: isResolved
        ? challenge.publicOutcome?.completedDate
          ? formatFullDateTime(challenge.publicOutcome.completedDate) || challenge.publicOutcome.completedDate
          : 'Completed'
        : 'Pending',
      done: isResolved || challenge.status === 'Implemented' || challenge.status === 'Impact Measured',
      isCurrent: false,
      description: isResolved || challenge.status === 'Implemented' || challenge.status === 'Impact Measured'
        ? 'Problem successfully resolved and verified on site.'
        : 'Final completion and public sign-off pending.',
    },
  ];

  // Mock previous failed attempts for institutional memory (Section 22)
  const previousAttempts = challenge.previousAttempts || (isReopened ? [
    {
      attemptNumber: 1,
      universityName: 'Ranchi Regional Institute of Technology',
      outcome: 'Unsuccessful' as const,
      completedDate: '15 June 2026',
      publicSummary: 'Initial solar filtration system faced seasonal water silt clogging during heavy monsoon testing.',
      publicReportUrl: '#',
    },
  ] : []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans-body">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goBack(currentRole === 'citizen' ? 'citizen-my-challenges' : 'explore-challenges')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFollow}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              following
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{following ? 'Following Updates' : 'Follow Challenge'}</span>
          </button>

          <button
            type="button"
            onClick={handleEndorse}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              endorsed
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{endorsed ? 'Endorsed' : 'Endorse'} ({challenge.endorsementsCount || 0})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HEADER & BASIC DETAILS (SECTION 19) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Complaint Tracking
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Official public record retrieved directly from Supabase
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
            title="Refresh live status from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              Tracking ID: {challenge.trackingId || challenge.id}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${trustInfo.bg} ${trustInfo.color}`}
            >
              {trustInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Current Stage: <strong>{challenge.currentStage || 'Complaint Submitted'}</strong>
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300/60">
              {challenge.category}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {challenge.title}
          </h1>
          <p className="text-sm text-slate-700 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* People Affected Visual Impact Card */}
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" />
              <span>People Affected</span>
            </span>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getCommunityImpactLevel(challenge.affectedPopulation || 0).badgeClass}`}>
              Community Impact: {getCommunityImpactLevel(challenge.affectedPopulation || 0).level}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950">
              {(challenge.affectedPopulation || 0).toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              people in this community directly affected
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            This verification index helps authorities, university researchers, and industry CSR initiatives prioritize interventions based on societal scale.
          </p>
        </div>

        {/* Location & Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
              <span className="text-xs font-bold text-slate-900">
                {challenge.village ? `${challenge.village}, ` : ''}{challenge.district}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Reported Date & Time</span>
              <span className="text-xs font-bold text-slate-900">
                {formatFullDateTime(challenge.submittedAt) || 'Just now'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <Users className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Urgency & Frequency</span>
              <span className="text-xs font-bold text-slate-900">
                {challenge.urgency || 'High'} &bull; {challenge.frequency || 'Daily'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REOPENED CHALLENGE BANNER (SECTION 23) */}
      {/* ========================================================================= */}
      {isReopened && (
        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
            <RotateCcw className="w-5 h-5 text-amber-700" />
            <span>Open for Another Attempt</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            The previous solution attempt was unsuccessful. The challenge remains open so another capable university team or innovation partner can try.
          </p>
          <div className="text-[11px] text-amber-800 font-medium">
            &bull; The platform automatically matches new institutions. You do not need to take any action.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUCCESSFUL OUTCOME CARD (SECTION 24) */}
      {/* ========================================================================= */}
      {isResolved && (
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-900">
            <Award className="w-6 h-6 text-emerald-600" />
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase">
                Success
              </span>
              <h2 className="text-lg font-bold text-emerald-950 mt-0.5">
                Solution Successfully Implemented
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {challenge.publicOutcome?.summary ||
              'A low-cost, gravity-fed filtration system was engineered by Birla Institute of Technology (BIT) Mesra with Tata Steel support, providing verified clean potable water to local residents.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white border border-emerald-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Beneficiaries</span>
              <span className="text-lg font-black text-emerald-800">
                {(challenge.publicOutcome?.beneficiariesCount || 2400).toLocaleString()} residents
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-emerald-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Districts Affected</span>
              <span className="text-lg font-black text-slate-900">
                {challenge.publicOutcome?.districtsCount || 1} District
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-emerald-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Deployment Status</span>
              <span className="text-xs font-bold text-emerald-800">
                {challenge.publicOutcome?.deploymentStatus || 'Pilot Completed & Handed Over'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VISUAL CHALLENGE TIMELINE (SECTION 20) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Challenge Progress Timeline
          </h2>
          <p className="text-xs text-slate-500">
            Real-time status tracking as your problem moves from verification to solution deployment.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200 ml-3">
          {timelineStages.map((st, idx) => (
            <div key={st.id} className="relative group">
              {/* Timeline Bullet Icon */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                  st.done
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : st.isCurrent
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {st.done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              {/* Content */}
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-xs sm:text-sm font-bold ${
                      st.done
                        ? 'text-slate-900'
                        : st.isCurrent
                        ? 'text-amber-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {st.label}
                  </h3>
                  <span className="text-[10px] text-slate-600 font-medium">
                    &bull; {st.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{st.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SOLUTION PARTNER (UNIVERSITY) PUBLIC INFORMATION (SECTION 21) */}
      {/* ========================================================================= */}
      {challenge.assignedUniversityName && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Solution Partner
            </h2>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider">
                  Assigned Institution
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {challenge.assignedUniversityName}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-purple-900 border border-purple-300 self-start sm:self-auto">
                Higher Education Institution
              </span>
            </div>

            {/* Public Progress */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Solution Development Progress</span>
                <span className="font-black text-purple-900">65% Completed</span>
              </div>
              <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full w-[65%]" />
              </div>
            </div>

            {/* Public Summary */}
            <p className="text-xs text-slate-700 pt-1">
              <strong>Public Project Scope:</strong> Multidisciplinary research team is developing and field-testing a localized low-cost filtration prototype designed for tribal settlements.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PREVIOUS FAILED ATTEMPTS (SECTION 22 - INSTITUTIONAL MEMORY) */}
      {/* ========================================================================= */}
      {previousAttempts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900">
            <History className="w-5 h-5 text-slate-600" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Previous Attempts History
              </h2>
              <p className="text-xs text-slate-500">
                These previous attempts help future teams understand what has already been tried.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {previousAttempts.map((att) => (
              <div
                key={att.attemptNumber}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Attempt {att.attemptNumber} &bull; {att.universityName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                    {att.outcome}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {att.publicSummary}
                </p>
                <div className="text-[10px] text-slate-600 font-medium">
                  Tested: {att.completedDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. EVIDENCE GALLERY */}
      {/* ========================================================================= */}
      {(challenge.evidence || []).length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Submitted Photos & Evidence
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {(challenge.evidence || []).length} items attached
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {challenge.evidence.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setActivePhotoModal(ev)}
                className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 cursor-pointer bg-slate-900"
              >
                {ev.type === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                    <video
                      src={ev.url}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1">
                      <Video className="w-3 h-3 text-amber-400" />
                      <span>Video</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={ev.url}
                      alt={ev.caption || 'Evidence Photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </>
                )}
                {ev.isGeotagged && (
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-bold text-emerald-300 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>Geotagged</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Attached Documents if any */}
          {challenge.evidence && challenge.evidence.some((e) => e.type === 'document') && (
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Official Supporting Documents
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {challenge.evidence
                  .filter((e) => e.type === 'document')
                  .map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-semibold truncate">{doc.caption || doc.fileName || 'Attached Document'}</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. PROBLEM COLLABORATION & MULTI-STAKEHOLDER COMMUNICATION */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Problem Updates & Discussion
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Citizen &bull; Government &bull; University &bull; Industry
          </span>
        </div>

        {/* Stakeholder Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Reporting Citizen</span>
            <span className="text-xs font-bold text-slate-900 truncate block">
              {challenge.submittedBy?.userName || 'Citizen Reporter'}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">Verified Submitter</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Nodal Department</span>
            <span className="text-xs font-bold text-slate-900 truncate block">
              {challenge.category === 'Water Resources' ? 'Drinking Water & Sanitation' : 'Rural Development Dept'}
            </span>
            <span className="text-[10px] text-amber-700 font-medium">Supervising Authority</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Designated HEI</span>
            <span className="text-xs font-bold text-slate-900 truncate block">
              {challenge.assignedUniversityName || 'BIT Mesra / IIT ISM'}
            </span>
            <span className="text-[10px] text-purple-700 font-medium">R&D Solution Partner</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Industry Partner</span>
            <span className="text-xs font-bold text-slate-900 truncate block">
              Tata Steel Innovation CSR
            </span>
            <span className="text-[10px] text-blue-700 font-medium">Deployment & Pilot CSR</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="space-y-3 pt-2">
          {comments.map((msg) => (
            <div key={msg.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{msg.sender}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold">
                    {msg.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{msg.date}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Send Response Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newComment.trim()) return;
            const newMsg = {
              id: `c-${Date.now()}`,
              sender: currentUser?.name || 'Citizen Reporter',
              role: currentUser?.role === 'citizen' ? 'Citizen' : 'Partner',
              text: newComment.trim(),
              date: 'Just now',
            };
            setComments((prev) => [...prev, newMsg]);
            setNewComment('');
            showToast('success', 'Update Posted', 'Your response has been dispatched to the nodal task force.');
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-100"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a message or response for authorities & university team..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* Photo Preview Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">
                {activePhotoModal.caption || 'Evidence Preview'}
              </span>
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {activePhotoModal.type === 'video' ? (
              <video
                src={activePhotoModal.url}
                controls
                autoPlay
                className="w-full max-h-[70vh] rounded-xl bg-black"
              />
            ) : (
              <img
                src={activePhotoModal.url}
                alt="Preview"
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />
            )}
            {activePhotoModal.geotagLocation && (
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activePhotoModal.geotagLocation}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
