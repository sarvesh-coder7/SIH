import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Sparkles,
  GraduationCap,
  Briefcase,
  Layers,
  ShieldCheck,
  Award,
  ArrowRight,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentView, setIsDemoTourActive, goToDemoStep } = useApp();

  const workflowSteps = [
    {
      step: '01',
      title: 'Citizen & Community Crowdsourcing',
      actor: 'Citizens, PRIs (Mukhiyas), NGOs',
      desc: 'Local communities identify grassroots obstacles in water, healthcare, agriculture, and rural electrification. Submissions include GPS coordinates, affected population counts, and photo/video evidence.',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      step: '02',
      title: 'Automated AI Triage & Prioritization',
      actor: 'NLP & Semantic AI Pipeline',
      desc: 'The platform categorizes incoming problems, calculates a 100-point Societal Urgency Index, filters duplicates across adjacent blocks, and recommends optimal academic disciplines.',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      step: '03',
      title: 'University Allocation & Faculty Matching',
      actor: 'State PMU & University Incubators',
      desc: 'Problems are routed to top Jharkhand Higher Education Institutions (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, BAU) based on faculty lab capacity and departmental expertise.',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      step: '04',
      title: 'Multidisciplinary Student Solution Cohorts',
      actor: 'Student Researchers & Faculty Mentors',
      desc: 'Multidisciplinary student teams (combining CS, Electronics, Chemical, Biotech, and Management) formulate rigorous engineering proposals and build working prototypes (TRL 1-5).',
      icon: Layers,
      color: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      step: '05',
      title: 'Industry & CSR Co-Funding',
      actor: 'Tata Steel, CCL, MSMEs, CSR Foundations',
      desc: 'Corporate sponsors commit Section 135 CSR capital, assign industry co-mentors, and provide high-precision manufacturing facilities and lab testbeds.',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      step: '06',
      title: 'Field Pilot & Gram Sabha Verification',
      actor: 'Village Community & SHG Federations',
      desc: 'Prototypes are deployed directly in the requesting village. Gram Sabhas, Jal Sahiyas, and local farmers evaluate real-world performance, usability, and durability (TRL 6-8).',
      icon: Award,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      step: '07',
      title: 'State Policy Feedback & Scale Rollout',
      actor: 'Govt of Jharkhand & Line Departments',
      desc: 'Successful innovations are scaled district-wide through government schemes and integrated into state higher education curriculum and rural development policies.',
      icon: ShieldCheck,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
          End-to-End Problem Solving Architecture
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          How Jharkhand Innovation Connect Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between grassroots societal challenges and institutional engineering capabilities through a structured 7-stage collaborative pipeline.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              setIsDemoTourActive(true);
              goToDemoStep(1);
            }}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Launch Live Step-by-Step Prototype Tour</span>
          </button>
        </div>
      </div>

      {/* Steps Vertical Timeline */}
      <div className="space-y-4">
        {workflowSteps.map((step) => (
          <div
            key={step.step}
            className={`p-6 rounded-2xl border ${step.color} bg-white shadow-xs flex flex-col sm:flex-row items-start gap-5 transition-all hover:shadow-md`}
          >
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-2xl font-black text-slate-400 font-mono">{step.step}</span>
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center font-bold">
                <step.icon className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-1.5 flex-1 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Actor: {step.actor}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
