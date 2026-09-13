import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const StudentExperimentsPage: React.FC = () => {
  const { showToast } = useApp();
  const [experimentTitle, setExperimentTitle] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [outcome, setOutcome] = useState('Pass');

  const experiments = [
    {
      id: 'EXP-018',
      title: 'Vortex Pre-settling Chamber Silt Separation Rate Test',
      date: '2026-02-14',
      hypothesis: 'Cyclone swirl chamber will remove >80% coarse sand and silt (>50 micron) before water reaches alumina media bed.',
      result: '86.4% turbidity reduction achieved in 150 seconds. Zero media bed clogging observed.',
      status: 'Verified Pass',
      recordedBy: 'Rohan Kumar Verma (Student ID: BT/22/EE/041)',
    },
    {
      id: 'EXP-017',
      title: 'Activated Alumina Fluoride Adsorption Isotherm Run #4',
      date: '2026-02-10',
      hypothesis: 'Adsorption capacity will maintain >2.2 mg F-/g of media across pH 6.8 to 7.6.',
      result: 'Langmuir model fit confirmed. Residual fluoride measured at 0.38 mg/L (Safe limit 1.0 mg/L).',
      status: 'Verified Pass',
      recordedBy: 'Rohan Kumar Verma',
    },
    {
      id: 'EXP-016',
      title: 'Solar ESP32 Fluoride ISE Sensor Voltage Calibration & Drift Test',
      date: '2026-02-05',
      hypothesis: 'Sleep-cycle telemetry will operate on 5W mini solar panel with <2% voltage drop overnight.',
      result: 'Sensor battery maintained 3.92V after 14 hours darkness. 4G MQTT packet transmitted every 30 mins.',
      status: 'Verified Pass',
      recordedBy: 'Rohan Kumar Verma',
    },
  ];

  const handleAddExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Experiment Logged', 'New lab experiment recorded in digital lab notebook and linked to Capstone portfolio.');
    setExperimentTitle('');
    setHypothesis('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200">
            Digital Lab Notebook
          </span>
          <span className="text-xs font-mono text-slate-500 font-bold">
            JH-2026-0042 &bull; Village X Water
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Research & Lab Experiments
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          Document experimental hypotheses, spectrometry measurements, failure tests, and engineering validations. All data is immutably timestamped for academic credit evaluation.
        </p>
      </div>

      {/* Log Form */}
      <form onSubmit={handleAddExperiment} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4 text-indigo-600" />
          <span>Log New Lab Experiment</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Experiment Title / Run Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Backwash Flow Pressure Drop Test"
              value={experimentTitle}
              onChange={(e) => setExperimentTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Observed Outcome</label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 font-medium"
            >
              <option value="Pass">Verified Pass</option>
              <option value="Failure">Failed / Bottle-neck Found</option>
              <option value="Inconclusive">Inconclusive / Repeat</option>
            </select>
          </div>
        </div>

        <div className="text-xs">
          <label className="font-bold text-slate-700 block mb-1">Hypothesis & Procedure Notes</label>
          <textarea
            rows={2}
            placeholder="Describe what was tested, chemistry ratios, flow rate, or sensor calibration..."
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save Experiment to Dossier</span>
          </button>
        </div>
      </form>

      {/* Experiments List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Recorded Experiments History</h3>
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {exp.id}
                </span>
                <span className="font-bold text-slate-900 text-sm">{exp.title}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {exp.status}
              </span>
            </div>

            <p className="text-slate-700">
              <strong>Hypothesis:</strong> {exp.hypothesis}
            </p>
            <p className="text-slate-700">
              <strong>Result:</strong> {exp.result}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Recorded by: {exp.recordedBy}</span>
              <span>{exp.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
