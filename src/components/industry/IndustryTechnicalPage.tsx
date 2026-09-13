import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Plus,
  Layers,
  Wrench,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  ChevronRight,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const IndustryTechnicalPage: React.FC = () => {
  const {
    technicalFeedback,
    submitTechnicalFeedback,
    projects,
    activeIndustry,
    currentIndustryMember,
    setCurrentView,
    setSelectedProjectId,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [targetProjectId, setTargetProjectId] = useState<string>(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [fbCategory, setFbCategory] = useState<
    'Testing Requirement' | 'Prototype Specifications' | 'Manufacturing Guidance' | 'Integration Requirements' | 'General Feedback'
  >('Manufacturing Guidance');
  const [feedbackText, setFeedbackText] = useState('');

  const filteredFeedbacks = technicalFeedback.filter((fb) => {
    if (selectedCategory === 'All') return true;
    return fb.category === selectedCategory;
  });

  const handleSubmitGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !feedbackText.trim()) return;

    submitTechnicalFeedback({
      project_id: targetProjectId,
      category: fbCategory,
      title,
      feedback_text: feedbackText,
      status: 'Open',
    });

    setTitle('');
    setFeedbackText('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Technical R&D Advisory & Standards Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide certified engineering specifications, Design For Manufacturing (DFM) rules, and laboratory testing protocols.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          Submit Technical Advisory
        </button>
      </div>

      {/* Technical Areas Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Manufacturing & Tooling',
            desc: 'Tolerances, SS316 machining, sheet metal enclosures & tooling dies.',
            icon: Wrench,
            color: 'text-purple-600 bg-purple-50 border-purple-200',
          },
          {
            title: 'Environmental Testing',
            desc: 'Thermal shock (-10°C to 65°C), hydraulic burst (6 bar), humidity soak.',
            icon: ShieldCheck,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
          },
          {
            title: 'Sensors & Telemetry',
            desc: 'Low power firmware, solar LiFePO4 battery life, GSM 2G telemetry.',
            icon: Cpu,
            color: 'text-blue-600 bg-blue-50 border-blue-200',
          },
          {
            title: 'Field Standards (BIS)',
            desc: 'IS-10500 drinking water norms, IP67 enclosure ratings, anti-tamper brackets.',
            icon: CheckCircle2,
            color: 'text-teal-600 bg-teal-50 border-teal-200',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 inline-flex flex-wrap gap-1">
        {[
          'All',
          'Manufacturing Guidance',
          'Testing Requirement',
          'Prototype Specifications',
          'Integration Requirements',
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Advisory Feed */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No technical guidance recorded under this category.
          </div>
        ) : (
          filteredFeedbacks.map((fb) => {
            const project = projects.find((p) => p.id === fb.project_id);

            return (
              <div
                key={fb.id}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-400 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                      {fb.category}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      Logged {new Date(fb.date || fb.created_at || Date.now()).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600">
                      By <strong>{fb.author_name}</strong> ({fb.author_role})
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 self-start sm:self-center">
                    Status: {fb.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{fb.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{fb.feedback_text}</p>
                </div>

                {project && (
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target Academic Project: <strong>{project.title || project.proposal?.title || project.challengeTitle}</strong> ({project.universityName || project.university?.name || 'Partner Lab'})</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setCurrentView('industry-project-detail');
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                      View Dossier →
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal to Submit Advisory */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900">Submit Engineering Advisory</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitGuidance} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Academic Project</label>
                <select
                  value={targetProjectId}
                  onChange={(e) => setTargetProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title || p.proposal?.title || p.challengeTitle} ({p.universityName || p.university?.name || 'University'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Advisory Classification</label>
                <select
                  value={fbCategory}
                  onChange={(e) => setFbCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Manufacturing Guidance">Manufacturing Guidance / DFM</option>
                  <option value="Testing Requirement">Testing Requirement & Chamber Protocols</option>
                  <option value="Prototype Specifications">Prototype Specifications & Tolerances</option>
                  <option value="Integration Requirements">Field Integration & Power Requirements</option>
                  <option value="General Feedback">General Engineering Feedback</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Advisory Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Design for Manufacture (DFM): Avoid sharp internal radii on manifold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Technical Guidance</label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="Reference relevant industrial standards, material grades (e.g. SS316L, EPDM), or testing methods..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Publish Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
