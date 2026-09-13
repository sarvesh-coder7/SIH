import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  Building2,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const UniversityReportsPage: React.FC = () => {
  const { currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const reports = [
    {
      id: 'REP-2026-081',
      title: 'Water Purity & Spectrometry Milestone 3 Certification (Torpa Block)',
      challengeId: 'JH-2026-0042',
      category: 'Telemetry & Lab Validation',
      author: 'Dr. Meenakshi Soren (BIT Mesra)',
      date: '2026-02-18',
      size: '3.4 MB',
      status: 'Verified by PHED',
      type: 'PDF',
    },
    {
      id: 'REP-2026-042-FAIL',
      title: 'Attempt #1 Failure Analysis: Bio-Sand Clogging in High Turbidity Monsoon Silt',
      challengeId: 'JH-2026-0042',
      category: 'Failure Analysis & Public Lessons',
      author: 'Dept. of Bio-Chemical Engineering (BIT Mesra)',
      date: '2025-05-20',
      size: '4.8 MB',
      status: 'Public Lesson Preserved',
      type: 'PDF',
    },
    {
      id: 'REP-2025-091-SCALE',
      title: 'Attempt #2 Failure Report: Calcium Carbonate Scaling on EDR Electrodes',
      challengeId: 'JH-2026-0042',
      category: 'Failure Analysis & Public Lessons',
      author: 'Centre for Mining Environment (IIT ISM Dhanbad)',
      date: '2025-11-05',
      size: '5.1 MB',
      status: 'Public Lesson Preserved',
      type: 'PDF',
    },
    {
      id: 'PAT-2026-NML-01',
      title: 'Indian Patent Application #202631008472: Hybrid Activated Alumina Vortex Purifier',
      challengeId: 'JH-2026-0042',
      category: 'Intellectual Property (IP)',
      author: 'NIT Jamshedpur & CSIR-NML',
      date: '2026-01-29',
      size: '2.9 MB',
      status: 'Filed & Published',
      type: 'PDF',
    },
    {
      id: 'REP-2026-GRAM-01',
      title: 'Village X Gram Panchayat Formal Handover & Village Maintenance SOP',
      challengeId: 'JH-2026-0042',
      category: 'Field Handover & Community',
      author: 'Torpa Block Administration & Gram Sabha',
      date: '2026-02-12',
      size: '1.8 MB',
      status: 'Ratified by Gram Pradhan',
      type: 'PDF',
    },
    {
      id: 'REP-2026-CSR-01',
      title: 'Tata Trusts & JSHEC Tranche 2 Financial Utilization Statement (₹1.8L)',
      challengeId: 'JH-2026-001248',
      category: 'Financial & Grants',
      author: 'Dean of R&D, BIT Mesra',
      date: '2026-02-01',
      size: '1.2 MB',
      status: 'Audited',
      type: 'PDF',
    },
  ];

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.challengeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200">
            Institutional Repository
          </span>
          <span className="text-xs font-mono text-slate-500 font-bold">
            {currentUser.organization || 'BIT Mesra, Ranchi'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Reports, Datasets & Preserved Documents
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          Access all public failure analyses, certified lab test reports, field handover certificates, and joint patent filings archived on the JH Innovation Connect platform.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search reports, patents, failure logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-medium">
          {['All', 'Failure Analysis & Public Lessons', 'Telemetry & Lab Validation', 'Intellectual Property (IP)', 'Field Handover & Community'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Reports Table/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                  {report.challengeId}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    report.status.includes('Public Lesson')
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : report.status.includes('Filed')
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {report.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {report.title}
              </h3>

              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{report.author}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-500 font-mono">
                {report.date} &bull; {report.size}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Opening report document: ${report.title}`)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Downloading verified document: ${report.id}.pdf`)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
