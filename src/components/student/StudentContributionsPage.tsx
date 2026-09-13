import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCode,
  Award,
  GitCommit,
  Layers,
  CheckCircle2,
  Calendar,
  Download,
  Share2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const StudentContributionsPage: React.FC = () => {
  const { currentUser } = useApp();

  const contributions = [
    {
      id: 'CONTRIB-01',
      title: 'Vortex Pre-separator 3D CAD Geometry & Flow Simulation',
      category: 'Mechanical / CAD Design',
      date: '2026-02-12',
      impact: 'Eliminated silt clogging that doomed Attempt 1 bio-sand filter.',
      status: 'Merged & 3D Printed',
      creditPoints: 4,
    },
    {
      id: 'CONTRIB-02',
      title: 'ESP32 MQTT Low-Power Telemetry Firmware (C++)',
      category: 'Embedded Software & IoT',
      date: '2026-02-08',
      impact: 'Broadcasts daily fluoride and turbidity readings directly to District PHED Dashboard.',
      status: 'Live on Village Prototype',
      creditPoints: 5,
    },
    {
      id: 'CONTRIB-03',
      title: 'Village X Handpump Household Survey & Water Sample Logs',
      category: 'Field Research & Community Truth',
      date: '2026-01-28',
      impact: 'Mapped 14 contaminated handpumps across Dormo Tola with GPS coordinates.',
      status: 'Verified by Gram Sabha',
      creditPoints: 3,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            Academic Portfolio & Credit Bank
          </span>
          <span className="text-xs font-mono text-slate-500 font-bold">
            Student ID: BT/22/EE/041
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          My Research Contributions & IP Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          Verifiable record of your technical contributions, engineering commits, field validations, and co-authorship for university graduation credits and placements.
        </p>
      </div>

      {/* Credit Summary Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
            NEP 2020 Credit Accrual
          </span>
          <h2 className="text-xl font-bold">12 Total Capstone Credits Earned</h2>
          <p className="text-xs text-emerald-100">
            Certified by Dr. Meenakshi Soren & JSHEC State Evaluation Board.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Generating verified NEP 2020 Digital Transcript PDF...')}
          className="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Download Verified Transcript (PDF)
        </button>
      </div>

      {/* Contributions List */}
      <div className="space-y-3">
        {contributions.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{item.title}</h3>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs self-start sm:self-center">
                +{item.creditPoints} NEP Credits
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed font-medium">
              <strong>Impact on Solution:</strong> {item.impact}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="text-emerald-700 font-bold">{item.status}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
