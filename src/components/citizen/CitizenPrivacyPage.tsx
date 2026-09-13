import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  Server,
} from 'lucide-react';

export const CitizenPrivacyPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans-body">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <button
            onClick={() => setCurrentView('citizen-dashboard')}
            className="hover:text-amber-700 cursor-pointer"
          >
            Dashboard
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-medium">Privacy & Security</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>Citizen Privacy & Data Protection Policy</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          How your community reports, personal information, and location data are safeguarded.
        </p>
      </div>

      {/* Comparison Grid: Public vs Private */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What is Public */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Eye className="w-5 h-5 text-amber-600" />
            <span>Information Visible to the Public</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Problem Description:</strong> Title, category, and explanation of the issue.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>General Location:</strong> District, Block, and Village/Panchayat name.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Evidence Photos:</strong> Photos of infrastructure or site issues.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Solution Progress:</strong> University partner name, milestones, and final resolution.</span>
            </li>
          </ul>
        </div>

        {/* What is Kept Confidential */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <EyeOff className="w-5 h-5 text-emerald-600" />
            <span>Confidential & Protected Information</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Mobile Number:</strong> Used solely for official SMS milestone updates.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Email Address:</strong> Never displayed or sold to third parties.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Personal Device Data:</strong> IP address, device fingerprints, and exact browser specs are discarded.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Residential Address:</strong> Your personal home address is never collected or disclosed.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Security Principles */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          State Governance & Compliance
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The Jharkhand Innovation Challenge portal operates under the Digital Personal Data Protection (DPDP) Act. Citizen data is encrypted in transit and stored in state data centers with role-based access control. Only authorized district verification officers can review contact numbers for verification callbacks.
        </p>
      </div>
    </div>
  );
};
