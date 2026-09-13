import React from 'react';
import {
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
  Sparkles,
  FileText,
  Building2,
  Users,
} from 'lucide-react';

export const UniversityGuidelinesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            JSHEC Innovation Policy 2026
          </span>
          <span className="text-xs text-slate-600 font-mono font-semibold">NEP 2020 Framework</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Higher Education R&D Guidelines & Capstone Credit Norms
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl">
          Comprehensive statutory guidelines for Jharkhand universities engaging in community challenge resolution, multidisciplinary student cohort formation, IP royalty sharing, and CSR co-sponsorship.
        </p>
      </div>

      {/* Grid of Key Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Academic Credit Framework */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">1. Capstone Academic Credits (NEP 2020)</h3>
              <span className="text-[11px] text-slate-500">6 to 8 Credits per Semester</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Final-year undergraduate and postgraduate students resolving validated grassroots challenges earn mandatory <strong>Major Capstone Project credits</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Multidisciplinary participation across minimum 2 departments (e.g., Chemical + IoT or Mechanical + Agriculture) qualifies for <strong>Honours Innovation Designation</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Continuous evaluation rubric mapped directly to the <strong>14-Stage Innovation Lifecycle</strong> deliverables.
              </span>
            </li>
          </ul>
        </div>

        {/* 2. IP Sharing & Patent Framework */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">2. Intellectual Property & Royalty Sharing</h3>
              <span className="text-[11px] text-slate-500">State Innovation Fund Protocol</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>50% Royalty Share</strong> assigned to the University Institution for lab reinvestment and equipment maintenance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>30% Equity / Royalty Share</strong> assigned directly to the Student Innovator Team & Faculty Mentors.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>20% Share</strong> channeled into Jharkhand State Grassroots Innovation Fund to sponsor future rural cohorts.
              </span>
            </li>
          </ul>
        </div>

        {/* 3. CSR Matching Fund Norms */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">3. CSR Co-Funding & Industry Mentorship</h3>
              <span className="text-[11px] text-slate-500">Public-Private Partnership</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Matching grants up to <strong>₹5.00 Lakhs per cohort</strong> sanctioned upon reaching TRL 4 (Lab Prototype Validation).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Mandatory assignment of an <strong>Industry Co-Mentor</strong> (e.g., Tata Steel, CCL, BCCL engineers) for bi-weekly technical reviews.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Corporate partners provide testing testbeds and direct pilot deployment access in operational districts.
              </span>
            </li>
          </ul>
        </div>

        {/* 4. Field Deployment & Gram Sabha Safety */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2d6bc] shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">4. Community Co-Design & Field Pilots</h3>
              <span className="text-[11px] text-slate-500">Panchayati Raj Collaboration</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                All field pilots must receive prior orientation and endorsement from the local <strong>Gram Sabha & Mukhiya</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Student teams are paired with local <strong>Jal Sahiyas / SHG Krishi Mitras</strong> for community user feedback loops.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                State PMU provides comprehensive transit insurance and field trial equipment logistics across all 24 districts.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
