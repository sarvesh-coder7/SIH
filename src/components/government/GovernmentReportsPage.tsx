import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectReportDocument } from '../../types/industry';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  Download,
  X,
  FileCheck,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const GovernmentReportsPage: React.FC = () => {
  const {
    projectReports,
    reviewProjectReport,
    currentGovernmentMember,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [inspectReport, setInspectReport] = useState<ProjectReportDocument | null>(null);
  const [decisionType, setDecisionType] = useState<'Approved' | 'Correction Requested' | 'Flagged' | 'Restricted' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredReports = projectReports.filter((r) => {
    if (typeFilter !== 'All' && r.report_type !== typeFilter) return false;
    if (statusFilter !== 'All') {
      const curStatus = r.review_status || 'Under Review';
      if (curStatus !== statusFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.project_id.toLowerCase().includes(q) ||
        r.university_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExecuteReview = () => {
    if (!inspectReport || !decisionType) return;
    if (!reviewNotes.trim() && decisionType !== 'Approved') {
      alert('Please provide review notes / reasoning.');
      return;
    }

    reviewProjectReport(
      inspectReport.id,
      decisionType,
      reviewNotes.trim() || 'Verified and approved by Government nodal officer.'
    );

    setInspectReport(null);
    setDecisionType(null);
    setReviewNotes('');
  };

  const handleDownloadDoc = (r: ProjectReportDocument) => {
    showToast(
      'info',
      'Document Download Initiated',
      `Downloading "${r.file_name}" (${r.file_size}) submitted by ${r.university_name}.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Academic Deliverables & Documentation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Reports & Documents Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review milestone submissions, prototype test sheets, safety certifications, and pilot impact data submitted by university faculties.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500">Submissions Queue:</span>
          <span className="text-emerald-800 font-bold">{projectReports.length} Documents</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report title, project ID, or university..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="All">All Report Types</option>
            <option value="Initial Project Report">Initial Project Report</option>
            <option value="Prototype Report">Prototype Report</option>
            <option value="Testing Report">Testing Report</option>
            <option value="Pilot Report">Pilot Report</option>
            <option value="Final Project Report">Final Project Report</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Correction Requested">Correction Requested</option>
            <option value="Flagged">Flagged</option>
            <option value="Restricted">Restricted</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Document Title & ID</th>
                <th className="py-3 px-4">University & Submitter</th>
                <th className="py-3 px-4">Report Type</th>
                <th className="py-3 px-4">File Specs</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReports.map((r) => {
                const status = r.review_status || 'Under Review';

                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-slate-900">{r.id}</div>
                      <div className="text-xs font-semibold text-slate-800 max-w-xs truncate mt-0.5">
                        {r.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Project: {r.project_id}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{r.university_name}</div>
                      <div className="text-[11px] text-slate-500">By: {r.uploaded_by}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {r.report_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      <div>{r.file_size}</div>
                      <div className="text-[10px]">{r.uploaded_at}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'Correction Requested'
                            ? 'bg-amber-100 text-amber-800'
                            : status === 'Flagged'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {status === 'Approved' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : status === 'Correction Requested' ? (
                          <Clock className="w-3 h-3 text-amber-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-blue-600" />
                        )}
                        <span>{status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[11px] text-slate-600 font-medium">{r.visibility}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownloadDoc(r)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setInspectReport(r);
                            setDecisionType(null);
                            setReviewNotes(r.review_notes || '');
                          }}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No documents found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Governance Modal */}
      {inspectReport && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Government Report Governance
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Review Official Milestone Deliverable
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Document #{inspectReport.id}: {inspectReport.title}
                </div>
              </div>
              <button
                onClick={() => setInspectReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-700">
              <div><strong>Project ID:</strong> {inspectReport.project_id}</div>
              <div><strong>Submitted By:</strong> {inspectReport.uploaded_by} ({inspectReport.university_name})</div>
              <div><strong>Date & File:</strong> {inspectReport.uploaded_at} • {inspectReport.file_name} ({inspectReport.file_size})</div>
              <div><strong>Scope / Description:</strong> {inspectReport.description}</div>
            </div>

            {/* Decision options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Review Decision *
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDecisionType('Approved')}
                  className={`p-2 rounded-xl border text-left font-bold flex items-center gap-1.5 ${
                    decisionType === 'Approved'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Approve Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionType('Correction Requested')}
                  className={`p-2 rounded-xl border text-left font-bold flex items-center gap-1.5 ${
                    decisionType === 'Correction Requested'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Request Correction</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionType('Flagged')}
                  className={`p-2 rounded-xl border text-left font-bold flex items-center gap-1.5 ${
                    decisionType === 'Flagged'
                      ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Flag for Scrutiny</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionType('Restricted')}
                  className={`p-2 rounded-xl border text-left font-bold flex items-center gap-1.5 ${
                    decisionType === 'Restricted'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Restrict Visibility</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Review Notes & Feedback *
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter technical feedback, required document additions, or sanction details..."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setInspectReport(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                disabled={!decisionType}
                onClick={handleExecuteReview}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Submit Official Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
