import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Handshake,
  DollarSign,
  Award,
  ArrowRight,
  ExternalLink,
  Users,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const UniversityIndustryPage: React.FC = () => {
  const { setCurrentView } = useApp();

  const industryPartners = [
    {
      id: 'ind-01',
      name: 'Tata Steel Corporate Sustainability & CSR',
      focus: 'Clean Drinking Water & Rural Micro-Infrastructure',
      contribution: '₹4,50,000 Equipment Grant + Jamshedpur Testing Labs',
      activeProjects: ['Water Purification in Khunti (JH-2026-0042 / JH-2026-001248)'],
      mentors: ['Dr. Subhashish Mukherjee (Chief Metallurgist, Tata Steel)'],
      status: 'Active Co-funding',
    },
    {
      id: 'ind-02',
      name: 'Bharat Coking Coal Limited (BCCL) / Coal India',
      focus: 'Mine Water Acid Drainage Neutralization & Slag Adsorbents',
      contribution: '₹6,00,000 CSR Grant + Dhanbad Field Mine Pumping Access',
      activeProjects: ['Fly-ash Adsorption Porous Filter Cartridges'],
      mentors: ['Er. Anupam Kumar (GM Environment, BCCL)'],
      status: 'MoU Signed',
    },
    {
      id: 'ind-03',
      name: 'CSIR - National Metallurgical Laboratory (CSIR-NML)',
      focus: 'Advanced Nanomaterials & Patent Commercialization',
      contribution: 'Pilot Fabrication Facility + Joint IP Rights Share',
      activeProjects: ['Indian Patent #202631008472 Vortex Alumina Column'],
      mentors: ['Dr. Sunita Ghosh (Principal Scientist, CSIR-NML)'],
      status: 'Research Joint Venture',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300">
            Corporate & CSR Synergy
          </span>
          <span className="text-xs font-mono text-slate-500 font-bold">
            Pillar 3: Industry Supports Solutions
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Industry Collaboration & CSR Matching Grants
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          Jharkhand&apos;s leading industrial enterprises and CSR foundations directly back university research with lab access, field testbeds, and co-funding.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Co-funding Allocated</span>
          <div className="text-2xl font-black text-emerald-700">₹14,50,000</div>
          <p className="text-[11px] text-slate-500">Across 3 industrial partner grants</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Joint Patent Collaborations</span>
          <div className="text-2xl font-black text-indigo-700">2 Published</div>
          <p className="text-[11px] text-slate-500">With CSIR-NML & Tata Steel R&D</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Active Corporate Mentors</span>
          <div className="text-2xl font-black text-blue-700">7 Specialists</div>
          <p className="text-[11px] text-slate-500">Advising university student cohorts</p>
        </div>
      </div>

      {/* Industry Partners List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Active Corporate & Research Partners
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {industryPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                      {partner.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Focus: {partner.focus}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold">
                  {partner.contribution}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block">Supported Projects</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                    {partner.activeProjects.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block">Assigned Technical Mentors</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                    {partner.mentors.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCurrentView('project-workspace')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open Joint Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
