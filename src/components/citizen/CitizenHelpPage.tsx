import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Camera,
  GraduationCap,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How do I report a problem in my village or town?',
    a: 'Click on "+ Report a Problem" from your citizen dashboard or navigation menu. Follow the 4 simple steps: Describe what is happening, capture or enter your location, attach photos or videos as evidence, and confirm to submit.',
  },
  {
    q: 'Why should I attach photos or videos to my report?',
    a: 'Photos and videos provide verifiable physical proof of the issue (e.g. broken handpump, road cave-in). Reports with geotagged evidence get verified up to 3x faster by government nodal officers and university research teams.',
  },
  {
    q: 'How is my location used when reporting?',
    a: 'Your location is used solely to geotag the physical problem so field officers and engineering students can inspect the exact site. Your private residential address is never made public.',
  },
  {
    q: 'Can I report a problem without GPS?',
    a: 'Yes! If GPS is disabled or unavailable on your phone, you can simply select your District from the dropdown and type your Block and Village name manually.',
  },
  {
    q: 'What happens after I submit a problem?',
    a: 'Your problem receives a unique Challenge ID (e.g. JH-2026-00041) and is placed "Under Review". Once verified by district officers, it is published on the portal for universities and engineering teams to propose solutions.',
  },
  {
    q: 'How do universities become involved?',
    a: 'Universities and colleges across Jharkhand review open challenges. An institution expresses interest and is assigned to develop a prototype or pilot solution with state funding and CSR sponsorship.',
  },
  {
    q: 'What does "Open for Another Attempt" mean?',
    a: 'If a previous university attempt is unsuccessful or faces field constraints, the challenge is reopened automatically. The history is preserved so the next team knows what was already tested.',
  },
  {
    q: 'What does "Verified" trust status mean?',
    a: 'A "Verified" badge indicates that the problem was reviewed by an official government verification officer and confirmed with on-ground photos.',
  },
];

export const CitizenHelpPage: React.FC = () => {
  const { setCurrentView, showToast } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    showToast('success', 'Message Sent', 'Citizen support team has received your query.');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans-body">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <button
            onClick={() => setCurrentView('citizen-dashboard')}
            className="hover:text-amber-700 cursor-pointer"
          >
            Dashboard
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-medium">Help & FAQs</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-600" />
          <span>Citizen Help & Frequently Asked Questions</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Everything you need to know about reporting community problems and tracking public solutions.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-bold text-slate-900">
            Need Additional Help?
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Our district citizen coordinators are available Monday to Saturday (9:00 AM – 6:00 PM).
        </p>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Thank you! Your inquiry has been dispatched to the Khunti district nodal desk.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitSupport} className="space-y-3">
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question or support request here..."
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
