import React from 'react';
import { HelpCircle, BookOpen, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

export const UniversityHelpPage: React.FC = () => {
  const faqs = [
    {
      q: 'How does the "Express Interest" phase work vs. "Official Assignment"?',
      a: 'When your university expresses interest and submits an Initial Approach, the problem enters "Under Review". Your institution does NOT own the challenge yet. The Jharkhand State PMU evaluates the technical approaches across universities and makes the Official Assignment (Official Attempt #1), which formally unlocks funding, multidisciplinary workspaces, and village access.',
    },
    {
      q: 'How are prior attempts and failure lessons preserved on the platform?',
      a: 'Unlike traditional portals where failed projects disappear, JH Innovation Connect preserves all failure analyses, spectrometry curves, CAD files, and public lessons. When an attempt halts, the challenge is reopened with its historical lessons intact so the next university can build directly upon those insights without starting from zero.',
    },
    {
      q: 'How do students receive NEP 2020 Academic Bank of Credits (ABC)?',
      a: 'Each student cohort working on an officially assigned challenge logs verifiable experiments and commits. Once the faculty guide and state evaluator verify milestone completion, up to 12-16 credits are directly credited to the student’s ABC portal.',
    },
    {
      q: 'Can private CSR partners (Tata Trusts, Coal India) fund university prototypes?',
      a: 'Yes! Pillar 3 (Industry) allows CSR foundations and public sector enterprises to provide co-funding, industrial lab access, and technical mentors directly linked to the challenge ID.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200">
            Support & Governance
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          University Help & Governance Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Guidelines on problem allocation, ethical research conduct, intellectual property (IP) sharing, and State PMU escalation.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-slate-700 leading-relaxed pl-6 font-medium">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
        <span className="font-bold text-slate-800 block text-sm">State Higher Education PMU Helpdesk</span>
        <p className="text-slate-600">
          For institutional MoU queries, IP registry assistance, or grant disbursement delays, reach out to the State PMU:
        </p>
        <div className="flex flex-wrap gap-4 pt-1 text-slate-700 font-medium">
          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-500" /> pmu.jhconnect@jharkhand.gov.in</span>
          <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-500" /> +91 651 244 6890 (Ranchi HQ)</span>
        </div>
      </div>
    </div>
  );
};
