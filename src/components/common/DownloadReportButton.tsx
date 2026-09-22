/**
 * DownloadReportButton.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A reusable "Download Report" button used by all four roles (Citizen,
 * Government, University, Industry).
 *
 * States:
 *   idle       → [ 📄 Download Report ]
 *   generating → [ ⏳ Generating Report... ]  (disabled, spinner)
 *   done       → brief success flash, then back to idle
 *
 * On success: triggers the PDF download via pdfReportService.
 * On error  : shows a toast; never crashes the page.
 */

import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { generateProblemReport } from '../../services/pdfReportService';
import type { Challenge } from '../../types';
import { useApp } from '../../context/AppContext';

interface DownloadReportButtonProps {
  challenge: Challenge;
  /** Optional: override button size/style for different placements */
  size?: 'sm' | 'md';
  /** Optional: additional className for outer wrapper */
  className?: string;
}

export const DownloadReportButton: React.FC<DownloadReportButtonProps> = ({
  challenge,
  size = 'sm',
  className = '',
}) => {
  const { showToast } = useApp();
  const [state, setState] = useState<'idle' | 'generating' | 'done'>('idle');

  const handleDownload = async () => {
    if (state !== 'idle') return;

    setState('generating');

    try {
      await generateProblemReport(challenge);
      setState('done');
      showToast('success', 'Report Downloaded', 'The PDF report has been generated and downloaded successfully.');
      // Reset after 2.5 s
      setTimeout(() => setState('idle'), 2500);
    } catch (err: any) {
      console.error('[DownloadReportButton] PDF generation failed:', err);
      setState('idle');
      showToast(
        'error',
        'PDF Generation Failed',
        err?.message || 'An error occurred while generating the report. Please try again.'
      );
    }
  };

  const isGenerating = state === 'generating';
  const isDone = state === 'done';

  const sizeClasses =
    size === 'sm'
      ? 'px-3.5 py-1.5 text-xs gap-1.5'
      : 'px-4 py-2 text-sm gap-2';

  const baseClasses = `
    inline-flex items-center font-bold rounded-xl border transition-all cursor-pointer select-none
    ${sizeClasses}
    ${isDone
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
      : isGenerating
      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed opacity-80'
      : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300 hover:border-amber-400 hover:text-amber-900 shadow-xs'
    }
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      className={baseClasses}
      title={isGenerating ? 'Generating PDF report...' : 'Download verified problem report as PDF'}
      aria-label="Download PDF Report"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
          <span>Generating Report...</span>
        </>
      ) : isDone ? (
        <>
          <FileDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>Report Downloaded ✓</span>
        </>
      ) : (
        <>
          <FileDown className="w-3.5 h-3.5 text-amber-600" />
          <span>Download Report</span>
        </>
      )}
    </button>
  );
};
