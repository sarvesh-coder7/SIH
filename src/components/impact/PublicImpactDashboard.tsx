import React from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_DISTRICT_METRICS } from '../../mock/data';
import {
  TrendingUp,
  Award,
  Users,
  Building2,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  HeartHandshake,
} from 'lucide-react';

export const PublicImpactDashboard: React.FC = () => {
  const { challenges, projects, navigateToChallenge, setCurrentView } = useApp();

  const successStories = [
    {
      title: 'Solar Community Defluoridation Kiosks in Torpa',
      district: 'Khunti',
      impact: '18,500 villagers protected from dental & skeletal fluorosis with 99.2% uptime',
      leadUniv: 'BIT Mesra',
      partner: 'Tata Steel CSR Foundation',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Decentralized Micro-Hydro Turbine for Forest Hamlets',
      district: 'Latehar',
      impact: 'Electrified 3 ungrid forest hamlets, powering cold storage and school lighting',
      leadUniv: 'NIT Jamshedpur',
      partner: 'Central Coalfields Ltd (CCL)',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Automated Lac Processing & Quality Grading Rig',
      district: 'Ranchi',
      impact: 'Boosted tribal lac farmer net household earnings by +38%',
      leadUniv: 'Birsa Agricultural University & CSIR-NML',
      partner: 'Jharkhand Forest Development Corp',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> State Transparency & Impact Scorecard
            </span>
            <span className="text-xs text-slate-400">Department of Higher & Technical Education</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Grassroots Innovation Impact Across Jharkhand
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time public metrics on problem resolutions, academic research conversions, and citizen wellbeing outcomes.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('map-view')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <MapPin className="w-4 h-4" />
          <span>Interactive State Map</span>
        </button>
      </div>

      {/* Primary Impact KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Citizen Beneficiaries', value: '1,42,800+', sub: 'Verified by District PMUs', color: 'text-emerald-800', bg: 'bg-emerald-50/70' },
          { label: 'Active University Labs', value: '38 HEI Labs', sub: 'Across 12 Universities', color: 'text-indigo-800', bg: 'bg-indigo-50/70' },
          { label: 'CSR Capital Deployed', value: '₹4.85 Crore', sub: 'Section 135 Co-funding', color: 'text-purple-800', bg: 'bg-purple-50/70' },
          { label: 'Policy Directives', value: '6 Schemes', sub: 'Formulated from Field Pilots', color: 'text-amber-800', bg: 'bg-amber-50/70' },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-5 rounded-2xl border border-slate-200 shadow-2xs`}>
            <span className="text-xs font-bold text-slate-600 block">{item.label}</span>
            <span className={`text-2xl font-black ${item.color} my-1 block`}>{item.value}</span>
            <span className="text-[10px] text-slate-500 block">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Featured Success Stories */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Featured Solution Implementations & Verified Case Studies
            </h3>
            <p className="text-xs text-slate-500">From grassroots citizen challenge to full community rollout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {successStories.map((story, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:bg-white hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div>
                <img src={story.image} alt={story.title} className="w-full h-44 object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {story.district} District
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">TRL 9 Implemented</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{story.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{story.impact}</p>
                </div>
              </div>

              <div className="p-4 pt-0 text-[11px] text-slate-500 border-t border-slate-100 mt-2 space-y-1">
                <div>
                  <strong>HEI:</strong> {story.leadUniv}
                </div>
                <div>
                  <strong>CSR Partner:</strong> {story.partner}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
