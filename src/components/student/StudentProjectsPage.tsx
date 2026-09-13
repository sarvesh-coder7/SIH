import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Rocket,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Users,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';

export const StudentProjectsPage: React.FC = () => {
  const { projects, setSelectedProjectId, setCurrentView } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
            Student Research Cohort
          </span>
          <span className="text-xs font-mono text-slate-500 font-bold">
            NEP 2020 Capstone Projects
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          My Active R&D Projects
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          Real-world problem solving projects assigned to your student research group. Track milestones, upload lab test reports, and collaborate with industry mentors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                    {project.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {project.stage || project.currentStage || 'Active Innovation'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {project.title || project.proposal?.title || 'State Innovation Project'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setCurrentView('project-workspace');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {project.description || project.summary || project.proposal?.executiveSummary || 'Multidisciplinary research project addressing regional challenges.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Community</span>
                <span className="font-bold text-slate-800 block">{project.district} District</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Faculty Guide</span>
                <span className="font-bold text-slate-800 block truncate">
                  {project.leadFaculty || project.team?.leadFaculty?.name || 'Faculty Guide'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Industry Partner</span>
                <span className="font-bold text-slate-800 block truncate">
                  {project.industryPartner || project.industryPartners?.[0]?.partnerName || 'Tata Steel CSR'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
