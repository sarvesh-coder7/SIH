import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryMemberRole, IndustryMember } from '../../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  Building2,
  BadgeAlert,
  Sparkles,
} from 'lucide-react';

export const IndustryMembersPage: React.FC = () => {
  const {
    industryMembers,
    currentIndustryMember,
    setCurrentIndustryMember,
    addIndustryMember,
    activeIndustry,
    showToast,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState<IndustryMemberRole>('technical_member');

  const canManageMembers = currentIndustryMember.permissions.canManageMembers;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addIndustryMember({
      industry_id: activeIndustry.id,
      name,
      email,
      phone,
      designation: designation || 'Specialist',
      member_role: role,
      role,
      status: 'Active',
      permissions: {
        canManageProfile: role === 'org_admin',
        canManageOrgProfile: role === 'org_admin',
        canManageMembers: role === 'org_admin',
        canManageCapabilities: role === 'org_admin',
        canExpressCollaboration: true,
        canManageCollaborations: role === 'org_admin',
        canViewAuthorizedReports: true,
        canSubmitTechnicalFeedback: role !== 'csr_member',
        canSubmitFeedback: role !== 'csr_member',
        canAddContributions: true,
        canManageCSR: role !== 'technical_member',
        canManageFunding: role !== 'technical_member',
      },
    });

    setName('');
    setEmail('');
    setPhone('');
    setDesignation('');
    setShowAddModal(false);
  };

  const getRoleBadge = (role: IndustryMemberRole) => {
    switch (role) {
      case 'org_admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Organization Administrator
          </span>
        );
      case 'technical_member':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Technical & Engineering Member
          </span>
        );
      case 'csr_member':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            CSR & Partnership Member
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organization Members & Role Permissions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage institutional access for {activeIndustry.organization_name} across engineering and CSR leads.
          </p>
        </div>

        {canManageMembers && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Organization Member
          </button>
        )}
      </div>

      {/* Quick Role Switcher Banner for Demo & Review */}
      <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700">
            Currently acting as: <strong>{currentIndustryMember?.name || 'Partner'}</strong> ({currentIndustryMember?.designation || 'Lead'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Switch Role:</span>
          <select
            value={currentIndustryMember?.id || ''}
            onChange={(e) => {
              const selected = industryMembers.find((m) => m.id === e.target.value);
              if (selected) {
                setCurrentIndustryMember(selected);
                showToast('info', 'Active Member Switched', `Now acting as ${selected.name} (${selected.role || selected.member_role})`);
              }
            }}
            className="text-xs font-bold py-1.5 px-3 rounded-lg border border-emerald-300 bg-white text-emerald-900 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {industryMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.designation} ({m.role || m.member_role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industryMembers.map((member) => {
          const isCurrent = member.id === currentIndustryMember.id;

          return (
            <div
              key={member.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition ${
                isCurrent ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {getRoleBadge(member.role || member.member_role || 'technical_member')}
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                      Active
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{member.designation}</div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Permissions matrix snippet */}
                <div className="pt-2 text-[11px] space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1">Key Authorized Actions:</span>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>View Authorized Project Reports</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    {member.permissions.canExpressCollaboration ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                    <span>Express Collaboration Interest</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    {member.permissions.canManageFunding ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                    <span>Manage CSR & Grants</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    {member.permissions.canSubmitFeedback ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                    <span>Submit Technical Feedback</span>
                  </div>
                </div>
              </div>

              {!isCurrent && (
                <button
                  onClick={() => {
                    setCurrentIndustryMember(member);
                    showToast('info', 'Switched Active Account', `Acting as ${member.name}`);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 transition text-center"
                >
                  Act As This Member
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900">Invite New Organization Member</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Dr. Priya Sharma"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Lead Materials Engineer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="technical_member">Technical / Engineering Member</option>
                  <option value="csr_member">CSR & Partnership Member</option>
                  <option value="org_admin">Organization Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Send Access Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
