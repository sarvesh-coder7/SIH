import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SolutionProposalBuilder } from './SolutionProposalBuilder';
import { SolutionProposal } from '../../types';
import {
  FileText,
  PlusCircle,
  DollarSign,
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Download,
  Send,
  Search,
  ExternalLink,
} from 'lucide-react';

export const UniversityProposalsPage: React.FC = () => {
  const { challenges, showToast, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'proposals' | 'builder' | 'csr'>('proposals');

  const [proposals, setProposals] = useState<Partial<SolutionProposal>[]>([
    {
      id: 'PROP-JH-2026-0042',
      challengeId: 'JH-2026-001248',
      challengeTitle: 'High Fluoride Contamination in Ground Water (Khunti)',
      universityId: 'univ-bit-mesra',
      universityName: 'Birla Institute of Technology, Mesra',
      title: 'Solar-Powered Activated Alumina Adsorption Unit with IoT Fluoride Telemetry',
      executiveSummary:
        'A modular, low-cost community defluoridation filtration unit engineered using local bauxite-derived activated alumina, paired with a solar-powered telemetry sensor transmitting water purity data to Jharkhand Jal Seva Cloud.',
      technologyStack: ['Activated Alumina', 'Solar PV (120W)', 'LoRaWAN Telemetry', 'STM32 Microcontroller', 'Mobile App'],
      totalBudgetINR: 480000,
      socialImpactScore: 96,
      status: 'Approved',
      submittedDate: '2026-02-14',
      industryPartnersRequested: ['Tata Steel CSR Foundation', 'Central Coalfields Ltd (CCL)'],
    },
    {
      id: 'PROP-JH-2026-0058',
      challengeId: 'JH-2026-001252',
      challengeTitle: 'Off-grid Cold Storage for Lac Cultivators (Gumla)',
      universityId: 'univ-bit-mesra',
      universityName: 'Birla Institute of Technology, Mesra',
      title: 'Phase-Change Material (PCM) Hybrid Solar Micro-Cold Storage for Tribal Lac Growers',
      executiveSummary:
        'A decentralized 2-ton thermal battery cold storage unit utilizing eutectic PCM to maintain 12-15°C temperature for 48 hours without grid electricity, reducing post-harvest lac deterioration by 65%.',
      technologyStack: ['Solar Thermal PV', 'Inorganic PCM Plates', 'IoT Temperature Array', 'Mobile Dashboard'],
      totalBudgetINR: 320000,
      socialImpactScore: 91,
      status: 'Under Review',
      submittedDate: '2026-02-28',
      industryPartnersRequested: ['Central Coalfields Ltd', 'JSMC CSR'],
    },
    {
      id: 'PROP-JH-2026-0061',
      challengeId: 'JH-2026-001259',
      challengeTitle: 'Maternal Anemia Diagnostic Kit with Instant HB Reading',
      universityId: 'univ-bit-mesra',
      universityName: 'Birla Institute of Technology, Mesra',
      title: 'Point-of-Care Spectrophotometric Hemoglobin Estimator with Vernacular Voice Prompts',
      executiveSummary:
        'Handheld, battery-operated non-invasive optical sensor designed for Sahiya health workers that reads hemoglobin levels in 15 seconds and delivers audio alerts in Santhali, Ho, and Hindi.',
      technologyStack: ['Multi-Wavelength Optical Sensor', 'ESP32 Audio SoC', 'ICMR Calibration Algorithm'],
      totalBudgetINR: 195000,
      socialImpactScore: 98,
      status: 'Draft',
      submittedDate: '2026-03-01',
      industryPartnersRequested: ['Vedanta CSR', 'National Health Mission PMU'],
    },
  ]);

  const handleProposalSubmitted = (newProp: Partial<SolutionProposal>) => {
    const proposalObj: Partial<SolutionProposal> = {
      ...newProp,
      id: `PROP-JH-2026-00${proposals.length + 70}`,
      status: 'Under Review',
      submittedDate: new Date().toISOString().split('T')[0],
      socialImpactScore: 92,
      universityName: 'Birla Institute of Technology, Mesra',
    };

    setProposals([proposalObj, ...proposals]);
    showToast('success', 'Proposal Forwarded', 'Proposal forwarded to State PMU and CSR Foundation for funding sanction.');
    setActiveTab('proposals');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              R&D Grants & CSR Co-Funding Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">JSHEC Grant Scheme 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Technical Solution Proposals & Grants
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Formulate detailed capstone solution proposals with itemized hardware budgets, TRL roadmaps, and CSR grant requisitions for Jharkhand community challenges.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-[#0d5c3a] hover:bg-[#0b4d30] text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Formulate New Proposal</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e2d6bc] bg-white rounded-t-xl px-4 pt-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('proposals')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'proposals'
              ? 'border-[#0d5c3a] text-[#0d5c3a]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Proposals Dossier ({proposals.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'builder'
              ? 'border-[#0d5c3a] text-[#0d5c3a]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>Proposal Formulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('csr')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'csr'
              ? 'border-[#0d5c3a] text-[#0d5c3a]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-600" />
          <span>CSR Grants Directory</span>
        </button>
      </div>

      {/* Tab 1: Proposals Dossier */}
      {activeTab === 'proposals' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e2d6bc] shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Total Proposed</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{proposals.length}</span>
              <span className="text-[10px] text-emerald-700 font-bold">₹9.95 Lakhs Pipeline</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#e2d6bc] shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Sanctioned & Approved</span>
              <span className="text-xl font-black text-emerald-700 mt-1 block">
                {proposals.filter((p) => p.status === 'Approved').length}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">Funds Disbursed to HEI</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#e2d6bc] shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Under PMU Review</span>
              <span className="text-xl font-black text-amber-600 mt-1 block">
                {proposals.filter((p) => p.status === 'Under Review').length}
              </span>
              <span className="text-[10px] text-amber-600 font-bold">Awaiting CSR Clearance</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#e2d6bc] shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Avg. Social Impact</span>
              <span className="text-xl font-black text-purple-700 mt-1 block">95 / 100</span>
              <span className="text-[10px] text-purple-700 font-bold">High Societal ROI</span>
            </div>
          </div>

          {/* Proposals List */}
          <div className="space-y-4">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2d6bc] shadow-xs hover:border-emerald-400 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2d6bc]/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#fbf8ee] text-slate-700 border border-[#e2d6bc]">
                        {prop.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          prop.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : prop.status === 'Under Review'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {prop.status}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                        Submitted: {prop.submittedDate}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{prop.title}</h3>
                    <p className="text-xs text-slate-500">
                      Problem Context: <strong>{prop.challengeTitle}</strong> ({prop.challengeId})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-black text-emerald-800 block">
                      ₹{(prop.totalBudgetINR || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">Total Sanction Amount</span>
                  </div>
                </div>

                {/* Executive Summary & Tech Stack */}
                <div className="space-y-3 text-xs text-slate-600">
                  <p className="leading-relaxed">{prop.executiveSummary}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-bold text-slate-700 text-[11px]">Key Technologies:</span>
                    {prop.technologyStack?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#fbf8ee] text-slate-700 border border-[#e2d6bc] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Partner info */}
                  {prop.industryPartnersRequested && (
                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-purple-950 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                        <span>Target Industry / CSR Co-Sponsors:</span>
                        <strong className="text-purple-900">
                          {prop.industryPartnersRequested.join(', ')}
                        </strong>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200/80 font-bold text-purple-900">
                        80% Matching Grant
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2d6bc]/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">
                      Social Impact Score: <strong className="text-emerald-800">{prop.socialImpactScore}/100</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast('info', 'Dossier Downloaded', `${prop.id} Technical Specification PDF generated.`)}
                      className="px-3 py-1.5 bg-[#fbf8ee] border border-[#e2d6bc] hover:bg-[#f7f2e4] rounded-lg text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentView('project-workspace')}
                      className="px-3 py-1.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Track Lifecycle</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Proposal Builder */}
      {activeTab === 'builder' && (
        <div className="animate-in fade-in duration-150">
          <SolutionProposalBuilder
            challengeId={challenges[0]?.id || 'JH-2026-001248'}
            onProposalSubmitted={handleProposalSubmitted}
          />
        </div>
      )}

      {/* Tab 3: CSR Grants Directory */}
      {activeTab === 'csr' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-950 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-purple-700 shrink-0" />
            <div>
              <strong className="block font-bold">Jharkhand CSR Co-Funding Sandbox</strong>
              <span className="text-slate-600">
                Major PSUs and Industrial houses in Jharkhand have committed ₹19.4+ Crores in CSR funds to co-sponsor HEI multidisciplinary capstone innovations.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Tata Steel CSR Foundation',
                focalDomains: 'Water Sanitation, Maternal Health, Tribal Livelihoods',
                maxGrant: '₹5,00,000 per project',
                activeCoSponsors: 8,
                districts: 'East Singhbhum, Khunti, Ramgarh',
              },
              {
                name: 'Central Coalfields Limited (CCL) CSR',
                focalDomains: 'Renewable Energy, Solar Cold Storage, Skilling',
                maxGrant: '₹4,00,000 per project',
                activeCoSponsors: 5,
                districts: 'Ranchi, Bokaro, Hazaribagh, Chatra',
              },
              {
                name: 'BCCL & Coal India R&D Trust',
                focalDomains: 'Mine Water Treatment, Air Quality, Soil Rejuvenation',
                maxGrant: '₹6,50,000 per project',
                activeCoSponsors: 4,
                districts: 'Dhanbad, Giridih',
              },
              {
                name: 'Vedanta / Electrosteel CSR',
                focalDomains: 'Digital Classroom Skilling, Anemia Detection',
                maxGrant: '₹3,50,000 per project',
                activeCoSponsors: 3,
                districts: 'Bokaro, Saraikela',
              },
            ].map((corp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">{corp.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active Grant Window
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Priority Thematic Areas:</span>
                    <strong className="text-slate-800">{corp.focalDomains}</strong>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Max Sanction:</span>
                    <strong className="text-purple-800">{corp.maxGrant}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Focal Districts:</span>
                    <span className="text-slate-700">{corp.districts}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('builder');
                    showToast('info', 'CSR Selected', `Targeting ${corp.name} in proposal builder.`);
                  }}
                  className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition-all"
                >
                  Apply with Capstone Proposal &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
