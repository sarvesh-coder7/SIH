import React from 'react';
import { Wrench, Sparkles, Network, ArrowRight, ShieldCheck, CheckCircle2, GraduationCap, Building2 } from 'lucide-react';

interface IntelligentRoutingCardProps {
  category?: string;
  recommendedPathway?: 'public_service' | 'innovation_rnd' | 'hybrid';
  compact?: boolean;
}

export const IntelligentRoutingCard: React.FC<IntelligentRoutingCardProps> = ({
  category = 'Water Resources',
  recommendedPathway = 'innovation_rnd',
  compact = false,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Intelligent Solution Pathways
            </h4>
            <p className="text-[11px] text-slate-500">
              Not all challenges require university R&D — the platform determines the optimal resolution path.
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-indigo-50 text-indigo-800 border border-indigo-200">
          Conceptual AI Routing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pathway A */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            recommendedPathway === 'public_service'
              ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-400'
              : 'border-slate-200 bg-slate-50/60'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Path A: Public Service Action</span>
                <span className="text-[10px] text-slate-500">Direct Government / Municipal Resolution</span>
              </div>
            </div>
            {recommendedPathway === 'public_service' && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 uppercase">
                Active Path
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">
            For operational maintenance, equipment repairs, or routine municipal services (e.g. broken streetlights, transformer replacement, canal desilting).
          </p>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium overflow-x-auto">
            <span>Citizen</span>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <span>Nodal Review</span>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <strong className="text-amber-900">Line Dept Action</strong>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <span>Resolution</span>
          </div>
        </div>

        {/* Pathway B */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            recommendedPathway === 'innovation_rnd' || recommendedPathway === 'hybrid'
              ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-400'
              : 'border-slate-200 bg-slate-50/60'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Path B: Innovation & R&D Challenge</span>
                <span className="text-[10px] text-slate-500">University + Industry Co-Creation</span>
              </div>
            </div>
            {recommendedPathway === 'innovation_rnd' && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-950 uppercase">
                Recommended Path
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">
            For complex technological, agricultural, or environmental challenges needing HEI lab research, prototype fabrication (TRL 1-5), and CSR co-funding.
          </p>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium overflow-x-auto">
            <span>Citizen</span>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <strong className="text-indigo-900">HEI Team</strong>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <strong className="text-purple-900">CSR Sponsor</strong>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <span>Field Pilot</span>
            <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <span>Scale</span>
          </div>
        </div>
      </div>
    </div>
  );
};
