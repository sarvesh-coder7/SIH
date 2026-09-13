import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Challenge, ChallengeCategory, ChallengeUrgency } from '../../types';
import {
  Sparkles,
  Search,
  Filter,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  FileText,
  UploadCloud,
  Layers,
  ChevronRight,
  X,
  ExternalLink,
  Plus,
  Trash2,
  FileCheck,
  Handshake,
  DollarSign,
  Send,
  Eye,
  Camera,
} from 'lucide-react';

export const IndustryOpenProblemStatements: React.FC = () => {
  const {
    challenges,
    activeIndustry,
    currentIndustryMember,
    industrySubmissions,
    submitIndustrySolution,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'All'>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<ChallengeUrgency | 'All'>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNCLAIMED' | 'SUBMITTED'>('ALL');

  // Detail Modal State
  const [detailModalChallenge, setDetailModalChallenge] = useState<Challenge | null>(null);

  // Upload Solution Result Modal State
  const [activeUploadChallenge, setActiveUploadChallenge] = useState<Challenge | null>(null);
  const [solutionTitle, setSolutionTitle] = useState('');
  const [solutionSummary, setSolutionSummary] = useState('');
  const [technicalDetails, setTechnicalDetails] = useState('');
  const [resultsMetrics, setResultsMetrics] = useState('');
  const [collaborationMode, setCollaborationMode] = useState<'Independent' | 'Collaborate with University'>('Collaborate with University');
  const [targetUniversity, setTargetUniversity] = useState('Birla Institute of Technology (BIT) Mesra');
  const [budgetCommitment, setBudgetCommitment] = useState('₹5,00,000 CSR Grant & Lab Fabrication');
  const [timelineEstimate, setTimelineEstimate] = useState('3 Months (Pilot Prototype)');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; url: string }>>([
    { name: 'Prototype-Bench-Testing-Summary.pdf', size: '2.4 MB', url: '#' },
  ]);
  const [newFileName, setNewFileName] = useState('');

  // Government-Approved Open Problem Statements
  const openProblemStatements = useMemo(() => {
    return challenges.filter((c) => {
      // Must be approved by Government (Validated or University Matching or trustStatus Verified or openForSolutions)
      const isApproved =
        c.trustStatus === 'Verified' ||
        c.status === 'Validated' ||
        c.status === 'University Matching' ||
        c.openForSolutions === true ||
        c.status === 'Assigned' ||
        c.status === 'In Development' ||
        c.status === 'Project Proposed';

      // Exclude raw unreviewed citizen submissions
      if (!isApproved) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchId = c.id.toLowerCase().includes(q) || (c.trackingId && c.trackingId.toLowerCase().includes(q));
        const matchDistrict = c.district.toLowerCase().includes(q);
        const matchBlock = c.block.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchDistrict && !matchBlock && !matchDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }

      // Urgency filter
      if (selectedUrgency !== 'All' && c.urgency !== selectedUrgency) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'All' && c.district !== selectedDistrict) {
        return false;
      }

      // Status filter
      const hasSubmission = industrySubmissions.some((s) => s.challengeId === c.id);
      if (statusFilter === 'UNCLAIMED' && hasSubmission) return false;
      if (statusFilter === 'SUBMITTED' && !hasSubmission) return false;

      return true;
    });
  }, [challenges, searchQuery, selectedCategory, selectedUrgency, selectedDistrict, statusFilter, industrySubmissions]);

  // Derived lists for filters
  const allDistricts = Array.from(new Set(challenges.map((c) => c.district))).sort();
  const allCategories: ChallengeCategory[] = [
    'Water Resources',
    'Agriculture & Rural Economy',
    'Healthcare & Telemedicine',
    'Smart Education & Skilling',
    'Sanitation & Waste Management',
    'Renewable Energy & Power',
    'Environment & Forest Livelihood',
    'Tribal Handicrafts & Value Addition',
    'Urban Infrastructure & Mobility',
    'Public Service Delivery',
  ];

  const handleOpenUploadModal = (challenge: Challenge) => {
    setActiveUploadChallenge(challenge);
    setSolutionTitle(`Industrial Solution: ${challenge.title}`);
    setSolutionSummary('');
    setTechnicalDetails('');
    setResultsMetrics('');
    setCollaborationMode('Collaborate with University');
    setTargetUniversity('Birla Institute of Technology (BIT) Mesra');
    setBudgetCommitment('₹5,00,000 CSR Grant & Lab Fabrication');
    setTimelineEstimate('3 Months (Pilot Prototype)');
    setUploadedFiles([
      { name: 'Technical-Test-Readings.pdf', size: '2.1 MB', url: '#' },
      { name: 'Schematic-Architecture-Draft.pdf', size: '3.4 MB', url: '#' },
    ]);
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    setUploadedFiles((prev) => [
      ...prev,
      {
        name: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        url: '#',
      },
    ]);
    setNewFileName('');
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUploadChallenge) return;

    if (!solutionTitle.trim() || !solutionSummary.trim() || !technicalDetails.trim()) {
      showToast('error', 'Missing Information', 'Please provide a solution title, summary, and technical specifications.');
      return;
    }

    submitIndustrySolution({
      challengeId: activeUploadChallenge.id,
      challengeTitle: activeUploadChallenge.title,
      industryId: activeIndustry.id,
      industryName: activeIndustry.organization_name,
      submittedBy: currentIndustryMember.name,
      contactEmail: currentIndustryMember.email || 'partner@industry.gov.in',
      contactPhone: currentIndustryMember.phone || '+91 94311 00000',
      solutionTitle,
      summary: solutionSummary,
      technicalDetails,
      resultsMetrics: resultsMetrics || 'Initial prototype test cleared bench criteria. Field efficacy verified under lab simulations.',
      resultsDocuments: uploadedFiles,
      collaborationMode,
      targetUniversityName: collaborationMode === 'Collaborate with University' ? targetUniversity : undefined,
      budgetOrCsrCommitment: budgetCommitment,
      timelineEstimate,
    });

    setActiveUploadChallenge(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Government Approved Problem Statements</span>
              </span>
              <span className="text-xs text-slate-600 font-mono font-semibold">Industry Solution Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Open Problem Statements
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Review real-world challenges officially validated by Jharkhand State Authorities. Accept problem statements,
              conduct R&D or CSR deployment, and upload technical test results directly to the Government for implementation selection.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#fbf8ee] border border-[#e2d6bc] rounded-2xl p-4 text-center min-w-[120px] shadow-xs">
              <span className="text-2xl font-black text-blue-700 block">{openProblemStatements.length}</span>
              <span className="text-[11px] text-slate-600 font-medium">Open Challenges</span>
            </div>
            <div className="bg-[#fbf8ee] border border-[#e2d6bc] rounded-2xl p-4 text-center min-w-[120px] shadow-xs">
              <span className="text-2xl font-black text-emerald-700 block">{industrySubmissions.length}</span>
              <span className="text-[11px] text-slate-600 font-medium">Results Uploaded</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Verified Open</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{openProblemStatements.length}</span>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Solution
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Critical Urgency</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {openProblemStatements.filter((c) => c.urgency === 'Critical' || c.urgency === 'High').length}
          </span>
          <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" /> High State Priority
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Submissions Under Review</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            {industrySubmissions.filter((s) => s.status === 'Submitted to Government' || s.status === 'Under Review').length}
          </span>
          <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5" /> At Govt Desk
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Sanctioned & Approved</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {industrySubmissions.filter((s) => s.status === 'Government Approved' || s.status === 'Collaboration Accepted').length}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <Handshake className="w-3.5 h-3.5" /> Selected by Govt
          </span>
        </div>
      </div>

      {/* 3. Filters & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2d6bc] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by challenge ID, problem title, district, or block..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-[#fbf8ee] border border-[#e2d6bc] p-1 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Open ({openProblemStatements.length})
            </button>
            <button
              onClick={() => setStatusFilter('UNCLAIMED')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'UNCLAIMED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Awaiting Solutions
            </button>
            <button
              onClick={() => setStatusFilter('SUBMITTED')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'SUBMITTED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Submitted Results
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Category / Domain
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full p-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Urgency Level
            </label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value as any)}
              className="w-full p-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Urgency Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All 24 Districts</option>
              {allDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Open Problem Statements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {openProblemStatements.map((ch) => {
          const matchingSubmission = industrySubmissions.find((s) => s.challengeId === ch.id);
          const hasPhoto = ch.evidence && ch.evidence.length > 0;
          const photoUrl = hasPhoto
            ? ch.evidence[0].url
            : 'https://images.unsplash.com/photo-1590615370581-265ae19a053b?q=80&w=600&auto=format&fit=crop';

          return (
            <div
              key={ch.id}
              className="bg-white rounded-2xl border border-[#e2d6bc] hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-4">
                {/* Card Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-[#fbf8ee] px-2.5 py-1 rounded-md border border-[#e2d6bc]">
                      {ch.trackingId || ch.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Govt Approved</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ch.urgency === 'Critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : ch.urgency === 'High'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ch.urgency} Urgency
                    </span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                      {ch.category}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                {/* Location & Impact */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#fbf8ee] p-3 rounded-xl border border-[#e2d6bc]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">
                      {ch.village ? `${ch.village}, ` : ''}{ch.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{(ch.affectedPopulation || 0).toLocaleString()} Affected</span>
                  </div>
                </div>

                {/* AI / Feasibility Recommendation Pill */}
                {ch.aiAnalysis && (
                  <div className="flex items-center justify-between text-[11px] p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                    <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Suggested Lab Scope: {ch.aiAnalysis.subCategory || ch.category}</span>
                    </div>
                    <span className="font-bold text-blue-700">
                      Score: {ch.aiAnalysis.priorityScore}/100
                    </span>
                  </div>
                )}

                {/* Status of Existing Submission if any */}
                {matchingSubmission && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900">
                        {matchingSubmission.status}: {matchingSubmission.solutionTitle}
                      </span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Uploaded by {matchingSubmission.submittedBy} on{' '}
                        {new Date(matchingSubmission.submittedAt).toLocaleDateString()}. Result package currently at Government PMU desk.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#fbf8ee] border-t border-[#e2d6bc] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setDetailModalChallenge(ch)}
                  className="px-3 py-2 bg-white hover:bg-[#fbf8ee] text-slate-700 font-semibold text-xs rounded-xl border border-[#e2d6bc] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ground Evidence</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenUploadModal(ch)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {matchingSubmission ? 'Update Result to Govt' : 'Accept & Upload Result'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}

        {openProblemStatements.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-16 bg-white rounded-3xl border border-[#e2d6bc] p-8 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Open Problem Statements Match</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No government-approved problem statements match the current search or filter settings. Adjust your filters or check back for new vetted issues.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL: ACCEPT & UPLOAD RESULT TO GOVERNMENT */}
      {/* ========================================================================= */}
      {activeUploadChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e2d6bc] space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#e2d6bc]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {activeUploadChallenge.id}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Govt Approved
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  Upload Solution & Prototype Results to Government
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit your technical proposal, test data, and deliverable package directly to the State PMU.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveUploadChallenge(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Challenge Summary Banner */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Problem Statement Target</span>
              <div className="text-xs font-bold text-slate-900">{activeUploadChallenge.title}</div>
              <div className="text-[11px] text-slate-600 flex items-center gap-3 mt-1">
                <span>{activeUploadChallenge.district} District ({activeUploadChallenge.block})</span>
                <span>•</span>
                <span>Category: {activeUploadChallenge.category}</span>
                <span>•</span>
                <span>{(activeUploadChallenge.affectedPopulation || 0).toLocaleString()} residents affected</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitSolution} className="space-y-5">
              {/* Submitter & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Industry / MSME Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={activeIndustry.organization_name}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Submitting Lead
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentIndustryMember.name} (${currentIndustryMember.designation || 'Lead'})`}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Solution Title */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Solution Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={solutionTitle}
                  onChange={(e) => setSolutionTitle(e.target.value)}
                  placeholder="e.g., Solar Powered Fluoride Remediation Unit with Indigenous Filter Media"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Methodology & Solution Summary */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Solution Approach & Technical Methodology <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={solutionSummary}
                  onChange={(e) => setSolutionSummary(e.target.value)}
                  placeholder="Describe the engineering mechanism, fabrication steps, and how it directly solves the ground challenge..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Prototype Test Results & Performance Metrics */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Prototype Test Results & Field Metrics <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={technicalDetails}
                  onChange={(e) => setTechnicalDetails(e.target.value)}
                  placeholder="Specify efficiency %, batch turnaround time, throughput, sensor readings, and material certifications achieved during testing..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Collaboration Mode Toggle */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-indigo-700" />
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Government Collaboration Preference
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      collaborationMode === 'Collaborate with University'
                        ? 'bg-white border-indigo-500 ring-2 ring-indigo-200'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="collabMode"
                      checked={collaborationMode === 'Collaborate with University'}
                      onChange={() => setCollaborationMode('Collaborate with University')}
                      className="mt-1"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Collaborate with University
                      </span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Partner with academic faculty and student capstone teams for field trials & certification.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      collaborationMode === 'Independent'
                        ? 'bg-white border-indigo-500 ring-2 ring-indigo-200'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="collabMode"
                      checked={collaborationMode === 'Independent'}
                      onChange={() => setCollaborationMode('Independent')}
                      className="mt-1"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Direct Industry Solution
                      </span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Direct manufacturing & implementation turnkey for the state government department.
                      </span>
                    </div>
                  </label>
                </div>

                {collaborationMode === 'Collaborate with University' && (
                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Preferred University Partner
                    </label>
                    <select
                      value={targetUniversity}
                      onChange={(e) => setTargetUniversity(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                    >
                      <option value="Birla Institute of Technology (BIT) Mesra">
                        Birla Institute of Technology (BIT) Mesra
                      </option>
                      <option value="IIT (ISM) Dhanbad">IIT (ISM) Dhanbad</option>
                      <option value="NIT Jamshedpur">NIT Jamshedpur</option>
                      <option value="Birsa Agricultural University (BAU) Kanke">
                        Birsa Agricultural University (BAU) Kanke
                      </option>
                      <option value="Ranchi University">Ranchi University</option>
                      <option value="State Recommended Institution">
                        Open to Any State-Matched University
                      </option>
                    </select>
                  </div>
                )}
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    CSR / Budget Commitment
                  </label>
                  <input
                    type="text"
                    value={budgetCommitment}
                    onChange={(e) => setBudgetCommitment(e.target.value)}
                    placeholder="e.g. ₹5,00,000 CSR Grant & Lab Testing"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Deployment Timeline Estimate
                  </label>
                  <input
                    type="text"
                    value={timelineEstimate}
                    onChange={(e) => setTimelineEstimate(e.target.value)}
                    placeholder="e.g. 3 Months"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Deliverable File Uploads */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Attach Test Logs, CAD Diagrams & Result Deliverables
                </label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-800 font-medium">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>{file.name}</span>
                        <span className="text-slate-400 text-[10px]">({file.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="Add file name, e.g. Field-Trial-Validation.pdf"
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddFile}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add File</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveUploadChallenge(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Results to State Government</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: FULL GROUND EVIDENCE & PROBLEM DETAILS */}
      {/* ========================================================================= */}
      {detailModalChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {detailModalChallenge.id}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Government Verified</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {detailModalChallenge.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalChallenge(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                  Problem Description
                </h4>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed">
                  {detailModalChallenge.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Reported By</span>
                  <span className="font-bold text-slate-900">{detailModalChallenge.submittedBy?.userName}</span>
                  <span className="text-slate-500 block text-[11px]">Role: {detailModalChallenge.submittedBy?.userRole}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location Coordinates</span>
                  <span className="font-mono text-slate-900 font-semibold block">
                    {detailModalChallenge.gpsCoordinates
                      ? `${detailModalChallenge.gpsCoordinates.lat.toFixed(4)}° N, ${detailModalChallenge.gpsCoordinates.lng.toFixed(4)}° E`
                      : 'Geotagged'}
                  </span>
                  <span className="text-slate-500 block text-[11px]">
                    {detailModalChallenge.village ? `${detailModalChallenge.village}, ` : ''}{detailModalChallenge.block}, {detailModalChallenge.district}
                  </span>
                </div>
              </div>

              {/* Evidence Gallery */}
              {(detailModalChallenge.evidence || []).length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Ground Photos & Artifacts</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {detailModalChallenge.evidence.map((ev) => (
                      <div key={ev.id} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        {ev.type === 'image' ? (
                          <img src={ev.url} alt={ev.caption} className="w-full h-32 object-cover" />
                        ) : (
                          <div className="h-32 flex items-center justify-center text-slate-400">
                            <FileText className="w-8 h-8" />
                          </div>
                        )}
                        <div className="p-2 text-[10px] text-slate-600 font-medium truncate">
                          {ev.caption || 'Evidence'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  const target = detailModalChallenge;
                  setDetailModalChallenge(null);
                  handleOpenUploadModal(target);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Accept Challenge & Upload Result</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
