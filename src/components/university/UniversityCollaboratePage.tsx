import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Handshake,
  Building2,
  CheckCircle2,
  DollarSign,
  Award,
  ArrowRight,
  ExternalLink,
  Users,
  ShieldCheck,
  TrendingUp,
  Search,
  Sparkles,
  PlusCircle,
  FileCheck,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  FlaskConical,
} from 'lucide-react';

export const UniversityCollaboratePage: React.FC = () => {
  const { setCurrentView, showToast, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'partners' | 'mentors' | 'mous' | 'request'>('partners');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Partnership request form state
  const [reqPartnerName, setReqPartnerName] = useState('');
  const [reqDomain, setReqDomain] = useState('Water & Sanitation');
  const [reqSupportType, setReqSupportType] = useState('CSR Grant + Lab Access');
  const [reqDescription, setReqDescription] = useState('');

  const industryPartners = [
    {
      id: 'ind-01',
      name: 'Tata Steel Corporate Sustainability & CSR',
      logo: 'Tata Steel',
      focus: 'Clean Drinking Water & Rural Micro-Infrastructure',
      contribution: '₹4,50,000 Equipment Grant + Jamshedpur Testing Labs Access',
      activeProjects: ['Fluoride Water Adsorption Unit (JH-2026-001248 / Torpa Block)'],
      mentors: [
        { name: 'Dr. Subhashish Mukherjee', designation: 'Chief Metallurgist & Water CSR Lead', email: 's.mukherjee@tatasteel.com' }
      ],
      mouStatus: 'Active MoU (2025-2028)',
      category: 'Corporate CSR & Tech Grant',
    },
    {
      id: 'ind-02',
      name: 'Bharat Coking Coal Limited (BCCL) / Coal India',
      logo: 'BCCL',
      focus: 'Mine Water Acid Drainage Neutralization & Porous Fly-Ash Cartridges',
      contribution: '₹6,00,000 CSR Grant + Dhanbad Field Mine Pumping Access',
      activeProjects: ['Fly-ash Adsorption Porous Filter Cartridges (Dhanbad Basin)'],
      mentors: [
        { name: 'Er. Anupam Kumar', designation: 'General Manager (Environment & CSR), BCCL', email: 'anupam.env@coalindia.in' }
      ],
      mouStatus: 'MoU Signed (Cleared by Ministry of Coal)',
      category: 'Public Sector Undertaking (PSU)',
    },
    {
      id: 'ind-03',
      name: 'CSIR - National Metallurgical Laboratory (CSIR-NML)',
      logo: 'CSIR-NML',
      focus: 'Advanced Nanomaterials, Vortex Filtration & Joint Patent Commercialization',
      contribution: 'Pilot Fabrication Facility + Joint IP Rights Share (50:50 Academic Split)',
      activeProjects: ['Indian Patent #202631008472 Vortex Alumina Column'],
      mentors: [
        { name: 'Dr. Sunita Ghosh', designation: 'Principal Scientist & IP Coordinator, CSIR-NML', email: 's.ghosh@nmlindia.org' }
      ],
      mouStatus: 'Research Joint Venture (RJV)',
      category: 'National Research Laboratory',
    },
    {
      id: 'ind-04',
      name: 'Central Coalfields Limited (CCL Jharkhand CSR)',
      logo: 'CCL',
      focus: 'Decentralized Cold Chain for Tribal Lac & Forest Harvest',
      contribution: '₹3,50,000 Incubation Seed Fund + Gumla District Pilot Support',
      activeProjects: ['PCM Solar Micro-Cold Storage for Tribal Lac Growers (Gumla)'],
      mentors: [
        { name: 'Er. Rajiv Prasad', designation: 'CGM (R&D & CSR Infrastructure)', email: 'rajiv.prasad@ccl.gov.in' }
      ],
      mouStatus: 'Active Partnership (2026-2027)',
      category: 'Public Sector Undertaking (PSU)',
    },
  ];

  const filteredPartners = industryPartners.filter(
    (p) =>
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPartnerName || !reqDescription) {
      showToast('warning', 'Missing Details', 'Please fill in partner name and proposal description.');
      return;
    }
    showToast('success', 'MoU / Collaboration Request Dispatched', `Partnership request for "${reqPartnerName}" forwarded to State Innovation PMU.`);
    setIsRequestModalOpen(false);
    setReqPartnerName('');
    setReqDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300">
              Corporate & CSR Synergy
            </span>
            <span className="text-xs text-slate-500 font-mono">Pillar 3: Industry Supports Solutions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Collaborate & Partner
          </h1>
          <p className="text-xs text-slate-600 max-w-xl">
            MoU alliances with Jharkhand PSUs, Tata Steel CSR, CSIR national labs, and corporate co-mentors for student capstone validation.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>+ Request Industry Partner MoU</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Corporate MoUs', value: '4 Alliances', icon: Handshake, color: 'text-amber-800', bg: 'bg-amber-50/70' },
          { label: 'CSR Grant Funding', value: '₹14.0 Lakhs', icon: DollarSign, color: 'text-emerald-800', bg: 'bg-emerald-50/70' },
          { label: 'Joint R&D Labs & IP', value: '1 Joint Patent', icon: FlaskConical, color: 'text-indigo-800', bg: 'bg-indigo-50/70' },
          { label: 'Industry Co-Mentors', value: '4 Scientists/CGMs', icon: Users, color: 'text-teal-800', bg: 'bg-teal-50/70' },
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
            placeholder="Search partners, PSUs, research domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0d5c3a]/20 focus:border-[#0d5c3a]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'partners', label: 'Industry Partners (4)' },
            { id: 'mentors', label: 'Co-Mentors Roster' },
            { id: 'mous', label: 'MoU & IP Agreements' },
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

      {/* Tab Content 1: Industry Partners */}
      {activeTab === 'partners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-black text-sm shrink-0">
                      <Building2 className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {partner.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium">{partner.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    {partner.mouStatus}
                  </span>
                </div>

                <div className="p-3.5 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] text-xs text-slate-700 space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Primary R&D Domain:</span>
                    <strong className="text-slate-900 font-semibold">{partner.focus}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">CSR & Lab Grant:</span>
                    <span className="font-bold text-emerald-800">{partner.contribution}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Active Capstone Cohort:</span>
                    <span className="font-semibold text-slate-800">{partner.activeProjects.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Mentors & Actions */}
              <div className="pt-3 border-t border-[#e2d6bc]/70 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-xs text-slate-600 flex items-center gap-1.5 w-full sm:w-auto">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Mentor: <strong>{partner.mentors[0]?.name}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('university-messages');
                    showToast('info', `Messaging ${partner.name}`, 'Opened direct co-mentor messaging channel.');
                  }}
                  className="w-full sm:w-auto px-3 py-1.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Mentor</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: Mentors Roster */}
      {activeTab === 'mentors' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0d5c3a]" />
            <span>Designated Industry Co-Mentors for BIT Mesra Student Cohorts</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {industryPartners.flatMap((p) => p.mentors.map((m, idx) => ({ ...m, org: p.name, id: `${p.id}-${idx}` }))).map((mentor) => (
              <div key={mentor.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs shrink-0">
                    {mentor.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{mentor.name}</h4>
                    <p className="text-[11px] text-slate-500">{mentor.designation} &bull; <strong className="text-slate-700">{mentor.org}</strong></p>
                    <p className="text-[11px] text-indigo-600 font-mono">{mentor.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('university-messages');
                      showToast('info', mentor.name, `Initiated consultation session with ${mentor.name}.`);
                    }}
                    className="flex-1 sm:flex-initial px-3 py-1.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Consult Mentor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: MoU & Agreements */}
      {activeTab === 'mous' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span>Executed Institutional Tripartite MoUs & IP Agreements</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Tripartite MoU: BIT Mesra &bull; Tata Steel CSR &bull; Dept of Higher Education',
                date: 'Executed: 12 Jan 2026',
                scope: 'Rural Drinking Water Technology Validation & CSR Co-funding',
                status: 'Active (Tier-1)',
              },
              {
                title: 'Joint R&D & Patent Agreement: CSIR-NML &bull; BIT Mesra R&D Cell',
                date: 'Executed: 05 Feb 2026',
                scope: 'Novel Vortex Defluoridation Patent #202631008472 50/50 Revenue Split',
                status: 'Executed & Filed',
              },
              {
                title: 'BCCL Industrial Facility Access Agreement',
                date: 'Executed: 18 Feb 2026',
                scope: 'Underground mine water pumping access for student researchers in Dhanbad',
                status: 'Field Active',
              },
              {
                title: 'CCL Tribal Micro-Cold Storage Seed Grant Agreement',
                date: 'Executed: 28 Feb 2026',
                scope: '₹3.5L Seed Capital for Gumla Lac Cultivator PCM battery',
                status: 'Disbursement Complete',
              },
            ].map((mou, idx) => (
              <div key={idx} className="p-4 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 leading-snug">{mou.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                    {mou.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{mou.scope}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-[#e2d6bc]/50">
                  <span>{mou.date}</span>
                  <span className="font-bold text-[#0d5c3a] flex items-center gap-1 cursor-pointer">
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Signed PDF</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partnership Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#e2d6bc] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Request New Industry Partnership / MoU</h3>
                <p className="text-xs text-slate-500">Initiate formal collaboration with corporate CSR or national lab.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Organization / Industry Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jindal Steel & Power / Coal India / SAIL Bokaro"
                  value={reqPartnerName}
                  onChange={(e) => setReqPartnerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Domain Focus</label>
                  <select
                    value={reqDomain}
                    onChange={(e) => setReqDomain(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option>Water & Sanitation</option>
                    <option>Renewable Energy / Solar</option>
                    <option>Mining Environment & Forestry</option>
                    <option>Tribal Agriculture & IoT</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Support Type</label>
                  <select
                    value={reqSupportType}
                    onChange={(e) => setReqSupportType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option>CSR Grant + Lab Access</option>
                    <option>Industry Co-Mentorship</option>
                    <option>Pilot Testing Site</option>
                    <option>Joint Patent Filing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Collaboration Proposal & Student Cohort Scope</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the R&D challenge, target student team, and expected technical outcome..."
                  value={reqDescription}
                  onChange={(e) => setReqDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Submit Partnership Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
