import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import { authService } from '../../services/authService';
import {
  X,
  UserCheck,
  Building2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, switchRole, currentUser, setCurrentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'demo-login' | 'register'>('demo-login');

  // Register Form State
  const [regRole, setRegRole] = useState<UserRole>('citizen');
  const [regName, setRegName] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regDistrict, setRegDistrict] = useState(JHARKHAND_DISTRICTS[0]);
  const [regEmail, setRegEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const allUsers = authService.getAllUsers();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      showToast('warning', 'Incomplete Form', 'Please enter your name and email.');
      return;
    }

    if (regRole === 'citizen') {
      const res = await authService.registerCitizen({
        fullName: regName,
        email: regEmail,
        phone: '9835000000',
        district: regDistrict,
      });
      if (res.user) {
        setCurrentUser(res.user as any);
        switchRole(res.user.role);
      }
    } else {
      switchRole(regRole);
    }

    showToast('success', 'Registration Submitted', `Stakeholder session activated for ${regName} (${regRole.replace('_', ' ').toUpperCase()}).`);
    setIsAuthModalOpen(false);
  };

  const handleSelectDemoUser = (role: UserRole) => {
    const matched = allUsers.find((u) => u.role === role) || allUsers[0];
    const switched = authService.switchUser(matched.id);
    if (switched) {
      setCurrentUser(switched as any);
    }
    switchRole(role);
    showToast('success', `Logged In as ${matched.name}`, `Active session established for ${matched.role.replace('_', ' ').toUpperCase()}`);
    setIsAuthModalOpen(false);
  };

  const roleCategories = [
    {
      title: 'Community & Grassroots',
      roles: ['citizen', 'pri_ulb', 'community_org'] as UserRole[],
      icon: Users,
      color: 'border-emerald-200 bg-emerald-50/50',
    },
    {
      title: 'Higher Education Institutions (HEIs)',
      roles: ['university_admin', 'faculty_mentor', 'student'] as UserRole[],
      icon: GraduationCap,
      color: 'border-blue-200 bg-blue-50/50',
    },
    {
      title: 'Industry & CSR Partners',
      roles: ['industry_msme', 'csr_org', 'research_institute'] as UserRole[],
      icon: Briefcase,
      color: 'border-purple-200 bg-purple-50/50',
    },
    {
      title: 'State Governance',
      roles: ['govt_department', 'platform_admin'] as UserRole[],
      icon: ShieldCheck,
      color: 'border-amber-200 bg-amber-50/50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#e2d6bc] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0d5c3a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 font-bold border border-white/20 text-sm">
              JH
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Stakeholder Access Portal</h3>
              <p className="text-xs text-emerald-100">JH Innovation Connect &bull; Role-Based Experience</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#e2d6bc] bg-[#fbf8ee] px-4 sm:px-6 pt-3">
          <button
            onClick={() => setActiveTab('demo-login')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'demo-login'
                ? 'border-[#0d5c3a] text-emerald-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Instant Role Login (For Judges & Demo)</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'border-[#0d5c3a] text-emerald-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Register New Stakeholder</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'demo-login' ? (
            <div className="space-y-5">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Fast Hackathon Evaluation:</strong> Click any of the 11 pre-configured stakeholder profiles below to immediately load their tailored dashboard view, permissions, and workflow capabilities.
                </div>
              </div>

              <div className="space-y-4">
                {roleCategories.map((cat) => (
                  <div key={cat.title} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <cat.icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cat.title}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {cat.roles.map((r) => {
                        const matchedUser = allUsers.find((u) => u.role === r) || {
                          name: 'Representative',
                          organization: 'Jharkhand Ecosystem',
                          district: 'Ranchi',
                        };
                        const isCurrent = currentUser.role === r;

                        return (
                          <button
                            key={r}
                            onClick={() => handleSelectDemoUser(r)}
                            className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                              isCurrent
                                ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                                : 'border-[#e2d6bc] hover:border-emerald-300 hover:bg-[#fbf8ee]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold capitalize text-slate-900">
                                {r.replace('_', ' ')}
                              </span>
                              {isCurrent && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                              {matchedUser?.name || 'Representative'}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {matchedUser?.organization || matchedUser?.district}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Stakeholder Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 border border-[#e2d6bc] rounded-xl bg-[#fbf8ee] text-slate-900 focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="citizen">Citizen / Resident</option>
                  <option value="pri_ulb">Panchayati Raj Institution (PRI) / Urban Local Body</option>
                  <option value="community_org">Community Organization (NGO / SHG Federation)</option>
                  <option value="university_admin">University Administrator / Incubation Cell</option>
                  <option value="faculty_mentor">Faculty Mentor / Domain Professor</option>
                  <option value="student">Student Innovator / Research Scholar</option>
                  <option value="industry_msme">Industry / Startup / MSME</option>
                  <option value="csr_org">CSR Foundation / Philanthropic Trust</option>
                  <option value="research_institute">National Research Laboratory (CSIR/ICAR)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Representative Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Anil Kumar / Anita Soren"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#e2d6bc] bg-[#fbf8ee] text-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Institution Name</label>
                  <input
                    type="text"
                    placeholder="e.g. BIT Mesra / Gram Panchayat Torpa"
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#e2d6bc] bg-[#fbf8ee] text-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@organization.ac.in"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#e2d6bc] bg-[#fbf8ee] text-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Jharkhand District</label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#e2d6bc] rounded-xl bg-[#fbf8ee] text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#fbf8ee] border border-[#e2d6bc] rounded-xl text-[11px] text-slate-600">
                Institutional registrations are automatically vetted against Higher & Technical Education databases in Jharkhand.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-4 py-2 border border-[#e2d6bc] rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#fbf8ee] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Complete Registration & Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
