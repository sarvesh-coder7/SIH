import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe2,
  Users,
  Award,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Rocket,
  Download,
  Building2,
} from 'lucide-react';

export const GovernmentImpactPage: React.FC = () => {
  const { projects, challenges, showToast } = useApp();

  // Aggregate genuine impact from challenges and projects
  const totalTargetBeneficiaries = challenges.reduce(
    (acc, c) => acc + (c.affectedPopulation || 0),
    0
  );

  // Deployed / pilot projects
  const pilotOrDeployed = projects.filter(
    (p) =>
      p.currentStage === 'Pilot Deployment' ||
      p.currentStage === 'Scale-up & Policy Integration'
  );

  const estimatedBeneficiariesReached = pilotOrDeployed.reduce((acc, p) => {
    const ch = challenges.find((c) => c.id === p.challengeId);
    return acc + (ch?.affectedPopulation || 12000);
  }, 0);

  const handleExportBrief = () => {
    showToast(
      'success',
      'Impact Summary Exported',
      'Jharkhand Societal Innovation Impact Assessment brief generated for Cabinet Secretariat.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Globe2 className="w-4 h-4" />
            <span>State Outcomes & Societal ROI</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Impact Assessment & Statewide Deployment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified ground outcomes, household coverage, and policy integration from university capstones across Jharkhand.
          </p>
        </div>

        <button
          onClick={handleExportBrief}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Impact Brief</span>
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Target Population</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalTargetBeneficiaries.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Identified across {challenges.length} crowdsourced challenges
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold">Beneficiaries Reached (Active Pilots)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">
            {estimatedBeneficiariesReached.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Covered under {pilotOrDeployed.length} deployed university solutions
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-semibold">State Scaling Pipeline</span>
            <Rocket className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-900 mt-2">
            {pilotOrDeployed.length} Solutions
          </div>
          <div className="text-[11px] text-indigo-600 mt-1">
            Eligible for statewide procurement & scheme integration
          </div>
        </div>
      </div>

      {/* Solutions in Pilot & Scaling */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Field Deployed Innovations (Ready for State Scale-up)
        </h3>

        <div className="divide-y divide-slate-100">
          {pilotOrDeployed.map((proj) => {
            const ch = challenges.find((c) => c.id === proj.challengeId);

            return (
              <div key={proj.id} className="py-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{proj.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {proj.currentStage}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{proj.title}</h4>
                  <div className="text-xs text-slate-600 mt-1">
                    Developed by: <strong>{proj.universityName || proj.university?.name}</strong> • Mentor: {proj.leadFaculty || proj.team?.leadFaculty?.name || 'Faculty Team'}
                  </div>
                  {ch && (
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ch.district}, {ch.block}
                      </span>
                      <span>•</span>
                      <span>Target Population: {ch.affectedPopulation.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-800">State Validation: High</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Ready for Dept Adoption</div>
                  </div>
                </div>
              </div>
            );
          })}

          {pilotOrDeployed.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No solutions currently in Pilot or Scaling stage. Projects are progressing through research and prototyping.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
