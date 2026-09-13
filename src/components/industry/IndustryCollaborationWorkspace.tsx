import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CollaborationSupportType, IndustryContribution } from '../../types';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Handshake,
  Layers,
  Plus,
  ShieldCheck,
  Cpu,
  Upload,
  Send,
  MessageSquare,
  Sparkles,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const IndustryCollaborationWorkspace: React.FC = () => {
  const {
    collaborations,
    selectedCollaborationId,
    setCurrentView,
    goBack,
    addIndustryContribution,
    currentIndustryMember,
    technicalFeedback,
    submitTechnicalFeedback,
    projects,
    showToast,
  } = useApp();

  const collab =
    collaborations.find((c) => c.id === selectedCollaborationId) || collaborations[0];
  const project = projects.find((p) => p.id === collab?.project_id);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'contributions' | 'technical' | 'milestones' | 'testing' | 'documents'
  >('overview');

  // New Contribution Modal Form state
  const [showAddContrib, setShowAddContrib] = useState(false);
  const [contribType, setContribType] = useState<CollaborationSupportType>('Manufacturing');
  const [contribDesc, setContribDesc] = useState('');
  const [contribQty, setContribQty] = useState('');
  const [contribEvidence, setContribEvidence] = useState('Fabrication-Inspection-Signoff.pdf');

  // New Technical Feedback state
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [fbTitle, setFbTitle] = useState('');
  const [fbCategory, setFbCategory] = useState<
    'Testing Requirement' | 'Prototype Specifications' | 'Manufacturing Guidance' | 'Integration Requirements' | 'General Feedback'
  >('Manufacturing Guidance');
  const [fbText, setFbText] = useState('');

  if (!collab) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-600">No collaboration workspace selected.</p>
        <button
          onClick={() => setCurrentView('industry-collaborations')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Collaborations
        </button>
      </div>
    );
  }

  const handleSaveContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribDesc.trim()) return;

    addIndustryContribution(collab.id, {
      project_id: collab.project_id,
      contribution_type: contribType,
      description: contribDesc,
      quantity: contribQty || '1 Deliverable',
      status: 'Completed',
      evidence_name: contribEvidence || 'Signoff-Certificate.pdf',
      created_by: currentIndustryMember?.name || 'Partner',
    });

    setContribDesc('');
    setContribQty('');
    setShowAddContrib(false);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTitle.trim() || !fbText.trim()) return;

    submitTechnicalFeedback({
      project_id: collab.project_id,
      category: fbCategory,
      title: fbTitle,
      feedback_text: fbText,
      status: 'Open',
    });

    setFbTitle('');
    setFbText('');
    setShowAddFeedback(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => goBack('industry-collaborations')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Active Collaborations
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Workspace: {collab.status}
          </span>
          <span className="text-xs text-slate-400">ID: {collab.id}</span>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs text-emerald-300 mb-2">
            <Handshake className="w-4 h-4" />
            <span>Official Co-Development Workspace</span>
            <span>•</span>
            <span>{collab.university_name} × {collab.industry_name}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            {collab.project_title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>University: <strong>{collab.university_name}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Progress: <strong>{collab.progress_percent}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contributions Logged: <strong>{collab.contributions?.length || 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70 px-6">
          {[
            { id: 'overview', label: 'Workspace Overview' },
            { id: 'contributions', label: `Logged Contributions (${collab.contributions?.length || 0})` },
            { id: 'technical', label: `Technical Updates & Feedback (${collab.technical_updates?.length || 0})` },
            { id: 'milestones', label: 'Joint Milestones' },
            { id: 'testing', label: 'Testbed Facilities' },
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
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <span className="font-semibold text-emerald-900 block">Current Stage</span>
                  <div className="text-base font-bold text-emerald-800">
                    {project?.currentStage || 'Testing Stage'}
                  </div>
                  <p className="text-[11px] text-slate-600">Official stage managed by university</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-semibold text-slate-700 block">Industry Support Types</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {collab.collaboration_types.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-white border rounded text-[10px] font-bold text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-semibold text-slate-700 block">Lead Industry Contact</span>
                  <div className="text-slate-800 font-bold">{collab.contact_person}</div>
                  <div className="text-slate-500 text-[11px]">{collab.contact_email}</div>
                </div>
              </div>

              {/* Agreed Partnership Scope */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <h4 className="font-bold text-slate-800">Agreed Institutional Scope:</h4>
                <div className="space-y-1">
                  <span className="text-slate-500 block">Industry Committed Contribution:</span>
                  <p className="text-slate-700 leading-relaxed">{collab.proposed_contribution}</p>
                </div>
                {collab.expected_support && (
                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block">University Deliverables:</span>
                    <p className="text-slate-700 leading-relaxed">{collab.expected_support}</p>
                  </div>
                )}
                {collab.university_response_notes && (
                  <div className="p-3 bg-emerald-100/60 border border-emerald-300 rounded-lg text-emerald-900">
                    <strong>University Dean of R&D Endorsement:</strong> {collab.university_response_notes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CONTRIBUTIONS TRACKER */}
          {activeTab === 'contributions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Industry Contributions Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record delivered equipment, fabrication hours, lab test runs, grants, or field equipment.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddContrib(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Log New Contribution
                </button>
              </div>

              {/* Contributions list */}
              {(!collab.contributions || collab.contributions.length === 0) ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-xs text-slate-500">No contributions logged yet for this partnership.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {collab.contributions.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                            {c.contribution_type}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-medium">Logged {c.date}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">By {c.created_by}</span>
                        </div>
                        <p className="text-slate-800 font-medium">{c.description}</p>
                        {c.evidence_name && (
                          <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Verification Attachment: {c.evidence_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {c.quantity && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Volume</span>
                            <span className="font-bold text-slate-800">{c.quantity}</span>
                          </div>
                        )}
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TECHNICAL UPDATES & FEEDBACK */}
          {activeTab === 'technical' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Engineering Guidance & Technical Feedback
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide specialized feedback on materials, tolerances, electronics, or field constraints.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddFeedback(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Submit Technical Guidance
                </button>
              </div>

              {/* Technical feedback stream */}
              <div className="space-y-3">
                {technicalFeedback
                  .filter((fb) => fb.project_id === collab.project_id)
                  .map((fb) => (
                    <div
                      key={fb.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">
                            {fb.category}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">
                            By {fb.author_name} ({fb.author_role})
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          Status: {fb.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900">{fb.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{fb.feedback_text}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Joint Milestone Schedule
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Progress milestones agreed between university academic supervisors and industry engineers.
                </p>

                <div className="space-y-3">
                  {[
                    {
                      name: 'M1: Rapid Fabrication of SS316 Casings',
                      date: 'February 2026',
                      status: 'Completed',
                      responsible: 'Tata Steel Innovation Centre',
                    },
                    {
                      name: 'M2: 48-Hour Continuous Pressure Rig Testing',
                      date: 'February 2026',
                      status: 'Completed',
                      responsible: 'Joint Tata Steel & BIT Mesra',
                    },
                    {
                      name: 'M3: LiFePO4 Solar Firmware Telemetry Integration',
                      date: 'March 2026',
                      status: 'In Progress',
                      responsible: 'BIT Mesra IoT Student Cell',
                    },
                    {
                      name: 'M4: Torpa Block 10-Unit Pilot Deployment',
                      date: 'April 2026',
                      status: 'Upcoming',
                      responsible: 'Joint with District Administration',
                    },
                  ].map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {m.status === 'Completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <div>
                          <div className="font-bold text-slate-800">{m.name}</div>
                          <div className="text-[11px] text-slate-500">Target: {m.date} • Lead: {m.responsible}</div>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TESTING FACILITIES */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Allocated Industrial Testbeds
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800">Hydraulic Burst Rig (Jamshedpur Facility)</div>
                    <p className="text-slate-600">
                      High-pressure cyclic testing facility certified up to 15.0 bar. Used to certify SS316 welds under sustained continuous water pulsation.
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                      Certified Safe (6.2 bar)
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800">Thermal Cycling Chamber</div>
                    <p className="text-slate-600">
                      Simulates Jharkhand summer peak temperature (up to 55°C) and monsoon humidity to verify ESP32 telemetry sensor zero-drift stability.
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                      Verified Zero Drift
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log Contribution Modal */}
      {showAddContrib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900">Log Industry Contribution</h4>
              <button
                onClick={() => setShowAddContrib(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContribution} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contribution Type</label>
                <select
                  value={contribType}
                  onChange={(e) => setContribType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Manufacturing">Manufacturing & Tooling</option>
                  <option value="Testing">Testing & Laboratory Testbed</option>
                  <option value="Mentorship">Technical Mentorship</option>
                  <option value="Funding">Funding / Seed Grant</option>
                  <option value="Technology">Technology / Sensors / IP</option>
                  <option value="Deployment">Field Logistics & Deployment</option>
                  <option value="CSR">CSR Fund Allocation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description of Deliverable
                </label>
                <textarea
                  rows={3}
                  required
                  value={contribDesc}
                  onChange={(e) => setContribDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Fabricated 3 SS316 filter cylinders with CNC distribution manifolds..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Volume / Quantity</label>
                <input
                  type="text"
                  value={contribQty}
                  onChange={(e) => setContribQty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 3 Units / 12 Hours / ₹2,50,000"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  QC Document / Signoff File Reference
                </label>
                <input
                  type="text"
                  value={contribEvidence}
                  onChange={(e) => setContribEvidence(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContrib(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Save Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Feedback Modal */}
      {showAddFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900">Submit Technical Guidance to Academic Team</h4>
              <button
                onClick={() => setShowAddFeedback(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={fbCategory}
                  onChange={(e) => setFbCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Manufacturing Guidance">Manufacturing Guidance</option>
                  <option value="Testing Requirement">Testing Requirement</option>
                  <option value="Prototype Specifications">Prototype Specifications</option>
                  <option value="Integration Requirements">Integration Requirements</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guidance Title</label>
                <input
                  type="text"
                  required
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Recommendation: Upgrade gasket material for acid resistance"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Details & Advisory</label>
                <textarea
                  rows={4}
                  required
                  value={fbText}
                  onChange={(e) => setFbText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="Explain engineering considerations, standard compliance, or recommended fixes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFeedback(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Submit Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
