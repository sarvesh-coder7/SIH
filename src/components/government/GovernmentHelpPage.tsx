import React from 'react';
import {
  HelpCircle,
  BookOpen,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';

export const GovernmentHelpPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Standard Operating Procedures & Official Guidance</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Government SOPs & Department Directory
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Protocols for challenge verification, university matching, project intervention, and state scaling mandates.
        </p>
      </div>

      {/* SOP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            SOP-01: Challenge Due Diligence
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verify citizen submissions within 7 working days. Confirm ground existence, geotag fidelity, and PRI / Gram Sabha endorsement before advancing to university allocation.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            SOP-02: University Sanctioning
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Assess academic EOIs based on faculty mentor domain expertise, past capstone track record, and multi-university attempt history to ensure solutions build upon prior learnings.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            SOP-03: Administrative Interventions
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Deploy state support mandates for stalled projects: fast-track testing permits, facilitate district pilot sites, and coordinate CSR grant matching with industry partners.
          </p>
        </div>
      </div>

      {/* State Nodal Contacts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Jharkhand State Department Nodal Contacts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">
              Department of Higher & Technical Education (DHTE)
            </div>
            <div className="text-slate-600">State PMU Head / JSHEC Nodal Office</div>
            <div className="text-slate-500 text-[11px] pt-1">
              Email: dhte.innovation@jharkhand.gov.in • Phone: +91 651 244 6812
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">
              Department of Drinking Water & Sanitation (DWSD)
            </div>
            <div className="text-slate-600">Chief Engineer (Water Quality & Testing)</div>
            <div className="text-slate-500 text-[11px] pt-1">
              Email: dwsd.ranchi@jharkhand.gov.in • Phone: +91 651 249 0134
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">
              Department of Agriculture, Animal Husbandry & Co-operative
            </div>
            <div className="text-slate-600">Director of Horticulture & Storage</div>
            <div className="text-slate-500 text-[11px] pt-1">
              Email: agrijharkhand@gov.in • Phone: +91 651 249 1102
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">
              Department of Forest, Environment & Climate Change
            </div>
            <div className="text-slate-600">PCCF (NTFP & Tribal Livelihoods)</div>
            <div className="text-slate-500 text-[11px] pt-1">
              Email: forest.jharkhand@gov.in • Phone: +91 651 248 1009
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
