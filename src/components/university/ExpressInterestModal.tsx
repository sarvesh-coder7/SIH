import React, { useState } from 'react';
import { Challenge } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  AlertTriangle,
  Lightbulb,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface ExpressInterestModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
}

export const ExpressInterestModal: React.FC<ExpressInterestModalProps> = ({
  challenge,
  isOpen,
  onClose,
}) => {
  const { currentUser, submitExpressionOfInterest } = useApp();

  const [initialApproach, setInitialApproach] = useState(
    'We propose a localized gravity adsorption column utilizing indigenous activated fly-ash / alumina media with an automated vortex pre-settling chamber to bypass monsoon turbidity silt clogging.'
  );
  const [facultyLead, setFacultyLead] = useState(currentUser.name || 'Dr. Meenakshi Soren');
  const [department, setDepartment] = useState('Chemical & Environmental Engineering');
  const [targetTimeline, setTargetTimeline] = useState('10 Weeks (Lab Validation to Village Pilot)');
  const [resourcesNeeded, setResourcesNeeded] = useState('Material Spectrometer, High-volume Centrifuge, Solar Inverter kit');
  const [studentCohortSize, setStudentCohortSize] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitExpressionOfInterest(challenge.id, {
        initialApproach,
        facultyLead,
        department,
        targetTimeline,
        resourcesNeeded,
        studentCohortSize,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider">
                Step 2: Express Interest
              </span>
              <span className="text-xs font-mono text-slate-500 font-bold">{challenge.id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Submit University Initial Approach
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Challenge: &ldquo;{challenge.title}&rdquo; ({challenge.district}, Jharkhand)
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Conceptual Disclaimer Badge */}
        <div className="mx-5 mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <span className="font-bold block">
              Important Distinction: You are submitting an Initial Approach (&ldquo;Under Review&rdquo;)
            </span>
            <p className="text-amber-800 leading-relaxed">
              Expressing interest alerts the Government State PMU that your university believes it can solve this problem.
              <strong> Your university does NOT own this challenge yet.</strong> The State PMU will review your initial approach and grant the <strong>Official Assignment (Official Attempt #1)</strong> to unlock the Project Workspace.
            </p>
          </div>
        </div>

        {/* Workflow Visualizer Strip */}
        <div className="mx-5 my-3 py-2 px-3 bg-slate-100/80 rounded-xl border border-slate-200 text-[11px] flex items-center justify-between text-slate-600 font-medium">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">1</span>
            <span>Discover</span>
          </div>
          <span className="text-slate-400">&rarr;</span>
          <div className="flex items-center gap-1.5 text-blue-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
            <span>Express Interest (Now)</span>
          </div>
          <span className="text-slate-400">&rarr;</span>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">3</span>
            <span>Under Review</span>
          </div>
          <span className="text-slate-400">&rarr;</span>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">4</span>
            <span>Official Assignment</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* University Name & Lead */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Applying University
              </label>
              <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-800 font-medium">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span className="truncate">{currentUser.organization || 'Birla Institute of Technology (BIT) Mesra'}</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Faculty Lead / Principal Investigator
              </label>
              <input
                type="text"
                required
                value={facultyLead}
                onChange={(e) => setFacultyLead(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium"
                placeholder="Dr. Name, Dept"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Department / Research Centre
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                placeholder="e.g. Chemical Engineering"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Student Cohort Size
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={studentCohortSize}
                  onChange={(e) => setStudentCohortSize(Number(e.target.value))}
                  className="w-full p-2.5 bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Initial Approach */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">
                Initial Approach & Proposed Technical Methodology
              </label>
              <span className="text-[10px] text-slate-500">
                State how you will tackle the core bottlenecks
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={initialApproach}
              onChange={(e) => setInitialApproach(e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 leading-relaxed font-sans"
              placeholder="Outline your technical approach, hypothesis, and how you will address lessons from any prior attempts..."
            />
          </div>

          {/* Timeline & Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Target Timeline to Village Pilot
              </label>
              <input
                type="text"
                value={targetTimeline}
                onChange={(e) => setTargetTimeline(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                placeholder="e.g. 10 Weeks"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Equipment / Co-funding Needed
              </label>
              <input
                type="text"
                value={resourcesNeeded}
                onChange={(e) => setResourcesNeeded(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                placeholder="e.g. Lab instruments, CSR partner"
              />
            </div>
          </div>

          {/* Submit Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Initial Approach & Enter Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
