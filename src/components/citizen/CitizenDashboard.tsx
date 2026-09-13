import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlusCircle,
  Compass,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Eye,
  Camera,
  Layers,
  CircleDashed,
  Megaphone,
  Droplet,
  Sprout,
  Image as ImageIcon,
} from 'lucide-react';
import { Challenge } from '../../types';

// Helper for human-readable citizen status mapping
export const getCitizenStatusLabel = (status: string, isReopened?: boolean): { label: string; color: string; bg: string; border: string } => {
  if (isReopened) {
    return {
      label: 'Open for Another Attempt',
      color: 'text-amber-800',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    };
  }

  switch (status) {
    case 'Submitted':
      return { label: 'Submitted', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' };
    case 'Under Review':
      return { label: 'Under Review', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'Validated':
      return { label: 'Published', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'University Matching':
      return { label: 'Open for Solutions', color: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    case 'Assigned':
      return { label: 'University Assigned', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' };
    case 'In Development':
    case 'Project Proposed':
    case 'Pilot':
      return { label: 'Solution in Progress', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'Implemented':
    case 'Impact Measured':
      return { label: 'Completed', color: 'text-teal-800', bg: 'bg-teal-50', border: 'border-teal-200' };
    case 'Rejected':
      return { label: 'Attempt Unsuccessful', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200' };
    default:
      return { label: status, color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' };
  }
};

// Helper for citizen trust status
export const getCitizenTrustStatus = (ch: Challenge): { label: string; color: string; bg: string } => {
  if (ch.trustStatus) {
    switch (ch.trustStatus) {
      case 'Verified':
        return { label: 'Verified', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' };
      case 'Under Review':
        return { label: 'Under Review', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' };
      case 'Evidence Submitted':
        return { label: 'Evidence Submitted', color: 'text-blue-800', bg: 'bg-blue-50 border-blue-200' };
      default:
        return { label: 'Community Report', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' };
    }
  }

  // Fallback calculation
  const hasEvidence = (ch.evidence || []).length > 0;
  const isVerified =
    ch.status === 'Validated' ||
    ch.status === 'University Matching' ||
    ch.status === 'Assigned' ||
    ch.status === 'In Development' ||
    ch.status === 'Pilot' ||
    ch.status === 'Implemented';

  if (isVerified) {
    return { label: 'Verified', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' };
  }
  if (ch.status === 'Under Review') {
    return { label: 'Under Review', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' };
  }
  if (hasEvidence) {
    return { label: 'Evidence Submitted', color: 'text-blue-800', bg: 'bg-blue-50 border-blue-200' };
  }
  return { label: 'Community Report', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' };
};

export const CitizenDashboard: React.FC = () => {
  const {
    currentUser,
    challenges,
    navigateToChallenge,
    setCurrentView,
  } = useApp();

  const [trackingInput, setTrackingInput] = useState('');

  // Citizen's reports (all challenges or user's submitted challenges)
  const myReports = challenges;

  // 4 Simple Summary KPI Cards (Section 5)
  const stats = {
    reported: myReports.length,
    underReview: myReports.filter((c) => c.status === 'Under Review' || c.status === 'Submitted').length,
    inProgress: myReports.filter(
      (c) =>
        c.status === 'Assigned' ||
        c.status === 'In Development' ||
        c.status === 'Pilot' ||
        c.status === 'Project Proposed' ||
        c.status === 'University Matching'
    ).length,
    resolved: myReports.filter((c) => c.status === 'Implemented' || c.status === 'Impact Measured').length,
  };

  const recentReports = myReports.slice(0, 4);
  const communityDiscovery = challenges.slice(0, 3);

  return (
    <div className="space-y-8 font-sans-body">
      {/* ========================================================================= */}
      {/* 1. TOP GREETING & CTAs (MATCHING SECTION 4) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
              Community Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {currentUser.district} District &bull; Verified Member
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Hello, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
            Help improve your community by reporting real problems.
          </p>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setCurrentView('submit-challenge')}
            className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>+ Report a Problem</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('explore-challenges')}
            className="flex-1 sm:flex-initial px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-600" />
            <span>Explore Challenges</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TRACK BY TRACKING ID WIDGET */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-emerald-700/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Citizen Tracking Desk
            </span>
            <span className="text-xs text-emerald-200">
              Live State Innovation System
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Track Problem Status by Reference ID
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Enter your official Tracking ID (e.g., <code className="font-mono bg-white/10 px-1 py-0.5 rounded text-amber-300">JH-2026-XXXXXXXX</code>) to check live screening, university matching, and field pilot milestones.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (trackingInput.trim()) {
                navigateToChallenge(trackingInput.trim());
              }
            }}
            className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg"
          >
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="e.g. JH-2026-..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-mono font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transition-all"
            >
              <span>Track Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 4 DASHBOARD SUMMARY CARDS (MATCHING SECTION 5) */}
      {/* ========================================================================= */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Overview of Your Contributions
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Problems Reported */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              Problems Reported
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              {stats.reported}
            </span>
            <p className="text-[11px] text-slate-500 pt-1">
              Total challenges submitted by you
            </p>
          </div>

          {/* Card 2: Under Review */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              Under Review
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-800 block">
              {stats.underReview}
            </span>
            <p className="text-[11px] text-slate-500 pt-1">
              Currently being verified by officers
            </p>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-emerald-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              In Progress
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 block">
              {stats.inProgress}
            </span>
            <p className="text-[11px] text-slate-500 pt-1">
              Active university & team solutions
            </p>
          </div>

          {/* Card 4: Resolved */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1 hover:border-teal-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              Resolved
            </span>
            <span className="text-2xl sm:text-3xl font-black text-teal-800 block">
              {stats.resolved}
            </span>
            <p className="text-[11px] text-slate-500 pt-1">
              Successful public implementations
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. YOUR RECENT REPORTS (MATCHING SECTION 6) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Your Recent Reports
            </h2>
            <p className="text-xs text-slate-500">
              Track the live progress of problems you reported in your area.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('citizen-my-challenges')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Reports ({myReports.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Problems Reported Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Notice an issue with drinking water, road conditions, healthcare, or electricity in your village or town? Report it to get solutions started.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('submit-challenge')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2 mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Your First Problem</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentReports.map((ch) => {
              const statusInfo = getCitizenStatusLabel(ch.status, ch.isReopened);
              const trustInfo = getCitizenTrustStatus(ch);
              const photoCount = (ch.evidence || []).filter((e) => e.type === 'image').length;
              const formattedDate = ch.submittedAt
                ? new Date(ch.submittedAt).toLocaleDateString([], {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recent';

              const getCategoryStyles = (category: string) => {
                const cat = (category || '').toLowerCase();
                if (cat.includes('water')) {
                  return {
                    borderLeft: 'border-l-[4px] border-l-amber-500',
                    catIcon: <Droplet className="w-4 h-4 text-blue-500" />,
                    updateIcon: <Megaphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  };
                }
                if (cat.includes('agriculture')) {
                  return {
                    borderLeft: 'border-l-[4px] border-l-emerald-500',
                    catIcon: <Sprout className="w-4 h-4 text-emerald-600" />,
                    updateIcon: <Sprout className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  };
                }
                return {
                  borderLeft: 'border-l-[4px] border-l-amber-400',
                  catIcon: <Droplet className="w-4 h-4 text-blue-500" />,
                  updateIcon: <Megaphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                };
              };
              
              const catStyles = getCategoryStyles(ch.category);
              
              const getTrustIcon = (label: string) => {
                if (label === 'Verified') return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
                if (label === 'Evidence Submitted') return <FileText className="w-3.5 h-3.5 mr-1" />;
                return null;
              };

              const getStatusIcon = (label: string) => {
                if (label === 'Solution in Progress') return <CircleDashed className="w-3.5 h-3.5 mr-1" />;
                return null;
              };

              const trustBorderColor = trustInfo.color.replace('text-', 'border-');
              const statusBorderColor = statusInfo.color.replace('text-', 'border-');

              return (
                <div
                  key={ch.id}
                  className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${catStyles.borderLeft}`}
                >
                  <div className="space-y-3">
                    {/* ID + Status Row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        {ch.trackingId || ch.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Trust Badge */}
                        <span
                          className={`flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-white ${trustInfo.color} ${trustBorderColor}`}
                        >
                          {getTrustIcon(trustInfo.label)}
                          {trustInfo.label}
                        </span>
                        {/* Status Badge */}
                        <span
                          className={`flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-white ${statusInfo.color} ${statusBorderColor}`}
                        >
                          {getStatusIcon(statusInfo.label)}
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3
                        onClick={() => navigateToChallenge(ch.id)}
                        className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 cursor-pointer mt-1"
                      >
                        {ch.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                        {ch.description}
                      </p>
                    </div>

                    {/* Location, Date, Photos Grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs py-3 border-y border-slate-100 mt-4 mb-3">
                      {/* Location */}
                      <div className="flex items-start gap-2 pr-2 border-r border-slate-100">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex flex-col text-slate-700 justify-center">
                          <span className="text-slate-700 leading-snug">{ch.village ? `${ch.village},` : ch.district}</span>
                          {ch.village && <span className="text-slate-700 leading-snug">{ch.district} District</span>}
                        </div>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-start gap-2 px-2 border-r border-slate-100">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div className="flex flex-col text-slate-700 justify-center">
                          <span className="text-slate-700 leading-snug">Reported</span>
                          <span className="text-slate-700 leading-snug font-medium">{formattedDate}</span>
                        </div>
                      </div>

                      {/* Photos */}
                      <div className="flex items-start gap-2 pl-2">
                        <ImageIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div className="flex flex-col text-slate-700 justify-center h-full">
                          <span className="text-slate-700 font-medium">{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Latest Update Note if any */}
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between gap-3 group/update cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex items-start gap-2.5">
                        {catStyles.updateIcon}
                        <div className="text-xs text-slate-600 leading-snug">
                          <span className="font-bold text-slate-800">Latest Update: </span>
                          {ch.latestUpdate || (
                            ch.assignedUniversityName
                              ? `${ch.assignedUniversityName} is developing a pilot solution for this location.`
                              : 'Submitted report is under active screening by nodal team.'
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover/update:text-slate-600 shrink-0" />
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-2 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5">
                      {catStyles.catIcon}
                      <span className="text-xs font-medium text-slate-600">
                        Category: {ch.category}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateToChallenge(ch.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. EXPLORE COMMUNITY CHALLENGES PREVIEW (MATCHING SECTION 25) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 rounded-3xl p-6 sm:p-8 border border-amber-200/70 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <span>Explore Community Challenges in Jharkhand</span>
            </h2>
            <p className="text-xs text-slate-600">
              Browse issues reported across all 24 districts and follow community solutions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('explore-challenges')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            Browse All 24 Districts &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityDiscovery.map((ch) => {
            const statusInfo = getCitizenStatusLabel(ch.status, ch.isReopened);
            const trustInfo = getCitizenTrustStatus(ch);

            return (
              <div
                key={ch.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {ch.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <h4
                    onClick={() => navigateToChallenge(ch.id)}
                    className="text-xs font-bold text-slate-900 hover:text-amber-800 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {ch.title}
                  </h4>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{ch.district} District</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{ch.category}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {trustInfo.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateToChallenge(ch.id)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                  >
                    View &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
