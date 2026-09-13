import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectIndustryCollaboration } from '../../types';
import {
  Handshake,
  CheckCircle2,
  Building2,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Layers,
  Calendar,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const IndustryActiveCollaborations: React.FC = () => {
  const {
    collaborations,
    setSelectedCollaborationId,
    setSelectedProjectId,
    setCurrentView,
    activeIndustry,
  } = useApp();

  const activeCollabs = collaborations.filter(
    (c) => c.status === 'Active' || c.status === 'Accepted'
  );

  const handleOpenWorkspace = (collab: ProjectIndustryCollaboration) => {
    setSelectedCollaborationId(collab.id);
    setSelectedProjectId(collab.project_id);
    setCurrentView('industry-collaboration-workspace');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Active Industry Collaborations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Projects currently co-developed between {activeIndustry.organization_name} and state academic institutions.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('industry-discovery')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition"
        >
          <Handshake className="w-4 h-4" />
          Propose New Collaboration
        </button>
      </div>

      {activeCollabs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Handshake className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Active Collaborations Yet</h3>
          <p className="text-xs text-slate-500">
            Submit an expression of interest on university projects. Once accepted by the university research cell, active workspaces appear here.
          </p>
          <button
            onClick={() => setCurrentView('industry-discovery')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
          >
            Explore Projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeCollabs.map((collab) => (
            <div
              key={collab.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-6">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Active Partnership
                      </span>
                      <span className="text-xs text-slate-400">
                        Initiated {new Date(collab.started_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {collab.project_title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Academic Institution: <strong>{collab.university_name}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenWorkspace(collab)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition self-start sm:self-center"
                  >
                    Open Co-Dev Workspace
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar & Support Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Joint Execution Progress</span>
                      <span className="font-extrabold text-emerald-700">{collab.progress_percent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${collab.progress_percent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Contributions logged: <strong>{collab.contributions?.length || 0} items</strong>
                      {collab.technical_updates?.length ? ` • Verified updates: ${collab.technical_updates.length}` : ''}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Partner Support Pillars:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {collab.collaboration_types.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Latest updates snapshot */}
                {collab.technical_updates && collab.technical_updates.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Latest Verified Technical Milestone:
                    </div>
                    <div className="text-slate-800 font-medium">
                      {collab.technical_updates[0].title}
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {collab.technical_updates[0].details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
