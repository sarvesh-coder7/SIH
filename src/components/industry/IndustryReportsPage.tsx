import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectReportDocument } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Lock,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const IndustryReportsPage: React.FC = () => {
  const { projectReports, activeIndustry } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('All');
  const [viewingDoc, setViewingDoc] = useState<ProjectReportDocument | null>(null);

  const reportTypes = [
    'All',
    'Technical Report',
    'Testing Report',
    'Prototype Document',
    'Impact Report',
    'Project Report',
  ];

  const filteredReports = useMemo(() => {
    return projectReports.filter((doc) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchProj = doc.project_title.toLowerCase().includes(q);
        const matchUniv = doc.university_name.toLowerCase().includes(q);
        const matchDesc = doc.description.toLowerCase().includes(q);
        if (!matchTitle && !matchProj && !matchUniv && !matchDesc) return false;
      }

      // Type
      if (selectedType !== 'All' && doc.report_type !== selectedType) {
        return false;
      }

      // Visibility
      if (selectedVisibility !== 'All' && doc.visibility !== selectedVisibility) {
        return false;
      }

      return true;
    });
  }, [projectReports, searchQuery, selectedType, selectedVisibility]);

  const isAuthorized = (doc: ProjectReportDocument) => {
    // Industry can view PUBLIC, PARTICIPANTS, INDUSTRY_ONLY
    return (
      doc.visibility === 'PUBLIC' ||
      doc.visibility === 'PARTICIPANTS' ||
      doc.visibility === 'INDUSTRY_ONLY'
    );
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Public
          </span>
        );
      case 'PARTICIPANTS':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            Participants Only
          </span>
        );
      case 'INDUSTRY_ONLY':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Industry Authorized
          </span>
        );
      case 'UNIVERSITY_ONLY':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            University Protected
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {visibility}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic & Technical Reports Repository</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access authorized laboratory validation reports, prototype engineering specifications, and impact audits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Access Level: <strong>Verified Industry Organization</strong></span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, project, test methodology, or university..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              {reportTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Document Categories' : t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table/Card Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredReports.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No reports matching the specified filter criteria.
            </div>
          ) : (
            filteredReports.map((doc) => {
              const authorized = isAuthorized(doc);

              return (
                <div
                  key={doc.id}
                  className="p-5 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800">
                        {doc.report_type}
                      </span>
                      {getVisibilityBadge(doc.visibility)}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-400">• {doc.file_size}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {doc.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-medium text-emerald-800">{doc.project_title}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {doc.university_name}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">By: {doc.uploaded_by}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 pt-0.5">
                      {doc.description}
                    </p>
                  </div>

                  {/* Actions based on authorization */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    {authorized ? (
                      <>
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Dossier
                        </button>
                        <a
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                            `JH INNOVATION CONNECT REPORT ARCHIVE\nDocument: ${doc.title}\nProject: ${doc.project_title}\nUniversity: ${doc.university_name}\nType: ${doc.report_type}\nAuthor: ${doc.uploaded_by}\nDate: ${doc.uploaded_at}\n\nTECHNICAL SUMMARY:\n${doc.description}`
                          )}`}
                          download={doc.file_name}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      </>
                    ) : (
                      <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Restricted to Faculty</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dossier Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">{viewingDoc.title}</h4>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-1.5">
              <div><strong>Project:</strong> {viewingDoc.project_title}</div>
              <div><strong>University:</strong> {viewingDoc.university_name}</div>
              <div><strong>Document Category:</strong> {viewingDoc.report_type}</div>
              <div><strong>Principal Investigator / Lead:</strong> {viewingDoc.uploaded_by}</div>
              <div><strong>Access Policy:</strong> {viewingDoc.visibility}</div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs text-slate-700 leading-relaxed">
              <div className="font-bold text-emerald-900 mb-1">Dossier Executive Summary:</div>
              {viewingDoc.description}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  `JH INNOVATION CONNECT REPORT ARCHIVE\nDocument: ${viewingDoc.title}\nProject: ${viewingDoc.project_title}\nUniversity: ${viewingDoc.university_name}\nType: ${viewingDoc.report_type}\nAuthor: ${viewingDoc.uploaded_by}\nDate: ${viewingDoc.uploaded_at}\n\nTECHNICAL SUMMARY:\n${viewingDoc.description}`
                )}`}
                download={viewingDoc.file_name}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Document
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
