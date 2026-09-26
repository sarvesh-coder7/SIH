import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Shield,
  Bell,
  Save,
  Award,
  FlaskConical,
  CreditCard,
  Sliders,
  CheckCircle2,
  Sparkles,
  Lock,
  Mail,
  Phone,
  MapPin,
  FileCheck,
} from 'lucide-react';

export const UniversitySettingsPage: React.FC = () => {
  const { currentUser, showToast } = useApp();
  const [activeSection, setActiveSection] = useState<'profile' | 'labs' | 'bank' | 'alerts'>('profile');

  // Form State
  const [univName, setUnivName] = useState(currentUser.organization || 'Birla Institute of Technology (BIT) Mesra');
  const [leadDept, setLeadDept] = useState('Centre for Water Resources & Chemical Engineering');
  const [email, setEmail] = useState('dean.rnd@bitmesra.ac.in');
  const [phone, setPhone] = useState('+91 651 2275444');
  const [nodalOfficer, setNodalOfficer] = useState('Dr. Meenakshi Soren (Dean R&D & Faculty Director)');

  // Lab credentials
  const [labs, setLabs] = useState([
    { name: 'Environmental Spectrometry & Water Quality Lab', cert: 'NABL Accredited (ISO 17025)', equipment: 'AAS Spectrophotometer, Ion Chromatograph' },
    { name: 'IoT Telemetry & Embedded Prototyping Workshop', cert: 'DST Supported FAB-Lab', equipment: 'LoRaWAN Gateways, PCB Milling, STM32 Testers' },
    { name: 'Solar Thermal & Micro-Cold Storage Testing Cell', cert: 'MNRE Certified Test Bed', equipment: 'Eutectic PCM Calorimeter, Solar Array Simulator' },
  ]);

  // Alerts
  const [aiTriageAutoRoute, setAiTriageAutoRoute] = useState(true);
  const [csrGrantNotifs, setCsrGrantNotifs] = useState(true);
  const [milestoneDeadlineAlerts, setMilestoneDeadlineAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Profile & Settings Saved', 'University institutional credentials & preferences updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d6bc] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Institutional Accreditation & Governance
            </span>
            <span className="text-xs text-slate-500 font-mono">AISHE Code: U-0275 &bull; NAAC A++</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Profile & Institution Settings
          </h1>
          <p className="text-xs text-slate-600 max-w-xl">
            Manage university department profiles, verified laboratory certifications, PFMS grant disbursement accounts, and AI problem triage preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <span className="px-3 py-1.5 rounded-xl bg-[#fbf8ee] border border-[#e2d6bc] text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Verified HEI Node</span>
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#e2d6bc] bg-white rounded-t-2xl px-4 pt-2 overflow-x-auto shadow-2xs">
        {[
          { id: 'profile', label: 'Institutional Profile & Credentials', icon: Building2 },
          { id: 'labs', label: 'Verified R&D Labs & Equipment', icon: FlaskConical },
          { id: 'bank', label: 'PFMS & Grant Bank Accounts', icon: CreditCard },
          { id: 'alerts', label: 'AI Routing & Alert Preferences', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'border-[#0d5c3a] text-[#0d5c3a]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white rounded-b-2xl p-6 sm:p-8 border border-[#e2d6bc] border-t-0 shadow-xs space-y-6 text-xs">
        {/* Section 1: Profile */}
        {activeSection === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              University Details & Nodal Administration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Institution Legal Name</label>
                <input
                  type="text"
                  value={univName}
                  onChange={(e) => setUnivName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">AISHE Institutional Code & NIRF Rank</label>
                <input
                  type="text"
                  defaultValue="U-0275 (NIRF Engineering Rank: 45)"
                  disabled
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lead R&D Department / Center</label>
                <input
                  type="text"
                  value={leadDept}
                  onChange={(e) => setLeadDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Designated Faculty Director & Nodal Officer</label>
                <input
                  type="text"
                  value={nodalOfficer}
                  onChange={(e) => setNodalOfficer(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Nodal Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div className="p-4 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Accreditation Badge: NAAC A++ (CGPA 3.65)</span>
                <span className="text-[11px] text-slate-600">Issued by National Assessment & Accreditation Council &bull; Valid through 2028</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Verified
              </span>
            </div>
          </div>
        )}

        {/* Section 2: Labs */}
        {activeSection === 'labs' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Verified Testing Facilities for Solution Validation
            </h3>

            <div className="space-y-3">
              {labs.map((lab, idx) => (
                <div key={idx} className="p-4 bg-[#fbf8ee] rounded-xl border border-[#e2d6bc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{lab.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {lab.cert}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">Equipment: <strong className="text-slate-800">{lab.equipment}</strong></p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>State PMU Verified</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: PFMS & Bank Accounts */}
        {activeSection === 'bank' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              PFMS Direct Benefit & CSR Grant Account
            </h3>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-slate-800 space-y-1">
              <span className="font-bold text-xs block">Public Financial Management System (PFMS) Scheme Linked</span>
              <p className="text-[11px] text-slate-600">
                State PMU and corporate CSR partners disburse grant tranches directly to this institutional project account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Bank Name & Branch</label>
                <input
                  type="text"
                  defaultValue="State Bank of India (SBI), BIT Mesra Branch (Ranchi)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  defaultValue="BIT MESRA R&D AND INNOVATION CELL"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Account Number (Encrypted)</label>
                <input
                  type="text"
                  defaultValue="XXXX-XXXX-3891"
                  disabled
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">IFSC Code & PFMS Agency Code</label>
                <input
                  type="text"
                  defaultValue="SBIN0000407 &bull; Agency Code: JH-HEI-0275"
                  disabled
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Alerts */}
        {activeSection === 'alerts' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Automated AI Routing & Real-time Alerts
            </h3>

            <div className="space-y-3">
              {[
                {
                  label: 'AI Problem Statement Auto-Triage',
                  desc: 'Automatically route high-confidence domain challenges (Chemical, Water, IoT) to lead faculty queue.',
                  value: aiTriageAutoRoute,
                  setter: setAiTriageAutoRoute,
                },
                {
                  label: 'CSR Grant & MoU Disbursement Alerts',
                  desc: 'Receive immediate notifications on PFMS grant tranche releases and sanction clearances.',
                  value: csrGrantNotifs,
                  setter: setCsrGrantNotifs,
                },
                {
                  label: 'Milestone & Deliverable Audit Reminders',
                  desc: 'Alert faculty and student cohort leads 5 days prior to PMU audit deadlines.',
                  value: milestoneDeadlineAlerts,
                  setter: setMilestoneDeadlineAlerts,
                },
              ].map((pref, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block">{pref.label}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{pref.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={pref.value}
                      onChange={(e) => pref.setter(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0d5c3a]" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">All updates synced with State PMU R&D registry.</span>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0d5c3a] hover:bg-[#0b4d30] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

