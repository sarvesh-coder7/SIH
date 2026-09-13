import React from 'react';
import {
  HelpCircle,
  BookOpen,
  FileQuestion,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  ExternalLink,
} from 'lucide-react';

export const IndustryHelpPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Industry Partner Help & Governance Desk</h1>
        <p className="text-xs text-slate-500 mt-1">
          Operational handbook, statutory CSR compliance guidelines, and State PMU contact coordinates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Frequently Asked Questions
          </h3>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block">
                Does expressing interest make our organization the owner of the project?
              </span>
              <p className="text-slate-600 leading-relaxed">
                No. Under Jharkhand State Higher Education Council policy, research belongs to the university and students. Industry partners enter a co-development partnership providing testbeds, equipment, and mentorship while retaining access rights as defined in the tripartite MoU.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block">
                Can our funding be counted towards statutory Section 135 CSR?
              </span>
              <p className="text-slate-600 leading-relaxed">
                Yes. University research addressing drinking water, renewable energy, and maternal health in notified aspirational districts complies with Schedule VII. Official utilization certificates and auditor reports are generated via this portal.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block">
                How do we schedule laboratory access for students at our facility?
              </span>
              <p className="text-slate-600 leading-relaxed">
                Once a collaboration is marked Active, log the facility allocation in the Collaboration Workspace under "Logged Contributions". The faculty supervisor will coordinate student laboratory slots.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              State PMU Industry Liaison Cell
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">Jharkhand Higher Education Innovation Cell (JHEIC)</span>
                <p className="text-slate-600">
                  Department of Higher and Technical Education, Government of Jharkhand, Project Building, Dhurwa, Ranchi 834004.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>industry-connect@jharkhandinnovation.gov.in</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+91 651 240 1890 (Ext: 204) • Mon-Fri 10:00 - 17:00 IST</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Institutional MoU Templates
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download standard tripartite model agreements vetted by the state advocate general for industry-university co-development, intellectual property sharing, and equipment loaning.
            </p>
            <div className="pt-2">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  `GOVERNMENT OF JHARKHAND - MODEL TRIPARTITE INDUSTRY-ACADEMIA MOU\nStandard terms for technology testbeds, CSR grant co-funding, and non-exclusive public good deployment.`
                )}`}
                download="Tripartite-Academia-Industry-MoU-Template.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
              >
                Download MoU Template
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
