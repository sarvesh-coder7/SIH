import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryExpressInterestModal } from './IndustryExpressInterestModal';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  Lock,
  Eye,
  Download,
  AlertTriangle,
  History,
  CheckCircle2,
  Users,
  Cpu,
  Layers,
  Sparkles,
  Handshake,
  DollarSign,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const IndustryProjectDetail: React.FC = () => {
  const {
    projects,
    challenges,
    selectedProjectId,
    setCurrentView,
    goBack,
    projectReports,
    currentIndustryMember,
    activeIndustry,
    collaborations,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'solution' | 'testing' | 'reports' | 'history' | 'support'
  >('overview');
  const [isExpressModalOpen, setIsExpressModalOpen] = useState(false);
  const [viewingReportDoc, setViewingReportDoc] = useState<any | null>(null);

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const challenge = challenges.find((c) => c.id === project.challengeId);

  // Check if active collaboration already exists
  const existingCollab = collaborations.find(
    (c) => c.project_id === project.id && c.industry_id === activeIndustry.id
  );

  // Filter reports according to authorization
  // Industry can see: PUBLIC, PARTICIPANTS, INDUSTRY_ONLY
  // Cannot see: UNIVERSITY_ONLY, RESTRICTED (unless explicitly granted)
  const relevantReports = projectReports.filter(
    (r) => r.project_id === project.id || r.challenge_id === challenge?.id
  );

  const authorizedReports = relevantReports.filter(
    (r) => r.visibility === 'PUBLIC' || r.visibility === 'PARTICIPANTS' || r.visibility === 'INDUSTRY_ONLY'
  );

  const restrictedReports = relevantReports.filter(
    (r) => r.visibility === 'UNIVERSITY_ONLY' || r.visibility === 'RESTRICTED'
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => goBack('industry-discovery')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project Discovery
        </button>

        <div className="flex items-center gap-3">
          {existingCollab ? (
            <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Collaboration Status: {existingCollab.status}
            </div>
          ) : (
            <button
              onClick={() => setIsExpressModalOpen(true)}
              disabled={!currentIndustryMember.permissions.canExpressCollaboration}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <Handshake className="w-4 h-4" />
              Express Collaboration Interest
            </button>
          )}
        </div>
      </div>

      {/* Project Master Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              {project.currentStage || 'Prototype'} Stage
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
              ID: {project.id}
            </span>
            {challenge && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                Challenge: {challenge.id}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            {project.title || project.proposal?.title || project.challengeTitle}
          </h1>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-4 border-t border-white/10">
            <div>
              <span className="text-emerald-300 block font-semibold mb-0.5">Assigned University</span>
              <span className="text-white font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                {project.universityName || project.university?.name || 'Partner University'}
              </span>
            </div>
            <div>
              <span className="text-emerald-300 block font-semibold mb-0.5">Target District</span>
              <span className="text-white font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {project.district || 'Khunti, Jharkhand'}
              </span>
            </div>
            <div>
              <span className="text-emerald-300 block font-semibold mb-0.5">University R&D Team</span>
              <span className="text-white font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Faculty Lead + 6 Student Researchers
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70 px-6">
          {[
            { id: 'overview', label: 'Problem & Overview' },
            { id: 'solution', label: 'Solution & R&D' },
            { id: 'testing', label: 'Testing & Prototype' },
            { id: 'reports', label: `Authorized Reports (${authorizedReports.length})` },
            { id: 'history', label: 'Prior University Attempts' },
            { id: 'support', label: 'Industry Support Needed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  The Societal Challenge (Ground Reality)
                </h3>
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-slate-800 leading-relaxed space-y-2">
                  <p>
                    <strong>Location:</strong> {project.district || 'Khunti, Jharkhand'} — 34 drinking water handpumps in Torpa block.
                  </p>
                  <p>
                    {challenge?.problemSummary ||
                      challenge?.description ||
                      'Excessive groundwater fluoride levels (4.32 mg/L, exceeding WHO and BIS limits of 1.0 mg/L) have caused widespread dental and skeletal fluorosis among children and elderly villagers. Village water monitoring is currently manual, irregular, and lack of sustainable filtration media causes frequent handpump abandonments.'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Project Summary & Academic Mandate
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {project.summary ||
                    'Developing an indigenous, dual-stage gravity adsorption column utilizing locally activated biochar and modified activated alumina. Includes a low-power solar IoT telemetry beacon for real-time fluoride breakthrough logging and preventive backwash reminders.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    University Research Institution
                  </div>
                  <div className="text-slate-600">{project.universityName || project.university?.name || 'Partner University'}</div>
                  <div className="text-slate-500">Department: Chemical Engineering & IoT Sensor Lab</div>
                  <div className="text-slate-500">Accreditation: NAAC A++, AISHE Certified</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    State Higher Education Grant Status
                  </div>
                  <div className="text-slate-600">Sanctioned Seed Grant: ₹3,50,000</div>
                  <div className="text-slate-500">Target Completion: Q3 2026</div>
                  <div className="text-emerald-700 font-medium">Official Attempt #3 (Active Workspace)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOLUTION & R&D */}
          {activeTab === 'solution' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Authorized Engineering Solution Architecture
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  The solution replaces failure-prone imported cartridges with an indigenous two-stage column:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-2">
                    <span className="font-bold text-emerald-900 block">Stage 1: Biochar Pre-Adsorption</span>
                    <p className="text-slate-600">
                      Prepared from local agricultural waste (paddy husk and sal seed cake) to remove heavy organics, suspended silt, and turbidity that clogged earlier attempts.
                    </p>
                  </div>
                  <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl text-xs space-y-2">
                    <span className="font-bold text-teal-900 block">Stage 2: Nano-Activated Alumina Bed</span>
                    <p className="text-slate-600">
                      Regenerable high-surface-area media operating under passive gravity flow (15-20 L/hr) bringing fluoride levels down from 4.32 mg/L to &lt; 0.65 mg/L.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Current Laboratory Results
                </h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="text-base font-extrabold text-emerald-700">92.4%</div>
                      <div className="text-[10px] text-slate-500">Fluoride Removal</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="text-base font-extrabold text-slate-800">18 L/hr</div>
                      <div className="text-[10px] text-slate-500">Gravity Flow Rate</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="text-base font-extrabold text-slate-800">1,200 L</div>
                      <div className="text-[10px] text-slate-500">Breakthrough Volume</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <div className="text-base font-extrabold text-emerald-700">₹0.14/L</div>
                      <div className="text-[10px] text-slate-500">Operating Cost</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TESTING & PROTOTYPE */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  Prototype Specifications & Industrial Hardware Requirements
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  The university team has assembled 2 benchtop prototype units and is seeking industry collaboration for ruggedized field enclosures and batch tooling.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800">Mechanical Specifications:</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Dual-column casing: SS316 food-grade stainless steel or UV-stabilized FRP</li>
                      <li>Operating pressure: 1.5 to 4.0 bar (compatible with handpump attachment)</li>
                      <li>Easy-access quick-disconnect flanges for quarterly media regeneration</li>
                      <li>Anti-tamper locking bracket for community installation</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800">Electronics & Telemetry:</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>ESP32 low-power microcontroller with GSM/2G fallback module</li>
                      <li>Optical turbidity sensor & differential pressure transducer</li>
                      <li>10W solar panel with 12V 7Ah LiFePO4 battery pack (5-day autonomy)</li>
                      <li>Daily encrypted payload to State Water Quality Dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Testing Status & Industry Validation Needed
                </h3>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800">Spectrometry & Adsorption Kinetics</span>
                        <div className="text-[11px] text-slate-500">Validated at BIT Mesra Analytical Chemistry Lab</div>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                      Completed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="font-bold text-slate-800">48-Hour Continuous Hydraulic Burst & Stress Test</span>
                        <div className="text-[11px] text-slate-500">Requires industrial hydraulic testing rig (6.0 bar)</div>
                      </div>
                    </div>
                    <span className="text-amber-800 font-bold bg-white px-2.5 py-1 rounded-md border border-amber-200">
                      Industry Testbed Needed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="font-bold text-slate-800">Environmental Chamber Thermal Cycling (-10°C to 65°C)</span>
                        <div className="text-[11px] text-slate-500">Simulate Jharkhand extreme summer heat and humidity</div>
                      </div>
                    </div>
                    <span className="text-amber-800 font-bold bg-white px-2.5 py-1 rounded-md border border-amber-200">
                      Industry Testbed Needed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS WITH PERMISSION VISIBILITY */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Authorized Research & Validation Reports
                  </h3>
                  <span className="text-xs text-slate-500">
                    Visibility Rule: <strong>Industry Authorized Access</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Industry partners are authorized to access public data, testing reports, CAD specs, and community baseline surveys. Internal university laboratory formulation notebooks remain restricted.
                </p>

                {/* Authorized Reports List */}
                <div className="space-y-3">
                  {authorizedReports.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {doc.report_type}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                            Visibility: {doc.visibility}
                          </span>
                          <span className="text-xs text-slate-400">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{doc.description}</p>
                        <div className="text-[10px] text-slate-400">
                          By: {doc.uploaded_by} • Size: {doc.file_size}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setViewingReportDoc(doc)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Dossier
                        </button>
                        <a
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                            `JH INNOVATION CONNECT REPORT EXPORT\nTitle: ${doc.title}\nProject: ${doc.project_title}\nUniversity: ${doc.university_name}\nType: ${doc.report_type}\nUploaded By: ${doc.uploaded_by}\nDate: ${doc.uploaded_at}\n\nSUMMARY & TECHNICAL SPECIFICATIONS:\n${doc.description}`
                          )}`}
                          download={doc.file_name}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restricted Documents Notice */}
              {restrictedReports.length > 0 && (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Protected Academic & IPR Documents ({restrictedReports.length})
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    The following internal documents are restricted to university faculty researchers or active patent licensing parties under institutional governance rules:
                  </p>
                  <div className="space-y-1.5">
                    {restrictedReports.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between text-slate-500"
                      >
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700">{doc.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                            {doc.visibility}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                          Restricted Access
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PRIOR ATTEMPTS */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  Attempt Lifecycle & Learned Failure History
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  To prevent wasted capital, JH Innovation Connect permanently retains failure analyses from previous university attempts. Industry partners can review why past efforts failed and how the current attempt overcomes those barriers:
                </p>

                <div className="relative border-l-2 border-slate-200 pl-6 space-y-6 ml-2">
                  {/* Attempt 1 */}
                  <div className="relative space-y-2">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-rose-500 border-2 border-white" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Attempt #1 (2024): University A — Gravity Bio-Sand Filter
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Outcome: Field Bottleneck / Silt Clogging
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                      <p>
                        <strong>Cause of Failure:</strong> Monsoonal silt and particulate matter clogged the top fine-sand bed within 14 days, reducing flow from 20 L/hr to zero. Lack of pre-filtration biochar was identified as the root defect.
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Full Post-Mortem Report archived in state repository for academic reference.
                      </p>
                    </div>
                  </div>

                  {/* Attempt 2 */}
                  <div className="relative space-y-2">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-rose-500 border-2 border-white" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Attempt #2 (2025): University B — Automated Chemical Dosing Skid
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Outcome: Maintenance Failure / Power Grid Dependence
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                      <p>
                        <strong>Cause of Failure:</strong> Dependent on 230V AC grid electricity which experienced 6-8 hour daily load shedding in rural Khunti. Chemical dosing pump burned out during voltage spikes; local Jal Sahiyas could not calibrate liquid reagents.
                      </p>
                    </div>
                  </div>

                  {/* Attempt 3 (Current) */}
                  <div className="relative space-y-2">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">
                        Attempt #3 (2026): BIT Mesra — Jal-Shuddhi Dual Stage + Solar IoT (Current)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active Prototyping
                      </span>
                    </div>
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                      <p>
                        <strong>Learned Innovation:</strong> Operates entirely on passive gravity flow (no electric pump). Uses regenerable activated alumina beads with agricultural biochar pre-filter to prevent silt clogging. Includes autonomous 10W solar telemetry.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SUPPORT NEEDED */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-emerald-600" />
                  Required Industry & Corporate Co-Development Support
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  The university invites institutional partnerships across the following specific work packages:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2 text-xs">
                    <div className="font-bold text-purple-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      1. Manufacturing & Tooling Partner
                    </div>
                    <p className="text-slate-600">
                      Fabrication of 20 standardized SS316 filter casings with precision quick-release clamps and laser-cut internal diffuser screens.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 text-xs">
                    <div className="font-bold text-emerald-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      2. Environmental & Pressure Testing Testbed
                    </div>
                    <p className="text-slate-600">
                      Access to certified industrial environmental test chambers and 48-hour hydraulic pressure test rigs to clear BIS IS-10500 standards.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs">
                    <div className="font-bold text-amber-900 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-700" />
                      3. CSR Grant & Pilot Deployment Co-Funding
                    </div>
                    <p className="text-slate-600">
                      ₹2,50,000 co-sponsorship grant for field deployment across 10 vulnerable tribal habitations in Torpa block, including Jal Sahiya toolkits.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2 text-xs">
                    <div className="font-bold text-blue-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      4. Industrial Mentorship & Design For Manufacturing (DFM)
                    </div>
                    <p className="text-slate-600">
                      Senior manufacturing/metallurgy engineer to conduct bi-weekly advisory sessions on design-for-manufacture and vendor scaling.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-center">
                  <button
                    onClick={() => setIsExpressModalOpen(true)}
                    disabled={!currentIndustryMember.permissions.canExpressCollaboration}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition"
                  >
                    <Handshake className="w-4 h-4" />
                    Express Collaboration Interest for This Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Express Interest Modal */}
      {isExpressModalOpen && (
        <IndustryExpressInterestModal
          project={project}
          onClose={() => setIsExpressModalOpen(false)}
        />
      )}

      {/* Document Quick Preview Modal */}
      {viewingReportDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">{viewingReportDoc.title}</h4>
              </div>
              <button
                onClick={() => setViewingReportDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5">
              <div><strong>Project:</strong> {viewingReportDoc.project_title}</div>
              <div><strong>University:</strong> {viewingReportDoc.university_name}</div>
              <div><strong>Report Category:</strong> {viewingReportDoc.report_type}</div>
              <div><strong>Author / Investigator:</strong> {viewingReportDoc.uploaded_by}</div>
              <div><strong>Authorized Visibility:</strong> {viewingReportDoc.visibility}</div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
              <div className="font-semibold text-emerald-900 mb-1">Dossier Abstract & Verified Data:</div>
              {viewingReportDoc.description}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setViewingReportDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  `JH INNOVATION CONNECT REPORT EXPORT\nTitle: ${viewingReportDoc.title}\nProject: ${viewingReportDoc.project_title}\nUniversity: ${viewingReportDoc.university_name}\nType: ${viewingReportDoc.report_type}\nUploaded By: ${viewingReportDoc.uploaded_by}\nDate: ${viewingReportDoc.uploaded_at}\n\nSUMMARY & TECHNICAL SPECIFICATIONS:\n${viewingReportDoc.description}`
                )}`}
                download={viewingReportDoc.file_name}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Document
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
