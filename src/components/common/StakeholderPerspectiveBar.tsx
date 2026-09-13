import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, ShieldCheck, GraduationCap, Briefcase, Layers, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

interface StakeholderPerspectiveBarProps {
  challengeId: string;
  category?: string;
  status?: string;
  assignedUniversity?: string;
}

export const StakeholderPerspectiveBar: React.FC<StakeholderPerspectiveBarProps> = ({
  challengeId,
  category = 'Grassroots Challenge',
  status = 'Submitted',
  assignedUniversity = 'BIT Mesra / IIT ISM',
}) => {
  const { switchRole, setCurrentView } = useApp();
  const [activePerspective, setActivePerspective] = useState<UserRole>('citizen');

  const perspectives = [
    {
      role: 'citizen' as UserRole,
      label: 'Citizen & PRI View',
      icon: Users,
      color: 'border-emerald-500 text-emerald-800 bg-emerald-50/70',
      badge: 'Submitter & Beneficiary',
      summary:
        'Tracks the live progress of their reported problem, views which university lab is assigned, and provides user feedback during village pilot testing.',
      actionLabel: 'Switch to Citizen View',
      targetView: 'citizen-dashboard',
    },
    {
      role: 'govt_department' as UserRole,
      label: 'State Authority View',
      icon: ShieldCheck,
      color: 'border-amber-500 text-amber-900 bg-amber-50/70',
      badge: 'Nodal Validation & Routing',
      summary:
        'Screens field credibility, determines whether to route to Direct Municipal Service or University R&D, and tracks district-level KPIs.',
      actionLabel: 'Switch to State View',
      targetView: 'government-dashboard',
    },
    {
      role: 'university_admin' as UserRole,
      label: 'University & Faculty View',
      icon: GraduationCap,
      color: 'border-indigo-500 text-indigo-900 bg-indigo-50/70',
      badge: 'R&D Labs & Student Cohorts',
      summary:
        'Forms multidisciplinary engineering & science teams (TRL 1-5), builds working prototypes, and writes research grant proposals.',
      actionLabel: 'Switch to HEI View',
      targetView: 'university-dashboard',
    },
    {
      role: 'industry_msme' as UserRole,
      label: 'Industry & CSR View',
      icon: Briefcase,
      color: 'border-purple-500 text-purple-900 bg-purple-50/70',
      badge: 'CSR Section 135 & Testbeds',
      summary:
        'Pledges matching CSR co-funding, provides manufacturing testing facilities, and supports commercial pilot scaling in Jharkhand.',
      actionLabel: 'Switch to Industry View',
      targetView: 'industry-dashboard',
    },
  ];

  const current = perspectives.find((p) => p.role === activePerspective) || perspectives[0];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              One Challenge &bull; Connected Stakeholder Perspectives
            </h4>
            <p className="text-[11px] text-slate-500">
              Each participant views the same core challenge through their dedicated workspace.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 self-start sm:self-auto">
          ID: {challengeId}
        </span>
      </div>

      {/* Perspective Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {perspectives.map((p) => {
          const isActive = activePerspective === p.role;
          return (
            <button
              key={p.role}
              onClick={() => setActivePerspective(p.role)}
              className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2 ${
                isActive
                  ? `${p.color} font-bold shadow-xs ring-1 ring-slate-400/30`
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <p.icon className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] block truncate font-bold">{p.label}</span>
                <span className="text-[9px] text-slate-500 block truncate">{p.badge}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Perspective Detail Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{current.label}:</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">
              {current.badge}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">{current.summary}</p>
        </div>

        <button
          onClick={() => {
            switchRole(current.role);
            setCurrentView(current.targetView as any);
          }}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-2xs transition-all"
        >
          <span>{current.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
