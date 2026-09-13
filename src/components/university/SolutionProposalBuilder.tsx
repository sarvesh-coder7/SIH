import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SolutionProposal } from '../../types';
import {
  FileText,
  Sparkles,
  DollarSign,
  Calendar,
  Layers,
  CheckCircle2,
  Building2,
  Briefcase,
  Upload,
  Plus,
  Trash2,
} from 'lucide-react';

interface SolutionProposalBuilderProps {
  challengeId: string;
  onProposalSubmitted: (proposal: Partial<SolutionProposal>) => void;
}

export const SolutionProposalBuilder: React.FC<SolutionProposalBuilderProps> = ({
  challengeId,
  onProposalSubmitted,
}) => {
  const { showToast, currentUser } = useApp();

  const [title, setTitle] = useState(
    'Solar-Powered Activated Alumina Adsorption Unit with IoT Fluoride Telemetry'
  );
  const [executiveSummary, setExecutiveSummary] = useState(
    'A modular, low-cost community defluoridation filtration unit engineered using local bauxite-derived activated alumina, paired with a solar-powered telemetry sensor transmitting water purity data to Jharkhand Jal Seva Cloud.'
  );
  const [techStack, setTechStack] = useState('Activated Alumina, Solar PV, LoRaWAN, STM32 Microcontroller, Mobile App');
  const [hardwareBudget, setHardwareBudget] = useState(180000);
  const [labBudget, setLabBudget] = useState(70000);
  const [fieldBudget, setFieldBudget] = useState(85000);
  const [contingencyBudget, setContingencyBudget] = useState(45000);

  const [csrRequested, setCsrRequested] = useState(true);
  const [targetIndustry, setTargetIndustry] = useState('Tata Steel CSR / Central Coalfields Ltd');

  const totalBudget = hardwareBudget + labBudget + fieldBudget + contingencyBudget;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !executiveSummary) {
      showToast('warning', 'Missing Content', 'Please provide title and summary.');
      return;
    }

    const proposalData: Partial<SolutionProposal> = {
      challengeId,
      universityId: 'univ-bit-mesra',
      universityName: 'Birla Institute of Technology, Mesra',
      title,
      executiveSummary,
      technologyStack: techStack.split(',').map((s) => s.trim()),
      totalBudgetINR: totalBudget,
      durationMonths: 6,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      csrFundingRequested: csrRequested,
    };

    onProposalSubmitted(proposalData);
    showToast('success', 'R&D Proposal Submitted', 'Proposal forwarded to State Higher Education PMU and Industry Partners.');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] uppercase tracking-wider border border-emerald-200">
              HEI Proposal Generator
            </span>
            <span className="text-xs text-slate-500">SIH 2026 Structured Form</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Formulate Solution & Funding Proposal
          </h3>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Submit Proposal for Review</span>
        </button>
      </div>

      {/* Title & Executive Summary */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1">
            Solution & Engineering Project Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1">
            Executive Summary & Novelty Statement <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={executiveSummary}
            onChange={(e) => setExecutiveSummary(e.target.value)}
            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 leading-relaxed"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1">
            Core Technology Stack & Materials (Comma Separated)
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Budget Breakdown & CSR Sponsorship */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            Itemized R&D & Pilot Budget (INR)
          </span>
          <span className="text-sm font-black text-emerald-800">
            Total: ₹{(totalBudget || 0).toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Hardware / BOM</label>
            <input
              type="number"
              value={hardwareBudget}
              onChange={(e) => setHardwareBudget(Number(e.target.value))}
              className="w-full text-xs font-bold text-slate-900 p-1.5 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Lab Testing & Calibration</label>
            <input
              type="number"
              value={labBudget}
              onChange={(e) => setLabBudget(Number(e.target.value))}
              className="w-full text-xs font-bold text-slate-900 p-1.5 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Village Pilot & Logistics</label>
            <input
              type="number"
              value={fieldBudget}
              onChange={(e) => setFieldBudget(Number(e.target.value))}
              className="w-full text-xs font-bold text-slate-900 p-1.5 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <label className="block text-[10px] font-bold text-slate-600 mb-1">Contingency / Reporting</label>
            <input
              type="number"
              value={contingencyBudget}
              onChange={(e) => setContingencyBudget(Number(e.target.value))}
              className="w-full text-xs font-bold text-slate-900 p-1.5 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        {/* CSR Matching Option */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={csrRequested}
              onChange={(e) => setCsrRequested(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-slate-300"
            />
            <span className="text-xs font-semibold text-slate-800">
              Request Industry CSR Matching Grants via Jharkhand CSR Portal
            </span>
          </label>

          {csrRequested && (
            <input
              type="text"
              placeholder="Preferred Industry / Mining Partner"
              value={targetIndustry}
              onChange={(e) => setTargetIndustry(e.target.value)}
              className="text-xs p-2 border border-slate-300 rounded-lg bg-white min-w-[220px]"
            />
          )}
        </div>
      </div>
    </form>
  );
};
