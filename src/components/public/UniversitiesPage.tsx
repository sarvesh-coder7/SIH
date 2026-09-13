import React from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_UNIVERSITIES } from '../../mock/data';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  MapPin,
  Users,
} from 'lucide-react';

export const UniversitiesPage: React.FC = () => {
  const { switchRole, setCurrentView } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              Higher Education Network
            </span>
            <span className="text-xs text-slate-400">Jharkhand State Higher Education Council</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Participating Universities, HEIs & Research Labs
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Premier academic institutes leading multidisciplinary research cohorts, student incubation, and grassroots field deployments.
          </p>
        </div>

        <button
          onClick={() => {
            switchRole('university_admin');
            setCurrentView('university-dashboard');
          }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <GraduationCap className="w-4 h-4" />
          <span>University Portal Login</span>
        </button>
      </div>

      {/* University Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_UNIVERSITIES.map((univ) => (
          <div
            key={univ.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-indigo-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{univ.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {univ.district}
                    </span>
                    <span>&bull;</span>
                    <span className="font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
                      {univ.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Domains of excellence */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Key Research Domains
                </span>
                <div className="flex flex-wrap gap-1">
                  {univ.domainStrengths.map((d) => (
                    <span
                      key={d}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-black text-slate-900 block">{univ.activeProjects}</span>
                <span className="text-[10px] text-slate-500">Active R&D Projects</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-black text-emerald-800 block">{univ.resolvedChallenges}</span>
                <span className="text-[10px] text-slate-500">Implemented Solutions</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
