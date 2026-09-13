import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectIndustryCollaboration } from '../../types';
import {
  Handshake,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  ArrowRight,
  Filter,
  Send,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const IndustryCollaborationRequests: React.FC = () => {
  const {
    collaborations,
    activeIndustry,
    setCurrentView,
    setSelectedProjectId,
    setSelectedCollaborationId,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  const filteredCollabs = collaborations.filter((c) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return c.status === 'Pending' || c.status === 'Under Review';
    if (activeFilter === 'accepted') return c.status === 'Accepted' || c.status === 'Active';
    if (activeFilter === 'declined') return c.status === 'Declined';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Accepted / Active
          </span>
        );
      case 'Pending':
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under University Review
          </span>
        );
      case 'Declined':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Declined
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const handleOpenWorkspace = (collab: ProjectIndustryCollaboration) => {
    setSelectedCollaborationId(collab.id);
    setSelectedProjectId(collab.project_id);
    setCurrentView('industry-collaboration-workspace');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Collaboration Proposals & Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track outbound partnership expressions and institutional agreements across university research cells.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('industry-discovery')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition"
        >
          <Handshake className="w-4 h-4" />
          Browse Projects to Partner
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 inline-flex flex-wrap gap-1">
        {[
          { id: 'all', label: `All Requests (${collaborations.length})` },
          {
            id: 'pending',
            label: `Pending Review (${collaborations.filter((c) => c.status === 'Pending' || c.status === 'Under Review').length})`,
          },
          {
            id: 'accepted',
            label: `Accepted & Active (${collaborations.filter((c) => c.status === 'Accepted' || c.status === 'Active').length})`,
          },
          {
            id: 'declined',
            label: `Declined (${collaborations.filter((c) => c.status === 'Declined').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredCollabs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Handshake className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Collaboration Requests Found</h3>
          <p className="text-xs text-slate-500">
            No proposals currently match this filter. Discover active projects and propose facilities, testing, or funding.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCollabs.map((collab) => (
            <div
              key={collab.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 shadow-xs p-6 transition space-y-4"
            >
              {/* Top Row: Title, Status, Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Request ID: {collab.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Submitted {new Date(collab.started_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{collab.project_title}</h3>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Academic Partner: <strong>{collab.university_name}</strong></span>
                  </div>
                </div>

                <div className="shrink-0">{getStatusBadge(collab.status)}</div>
              </div>

              {/* Support categories */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Offered Support Categories:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {collab.collaboration_types.map((type) => (
                    <span
                      key={type}
                      className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proposed contribution text */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <div>
                  <strong>Proposed Facilities / Contribution:</strong>
                  <p className="mt-0.5 text-slate-600 leading-relaxed">{collab.proposed_contribution}</p>
                </div>
                {collab.expected_support && (
                  <div>
                    <strong>Expected Research Deliverables:</strong>
                    <p className="mt-0.5 text-slate-600 leading-relaxed">{collab.expected_support}</p>
                  </div>
                )}
                {collab.university_response_notes && (
                  <div className="p-2.5 bg-emerald-100/50 rounded-lg border border-emerald-300 text-emerald-900 mt-2">
                    <strong>University Feedback:</strong> {collab.university_response_notes}
                  </div>
                )}
              </div>

              {/* Actions Bottom Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-500">
                  Lead Industry Contact: <strong>{collab.contact_person}</strong> ({collab.contact_email})
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProjectId(collab.project_id);
                      setCurrentView('industry-project-detail');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    View Project Details
                  </button>

                  {collab.status === 'Active' && (
                    <button
                      onClick={() => handleOpenWorkspace(collab)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                    >
                      Open Co-Dev Workspace
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
