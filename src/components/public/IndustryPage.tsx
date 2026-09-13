import React from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_INDUSTRY_PARTNERS } from '../../mock/data';
import {
  Briefcase,
  DollarSign,
  Building2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Award,
} from 'lucide-react';

export const IndustryPage: React.FC = () => {
  const { switchRole, setCurrentView } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              Corporate & Industrial Alliance
            </span>
            <span className="text-xs text-slate-400">CSR Section 135 Co-Funding</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Industry & CSR Partner Ecosystem
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Corporations, mining enterprises, startups, and MSMEs co-sponsoring university prototypes and providing industrial fabrication.
          </p>
        </div>

        <button
          onClick={() => {
            switchRole('industry_msme');
            setCurrentView('industry-dashboard');
          }}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Briefcase className="w-4 h-4" />
          <span>Industry Partner Portal</span>
        </button>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_INDUSTRY_PARTNERS.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-purple-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{partner.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {partner.headquarters}
                    </span>
                    <span>&bull;</span>
                    <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                      {partner.type}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  CSR Thematic Priorities
                </span>
                <div className="flex flex-wrap gap-1">
                  {partner.focalDomains?.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-purple-50 text-purple-900 text-[10px] font-medium border border-purple-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Active Projects: <strong>{partner.activeProjectsCount} Pilots</strong>
              </span>
              <span className="font-black text-purple-800 text-sm">
                ₹{((partner.totalFundingCommitted || 0) / 100000).toFixed(1)} Lakhs Grant
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
