import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Award,
  FlaskConical,
  FileCode,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, setCurrentView, setSelectedProjectId } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-6 opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[11px] font-bold border border-blue-400/30">
              Student Researcher Portal
            </span>
            <span className="text-xs text-blue-200">
              NEP 2020 Capstone Project Track &bull; Semester 8
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">
            Welcome back, {currentUser.name || 'Rohan Kumar Verma'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            You are enrolled in the <strong>Jharkhand Rural Innovation Capstone Fellowship</strong> at {currentUser.organization || 'Birla Institute of Technology (BIT) Mesra'}. Your team is currently tackling <strong>JH-2026-0042</strong> (Groundwater Fluoride Remediation in Village X).
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedProjectId('PROJ-JH-2026-0081');
                setCurrentView('project-workspace');
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Project Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('student-experiments')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Log New Experiment
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NEP ABC Credits</span>
          <div className="text-2xl font-black text-blue-700">12 / 12</div>
          <p className="text-[11px] text-slate-500">Academic Bank of Credits verified</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lab Experiments</span>
          <div className="text-2xl font-black text-indigo-700">18 Runs</div>
          <p className="text-[11px] text-slate-500">Adsorption spectrometry logs</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Code & CAD Commits</span>
          <div className="text-2xl font-black text-emerald-700">34 Pushes</div>
          <p className="text-[11px] text-slate-500">Firmware + Filter 3D designs</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patent Co-authorship</span>
          <div className="text-2xl font-black text-amber-700">1 Published</div>
          <p className="text-[11px] text-slate-500">#202631008472 with CSIR-NML</p>
        </div>
      </div>

      {/* Active Project Highlight */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              PROJ-JH-2026-0081 &bull; JH-2026-0042
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Hybrid Activated Alumina Column with IoT Fluoride Telemetry
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedProjectId('PROJ-JH-2026-0081');
              setCurrentView('project-workspace');
            }}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Workspace</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Overall Capstone Milestone Completion</span>
            <span>Stage 4 of 5 (85%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[85%]"></div>
          </div>
        </div>

        {/* Upcoming Tasks for Student */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Your Assigned Tasks & Experiments:
          </span>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800">Calibrate ESP32 IoT Sensor for Fluoride Ion Selective Electrode</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Done</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-slate-800">Field Water Sampling at Village X Handpump #3 (Torpa Block)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">In Progress</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-600">Draft Capstone Thesis Chapter 4: Lessons from Attempt 1 & 2 Failures</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">Upcoming</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mentors Feedback */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Faculty & Industry Mentor Feedback</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900">Dr. Meenakshi Soren</span>
              <span className="text-[10px] text-blue-600">Faculty Guide, BIT Mesra</span>
            </div>
            <p className="text-slate-700 italic">
              &ldquo;Excellent synthesis of Attempt 1 silt failure. The pre-cyclone chamber you 3D-modeled successfully prevented media clogging in our lab tests.&rdquo;
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">Dr. Subhashish Mukherjee</span>
              <span className="text-[10px] text-amber-700">Industry Mentor, Tata Steel</span>
            </div>
            <p className="text-slate-700 italic">
              &ldquo;The unit economics check out. ₹38,500 bill of materials is well within rural Gram Panchayat budget limits. Keep pushing on the field durability testing.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
