import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Award,
  Sparkles,
  TrendingUp,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  FileText,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  PlusCircle,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const UniversityFundingPage: React.FC = () => {
  const { showToast, setCurrentView, projects } = useApp();
  const [activeTab, setActiveTab] = useState<'schemes' | 'disbursements' | 'uc'>('schemes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  // Grant Schemes catalog
  const fundingSchemes = [
    {
      id: 'SCH-JSHEC-2026-01',
      title: 'Jharkhand State Higher Education Innovation Grant (JSHEC)',
      sponsor: 'Govt. of Jharkhand &bull; Dept of Higher Education',
      amountMax: '₹10,00,000 per Capstone Project',
      deadline: '15 April 2026',
      eligibility: 'NAAC A/A++ Universities & Engineering Institutions in Jharkhand',
      focus: 'High-impact solutions for Fluoride/Arsenic water, Tribal Agritech, Rural Cold Chain',
      badge: 'State Govt Scheme',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'SCH-TATA-CSR-2026',
      title: 'Tata Steel Rural Water & Sanitation Tech Accelerator',
      sponsor: 'Tata Steel Corporate Sustainability & CSR Foundation',
      amountMax: '₹15,00,000 + Lab Spectrometry Access',
      deadline: '30 March 2026',
      eligibility: 'Faculty-led multidisciplinary student cohorts (TRL 4+)',
      focus: 'Decentralized defluoridation, IoT telemetry, low-cost filtration columns',
      badge: 'Corporate CSR',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    },
    {
      id: 'SCH-CIL-GREEN-2026',
      title: 'Coal India / BCCL Green Mining & Acid Drainage Remediation Fund',
      sponsor: 'Bharat Coking Coal Limited & Ministry of Coal',
      amountMax: '₹12,00,000 per Solution',
      deadline: '20 May 2026',
      eligibility: 'Mining & Chemical Engineering Departments in Dhanbad/Ranchi/Bokaro',
      focus: 'Slag/Fly-ash porous filter cartridges, mine pit water recycling for agriculture',
      badge: 'PSU Grant',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 'SCH-DST-TRIBAL-2026',
      title: 'DST Technical Seed Grant for Tribal Area Development',
      sponsor: 'Department of Science & Technology (DST), Govt of India',
      amountMax: '₹25,00,000 Multi-Year Institutional Grant',
      deadline: '10 June 2026',
      eligibility: 'Recognized R&D Centers & Incubation Labs in Scheduled Tribal Districts',
      focus: 'Indigenous minor forest produce processing, lac cultivators, micro-hydel power',
      badge: 'Central DST Scheme',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      id: 'SCH-MEITY-TIDE-2026',
      title: 'MeitY TIDE 2.0 IoT & Electronics Prototyping Seed',
      sponsor: 'Ministry of Electronics & Information Technology (MeitY)',
      amountMax: '₹7,00,000 Prototype Voucher',
      deadline: 'Open Window (Rolling)',
      eligibility: 'Student Innovators & Incubation Cohorts',
      focus: 'LoRaWAN environmental sensors, cloud telemetry gateways, edge-AI soil testers',
      badge: 'Central MeitY',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
  ];

  const disbursements = [
    {
      id: 'SANCT-JH-2026-0042',
      projectTitle: 'Solar-Powered Activated Alumina Adsorption Unit (Torpa, Khunti)',
      sponsor: 'Tata Steel CSR + JSHEC',
      totalSanctionedINR: 480000,
      tranche1Disbursed: 240000,
      tranche2Disbursed: 150000,
      tranche3Pending: 90000,
      tranche1Date: '15 Jan 2026',
      tranche2Date: '20 Feb 2026',
      ucStatus: 'UC-1 & UC-2 Verified by PMU',
      pfmsRef: 'PFMS-JH-HEI-984210',
    },
    {
      id: 'SANCT-JH-2026-0058',
      projectTitle: 'PCM Hybrid Solar Micro-Cold Storage for Tribal Lac (Gumla)',
      sponsor: 'Central Coalfields Ltd (CCL CSR)',
      totalSanctionedINR: 320000,
      tranche1Disbursed: 160000,
      tranche2Disbursed: 0,
      tranche3Pending: 160000,
      tranche1Date: '28 Feb 2026',
      tranche2Date: 'Pending Milestone 3',
      ucStatus: 'UC-1 Submitted',
      pfmsRef: 'PFMS-JH-HEI-984224',
    },
  ];

  const filteredSchemes = fundingSchemes.filter(
    (s) =>
      !searchTerm ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sponsor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.focus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyClick = (scheme: any) => {
    setSelectedScheme(scheme);
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Grant Application Submitted', `Application for "${selectedScheme?.title}" forwarded to Sanctioning Committee.`);
    setIsApplyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Higher Education R&D Grants & CSR Mobilization
            </span>
            <span className="text-xs text-slate-500 font-mono">Direct PFMS Disbursement</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Funding Opportunities & Grants
          </h1>
          <p className="text-xs text-slate-600 max-w-xl">
            State Higher Education Council grants, Corporate CSR seed funding (Tata Steel, Coal India, BCCL), and Central DST/MeitY innovation schemes.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('disbursements')}
            className="px-4 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-amber-300" />
            <span>View Disbursed Grants (₹42.5L)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sanctioned R&D Grant', value: '₹42.5 Lakhs', icon: DollarSign, color: 'text-emerald-800', bg: 'bg-emerald-50/70' },
          { label: 'Disbursed Tranches (PFMS)', value: '₹28.0 Lakhs', icon: CheckCircle2, color: 'text-teal-800', bg: 'bg-teal-50/70' },
          { label: 'Pending Tranches', value: '₹14.5 Lakhs', icon: Clock, color: 'text-amber-800', bg: 'bg-amber-50/70' },
          { label: 'Active Funding Windows', value: `${fundingSchemes.length} Schemes`, icon: Award, color: 'text-indigo-800', bg: 'bg-indigo-50/70' },
        ].map((kpi, idx) => (
          <div key={idx} className={`${kpi.bg} p-4 rounded-2xl border border-[#e2d6bc] shadow-xs flex items-center justify-between`}>
            <div>
              <span className="text-xs font-bold text-slate-600 block">{kpi.label}</span>
              <span className={`text-xl font-black ${kpi.color} mt-1 block`}>{kpi.value}</span>
            </div>
            <kpi.icon className={`w-8 h-8 opacity-30 ${kpi.color}`} />
          </div>
        ))}
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2d6bc] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search grant schemes, sponsors, CSR funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'schemes', label: `Open Grant Windows (${fundingSchemes.length})` },
            { id: 'disbursements', label: 'Disbursement & PFMS Tracker' },
            { id: 'uc', label: 'Utilization Certificates (UC)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#0d5c3a] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Schemes Catalog */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scheme.badgeColor}`}>
                    {scheme.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Deadline: <strong>{scheme.deadline}</strong></span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {scheme.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{scheme.sponsor}</p>

                <div className="p-3.5 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] text-xs text-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Sanction Cap:</span>
                    <strong className="text-emerald-800 font-bold">{scheme.amountMax}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Key Focus:</span>
                    <span className="font-medium text-slate-800">{scheme.focus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Eligibility:</span>
                    <span className="text-slate-700 text-[11px]">{scheme.eligibility}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#e2d6bc]/70 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-400">{scheme.id}</span>
                <button
                  type="button"
                  onClick={() => handleApplyClick(scheme)}
                  className="px-4 py-2 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Apply for Grant &rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Disbursements & PFMS */}
      {activeTab === 'disbursements' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Disbursement Tranches by State PMU & Corporate Sponsors</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {disbursements.map((d) => (
              <div key={d.id} className="py-4 space-y-3 first:pt-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#fbf8ee] text-slate-800 border border-[#e2d6bc]">
                      {d.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{d.projectTitle}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Sponsor: {d.sponsor} &bull; {d.pfmsRef}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Sanctioned</span>
                    <span className="text-sm font-black text-emerald-800 block">₹{(d.totalSanctionedINR / 100000).toFixed(2)} Lakhs</span>
                  </div>
                </div>

                {/* Tranche Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Tranche 1 (Disbursed)</span>
                    <span className="text-sm font-black text-emerald-900 mt-0.5 block">₹{(d.tranche1Disbursed / 100000).toFixed(2)}L</span>
                    <span className="text-[10px] text-emerald-700">{d.tranche1Date}</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${d.tranche2Disbursed > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <span className={`text-[10px] font-bold uppercase block ${d.tranche2Disbursed > 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                      Tranche 2 ({d.tranche2Disbursed > 0 ? 'Disbursed' : 'Pending Verification'})
                    </span>
                    <span className={`text-sm font-black mt-0.5 block ${d.tranche2Disbursed > 0 ? 'text-emerald-900' : 'text-amber-900'}`}>
                      ₹{(d.tranche2Disbursed / 100000).toFixed(2)}L
                    </span>
                    <span className="text-[10px] text-slate-500">{d.tranche2Date}</span>
                  </div>

                  <div className="p-3 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc]">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block">Tranche 3 (Field Milestone)</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5 block">₹{(d.tranche3Pending / 100000).toFixed(2)}L</span>
                    <span className="text-[10px] text-slate-500">Upon Field Pilot Validation</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Utilization Certificates */}
      {activeTab === 'uc' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>GFR-12A Utilization Certificates (Audit Verified)</span>
            </h3>
            <button
              type="button"
              onClick={() => showToast('info', 'Upload GFR-12A', 'Utilization certificate submission wizard activated.')}
              className="px-3 py-1.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>+ Submit New GFR-12A UC</span>
            </button>
          </div>

          <div className="p-4 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>UC #2026-JH-0042-T1 &bull; Birla Institute of Technology Mesra</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Audited & Approved by State PMU
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Expended ₹2,40,000 against Tranche-1 for Spectrometer Equipment calibration & Alumina filter cartridge fabrication.
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#e2d6bc]/50">
              <span>Verified Date: 22 Feb 2026</span>
              <span className="font-bold text-[#0d5c3a] flex items-center gap-1 cursor-pointer">
                <FileText className="w-3.5 h-3.5" />
                <span>Download Signed GFR-12A &rarr;</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grant Application Modal */}
      {isApplyModalOpen && selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#e2d6bc] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Apply for Grant</h3>
                <p className="text-xs text-slate-500">{selectedScheme.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Candidate Project / Proposal</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium">
                  <option>PROJ-JH-2026-0081: Solar-Powered Water Defluoridation Unit</option>
                  <option>PROJ-JH-2026-0082: PCM Solar Micro-Cold Storage for Tribal Lac</option>
                  <option>+ Propose New Multidisciplinary Project</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Requested Budget (INR)</label>
                <input
                  type="text"
                  defaultValue="₹4,80,000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Principal Investigator / Faculty Lead</label>
                <input
                  type="text"
                  defaultValue="Dr. Meenakshi Soren (Dept of Chemical Engineering, BIT Mesra)"
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700"
                  disabled
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Milestone Deliverable Target</label>
                <textarea
                  rows={2}
                  defaultValue="Lab TRL 5 validation by Month 2; Village field deployment in Torpa (Khunti) by Month 4 with automated LoRa telemetry."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Submit Grant Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

