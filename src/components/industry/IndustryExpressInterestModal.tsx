import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectLifecycle, CollaborationSupportType } from '../../types';
import { X, CheckCircle2, AlertCircle, Building2, Send, Handshake, ShieldCheck } from 'lucide-react';

interface Props {
  project: ProjectLifecycle;
  onClose: () => void;
}

export const IndustryExpressInterestModal: React.FC<Props> = ({ project, onClose }) => {
  const {
    activeIndustry,
    currentIndustryMember,
    expressCollaborationInterest,
    showToast,
  } = useApp();

  const [selectedTypes, setSelectedTypes] = useState<CollaborationSupportType[]>([
    'Manufacturing',
    'Testing',
  ]);
  const [proposedContribution, setProposedContribution] = useState<string>(
    `We propose to provide industrial fabrication testbeds at our ${activeIndustry.district} facility, conduct certified hydraulic and pressure endurance tests, and allocate an experienced senior engineer for weekly technical advisory.`
  );
  const [expectedSupport, setExpectedSupport] = useState<string>(
    'Direct access to weekly test telemetry logs, student team milestone syncs, and co-mentorship acknowledgement on state publication reports.'
  );
  const [contactPerson, setContactPerson] = useState<string>(currentIndustryMember?.name || '');
  const [contactEmail, setContactEmail] = useState<string>(currentIndustryMember?.email || '');
  const [additionalInfo, setAdditionalInfo] = useState<string>(
    'All testing resources and testbed machinery will be covered under our CSR innovation matching allowance with zero expense to the student team.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supportOptions: { type: CollaborationSupportType; label: string; desc: string }[] = [
    { type: 'Funding', label: 'Funding / Grant', desc: 'Direct research seed grant or milestone funding' },
    { type: 'Technology', label: 'Technology / IP', desc: 'Software, cloud compute, specialized algorithms, or sensors' },
    { type: 'Manufacturing', label: 'Manufacturing & Fab', desc: 'PCB fabrication, sheet metal, tooling, batch production' },
    { type: 'Testing', label: 'Testing & Validation', desc: 'Environmental chamber, pressure stress, spectrometry testing' },
    { type: 'Mentorship', label: 'Technical Mentorship', desc: 'Dedicated industry engineering lead or domain specialist' },
    { type: 'Deployment', label: 'Field Deployment', desc: 'District logistics, village testbed deployment, SHG training' },
    { type: 'CSR', label: 'CSR Partnership', desc: 'Corporate Social Responsibility statutory fund matching' },
  ];

  const handleToggleType = (type: CollaborationSupportType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTypes.length === 0) {
      setErrorMessage('Please select at least one collaboration support category.');
      return;
    }
    if (!proposedContribution.trim()) {
      setErrorMessage('Please detail your proposed contribution.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      const result = expressCollaborationInterest({
        projectId: project.id,
        collaborationTypes: selectedTypes,
        proposedContribution,
        expectedSupport,
        contactPerson,
        contactEmail,
        additionalInfo,
      });

      setIsSubmitting(false);
      if (result.success) {
        setSubmittedSuccess(true);
      } else {
        setErrorMessage(result.message);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <Handshake className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Express Collaboration Interest</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Official Partnership Expression for University R&D Project
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 p-3 bg-white/10 rounded-lg text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-emerald-200">Target Project:</span>
              <span className="font-semibold text-white truncate max-w-xs">{project.title || project.proposal?.title || project.challengeTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-200">University:</span>
              <span className="font-semibold text-white">{project.universityName || project.university?.name || 'Academic Partner'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-200">Organization:</span>
              <span className="font-semibold text-white">{activeIndustry.organization_name}</span>
            </div>
          </div>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-slate-800">
              Collaboration Request Submitted
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your official collaboration proposal has been recorded in the central JH Innovation Connect registry.
              The Dean of R&D at <strong>{project.universityName || project.university?.name || 'Partner University'}</strong> has received an instant dispatch notification.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left max-w-md mx-auto text-xs space-y-2">
              <div className="font-semibold text-slate-700">Next Steps:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>University team will review proposed manufacturing & testing testbeds.</li>
                <li>Upon mutual clearance, this project will appear under <strong>Active Collaborations</strong>.</li>
                <li>You can track status anytime under <strong>Collaboration Requests</strong>.</li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow transition"
              >
                Done & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Support Type Checkboxes */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                How can your organization help? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {supportOptions.map((opt) => {
                  const isChecked = selectedTypes.includes(opt.type);
                  return (
                    <div
                      key={opt.type}
                      onClick={() => handleToggleType(opt.type)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start gap-3 ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/70 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{opt.label}</div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {opt.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proposed Contribution */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Proposed Contribution & Facilities Offered <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Specify facilities, machinery, testbeds, funding grants, or specialized engineering hours you will commit.
              </p>
              <textarea
                rows={3}
                required
                value={proposedContribution}
                onChange={(e) => setProposedContribution(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="Detail what equipment, funding, materials or expert guidance you are offering..."
              />
            </div>

            {/* Expected Support / Reciprocal deliverables */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Expected Support & Co-Development Terms
              </label>
              <p className="text-xs text-slate-500 mb-2">
                What telemetry data, reports, or research access does your organization need from the university?
              </p>
              <textarea
                rows={2}
                value={expectedSupport}
                onChange={(e) => setExpectedSupport(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="e.g. Access to weekly spectrometry test logs, prototype fabrication CAD files..."
              />
            </div>

            {/* Contact Person & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Information / CSR Compliance Remarks
              </label>
              <textarea
                rows={2}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                placeholder="Optional: Mention CSR statutory registration, NDA terms, or patent sharing agreements..."
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-[11px] text-emerald-900 leading-snug">
                Submitting this expression enters formal institutional dialogue. You will <strong>not</strong> automatically become project owner, preserving university research independence and citizen ownership under state framework guidelines.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Interest
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
