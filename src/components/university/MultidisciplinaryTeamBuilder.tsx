import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeamMember } from '../../types';
import {
  Users,
  UserPlus,
  Trash2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface MultidisciplinaryTeamBuilderProps {
  challengeId: string;
  onTeamCreated: (teamName: string, members: TeamMember[]) => void;
}

export const MultidisciplinaryTeamBuilder: React.FC<MultidisciplinaryTeamBuilderProps> = ({
  challengeId,
  onTeamCreated,
}) => {
  const { showToast, currentUser } = useApp();

  const [teamName, setTeamName] = useState('AquaJharkhand Innovation Cohort');
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'm-1',
      name: 'Aakash Verma',
      role: 'Student Team Lead (IoT & Firmware)',
      department: 'Computer Science & Engg',
      institution: 'BIT Mesra',
      email: 'aakash.v@bitmesra.ac.in',
      skills: ['Embedded C', 'LoRaWAN', 'Cloud Dashboards'],
      isLead: true,
    },
    {
      id: 'm-2',
      name: 'Pooja Hansda',
      role: 'Biotech & Chemical Researcher',
      department: 'Chemical Engineering',
      institution: 'BIT Mesra',
      email: 'pooja.h@bitmesra.ac.in',
      skills: ['Water Filtration', 'Nano-adsorbents', 'Spectrometry'],
    },
    {
      id: 'm-3',
      name: 'Dr. Ramesh Kumar Sinha',
      role: 'Faculty Mentor & PI',
      department: 'Chemical & Environmental Engg',
      institution: 'BIT Mesra',
      email: 'rksinha@bitmesra.ac.in',
      skills: ['Community Testbeds', 'Fluid Dynamics', 'Grant Management'],
    },
    {
      id: 'm-4',
      name: 'Vikramaditya Sahay',
      role: 'Industry Technical Co-Mentor',
      department: 'Tata Steel CSR & Sustainability Cell',
      institution: 'Tata Steel Ltd',
      email: 'vikram.sahay@tatasteel.com',
      skills: ['Solar Integration', 'MSME Scale-up', 'Supply Chain'],
    },
  ]);

  // Form for adding a new member
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Student Researcher');
  const [newDept, setNewDept] = useState('Civil & Environmental Engg');
  const [newInst, setNewInst] = useState('BIT Mesra');
  const [newSkills, setNewSkills] = useState('GIS, Water Hydrology');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      showToast('warning', 'Name Required', 'Please enter candidate member name.');
      return;
    }

    const newM: TeamMember = {
      id: `m-${Date.now()}`,
      name: newName,
      role: newRole,
      department: newDept,
      institution: newInst,
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@${newInst.toLowerCase().replace(/\s+/g, '')}.edu`,
      skills: newSkills.split(',').map((s) => s.trim()),
    };

    setMembers((prev) => [...prev, newM]);
    setNewName('');
    setNewSkills('');
    showToast('success', 'Member Added', `${newM.name} added to multidisciplinary roster.`);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveTeam = () => {
    if (members.length < 2) {
      showToast('warning', 'Multidisciplinary Requirement', 'Team must have at least 2 members across disciplines.');
      return;
    }
    onTeamCreated(teamName, members);
    showToast('success', 'Team Assembled', `Formed ${teamName} with ${members.length} cross-functional researchers.`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-wider border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Multidisciplinary Team Assembly
            </span>
            <span className="text-xs text-slate-500">SIH 2026 Mandate</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Build Cross-Functional Solution Team
          </h3>
        </div>

        <button
          onClick={handleSaveTeam}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save & Lock Team Cohort</span>
        </button>
      </div>

      {/* Team Name Input */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-1">Project Cohort Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full text-xs font-bold text-slate-900 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Current Team Members Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Current Multidisciplinary Roster ({members.length} Members)
          </span>
          <span className="text-[10px] text-slate-500">Cross-departmental pairing enabled</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map((m) => (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                m.isLead
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/40'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">{m.name}</span>
                    {m.isLead && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-black text-[9px] uppercase">
                        Lead
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">{m.role}</div>
                  <div className="text-[10px] text-slate-400">
                    {m.department} &bull; {m.institution}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveMember(m.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-200/60">
                {m.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-1.5 py-0.5 rounded bg-white text-slate-700 text-[9px] border border-slate-200 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Sub-Form */}
      <form onSubmit={handleAddMember} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <UserPlus className="w-4 h-4 text-emerald-700" />
          Add Student Researcher or External Mentor
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Mahato"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Discipline / Department</label>
            <input
              type="text"
              placeholder="e.g. Mechanical / AI & Data Science"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Key Technical Skills</label>
            <input
              type="text"
              placeholder="Comma-separated: CAD, Solar, React"
              value={newSkills}
              onChange={(e) => setNewSkills(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add to Roster</span>
          </button>
        </div>
      </form>
    </div>
  );
};
