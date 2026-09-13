import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectLifecycle } from '../../types';
import { IndustryExpressInterestModal } from './IndustryExpressInterestModal';
import {
  DollarSign,
  HeartHandshake,
  Building2,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Handshake,
  Award,
} from 'lucide-react';

export const IndustryFundingCSRPage: React.FC = () => {
  const {
    projects,
    activeIndustry,
    currentIndustryMember,
    setSelectedProjectId,
    setCurrentView,
    expressCollaborationInterest,
    showToast,
  } = useApp();

  const [selectedProjectForGrant, setSelectedProjectForGrant] = useState<ProjectLifecycle | null>(null);
  const [grantPledgeAmount, setGrantPledgeAmount] = useState<number>(250000);
  const [csrThematicFocus, setCsrThematicFocus] = useState('Rural Drinking Water & Tribal Health');
  const [isPledging, setIsPledging] = useState(false);

  // Filter projects that accept corporate sponsorship or need funding
  const fundingEligibleProjects = projects.filter(
    (p) => p.budget?.allowCorporateSponsorship || p.currentStage === 'Prototype' || p.currentStage === 'Testing' || p.currentStage === 'Pilot'
  );

  const handleCommitGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForGrant) return;

    setIsPledging(true);
    setTimeout(() => {
      expressCollaborationInterest({
        projectId: selectedProjectForGrant.id,
        collaborationTypes: ['Funding', 'CSR'],
        proposedContribution: `Statutory CSR Grant of ₹${grantPledgeAmount.toLocaleString()} committed under thematic area: ${csrThematicFocus}. Covers 10 village pilot deployment units and field sensor kits.`,
        expectedSupport: 'Quarterly CSR utilization certificates, Village Sahiya impact survey telemetry, and State Higher Education Dept CSR co-signoff.',
        contactPerson: currentIndustryMember?.name || 'Partner Representative',
        contactEmail: currentIndustryMember?.email || 'partner@example.com',
        additionalInfo: `Eligible under Section 135 Companies Act Schedule VII (Clean Drinking Water and Rural Development).`,
      });

      setIsPledging(false);
      setSelectedProjectForGrant(null);
      showToast(
        'success',
        'CSR Grant Pledged',
        `₹${grantPledgeAmount.toLocaleString()} CSR allocation initiated for ${selectedProjectForGrant.title}.`
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Statutory CSR & Corporate Grant Matching
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Corporate Social Responsibility & Research Grants
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Deploy Schedule VII Corporate Social Responsibility funds directly into verified, district-focused academic solutions. Receive automated state utilization certificates and verified citizen beneficiary audits.
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-emerald-200">
            <span>• Section 135 Companies Act Compliant</span>
            <span>• Direct University Research Cell Disbursal</span>
            <span>• Citizen Beneficiary Telemetry Audits</span>
          </div>
        </div>
      </div>

      {/* CSR Alignment Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1">
          <span className="text-slate-500 font-semibold block">Organization CSR Profile</span>
          <div className="text-sm font-bold text-slate-900">{activeIndustry.organization_name}</div>
          <div className="text-slate-600">Priority Thematic Focus: Rural Water & Clean Air</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1">
          <span className="text-slate-500 font-semibold block">CSR Priority Districts</span>
          <div className="text-sm font-bold text-emerald-800">
            {activeIndustry.district || 'East Singhbhum (Jamshedpur)'}, Khunti, Dhanbad
          </div>
          <div className="text-slate-500">Aspirational District Matching: Yes</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1">
          <span className="text-slate-500 font-semibold block">Eligible Research Projects</span>
          <div className="text-sm font-bold text-slate-900">{fundingEligibleProjects.length} Projects Seeking Grants</div>
          <div className="text-emerald-600 font-medium">All verified by State R&D Council</div>
        </div>
      </div>

      {/* Eligible Projects Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Projects Seeking Co-Funding & CSR Deployment Grants
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fundingEligibleProjects.map((project) => {
            const seedSanctioned = project.budget?.approvedBudget || 350000;
            const requiredGrant = project.budget?.estimatedTotal || 600000;
            const fundingGap = requiredGrant - seedSanctioned;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Grant Eligible
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.district || 'Khunti'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{project.title || project.proposal?.title || project.challengeTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      {project.universityName || project.university?.name || 'Partner University'}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.summary || project.proposal?.executiveSummary || project.proposal?.proposedSolution || ''}
                  </p>

                  {/* Financial Breakdown */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">State Seed</span>
                      <span className="font-bold text-slate-700">₹{seedSanctioned.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Pilot Scale Gap</span>
                      <span className="font-bold text-amber-700">₹{fundingGap.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Target Units</span>
                      <span className="font-bold text-emerald-700">10 Villages</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setCurrentView('industry-project-detail');
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-emerald-700"
                  >
                    View Project Dossier →
                  </button>

                  <button
                    onClick={() => setSelectedProjectForGrant(project)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    Pledge CSR Grant
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grant Pledge Modal */}
      {selectedProjectForGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900">Pledge Statutory CSR Grant</h4>
              <button
                onClick={() => setSelectedProjectForGrant(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div><strong>Project:</strong> {selectedProjectForGrant.title || selectedProjectForGrant.proposal?.title || selectedProjectForGrant.challengeTitle}</div>
              <div><strong>University:</strong> {selectedProjectForGrant.universityName || selectedProjectForGrant.university?.name || 'Partner University'}</div>
              <div><strong>Target District:</strong> {selectedProjectForGrant.district || 'Khunti'}</div>
            </div>

            <form onSubmit={handleCommitGrant} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  CSR Grant Allocation (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  min={25000}
                  step={25000}
                  value={grantPledgeAmount}
                  onChange={(e) => setGrantPledgeAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">Recommended pilot milestone allocation: ₹2,50,000</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Schedule VII Thematic Focus Area
                </label>
                <select
                  value={csrThematicFocus}
                  onChange={(e) => setCsrThematicFocus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Rural Drinking Water & Tribal Health">Rural Drinking Water & Sanitation (Item i)</option>
                  <option value="Environmental Sustainability & Clean Air">Environmental Sustainability & Ecological Balance (Item iv)</option>
                  <option value="Promoting Education & STEM Research">Promoting Education & Technical University Labs (Item ii)</option>
                  <option value="Rural Infrastructure & Livelihood Development">Rural Livelihood & Tribal Community Development (Item x)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 leading-snug">
                Pledging a CSR grant sends an official tripartite Memorandum of Understanding (MoU) template to the University Dean of R&D and State Project Management Unit (PMU).
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProjectForGrant(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPledging}
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  {isPledging ? 'Recording Commitment...' : 'Confirm CSR Grant Pledge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
