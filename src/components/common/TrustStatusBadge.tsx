import React from 'react';
import { ShieldCheck, Clock, FileCheck2, AlertCircle, Info } from 'lucide-react';

export type TrustWorkflowState =
  | 'community_report'
  | 'evidence_submitted'
  | 'under_review'
  | 'verified_challenge';

interface TrustStatusBadgeProps {
  status?: string;
  hasEvidence?: boolean;
  isVerified?: boolean;
  showExplainer?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustStatusBadge: React.FC<TrustStatusBadgeProps> = ({
  status = 'Submitted',
  hasEvidence = true,
  isVerified = false,
  showExplainer = false,
  size = 'md',
}) => {
  // Determine trust workflow state
  let trustState: TrustWorkflowState = 'community_report';
  let badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  let dotColor = 'bg-amber-500';
  let label = '🟡 Community Report (Unverified)';
  let desc = 'Initial grassroots observation submitted by citizen / community. Undergoing review before formal institutional verification.';

  if (isVerified || status === 'Validated' || status === 'University Matching' || status === 'Assigned' || status === 'In Development' || status === 'Pilot' || status === 'Implemented') {
    trustState = 'verified_challenge';
    badgeColor = 'bg-emerald-100 text-emerald-950 border-emerald-300';
    dotColor = 'bg-emerald-600';
    label = '🟢 Verified Challenge';
    desc = 'Formally verified by State Nodal Authorities & technical reviewers for institutional resource allocation.';
  } else if (status === 'Under Review') {
    trustState = 'under_review';
    badgeColor = 'bg-blue-100 text-blue-950 border-blue-300';
    dotColor = 'bg-blue-600';
    label = '🔵 Under Authority Review';
    desc = 'Currently being investigated by State Nodal Officers and academic domain specialists.';
  } else if (hasEvidence || status === 'Evidence Submitted') {
    trustState = 'evidence_submitted';
    badgeColor = 'bg-amber-100 text-amber-950 border-amber-400';
    dotColor = 'bg-amber-600';
    label = '🟠 Evidence Submitted';
    desc = 'Supporting field photos, GPS geotags, or Gram Sabha documentation attached for review.';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${badgeColor} ${sizeClasses[size]}`}
        title={desc}
      >
        <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0 animate-pulse`}></span>
        <span>{label}</span>
      </div>

      {showExplainer && (
        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{desc}</span>
        </p>
      )}
    </div>
  );
};
