/**
 * pdfReportService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a professional multi-page PDF report for a JH Innovation Connect
 * challenge/problem. Built programmatically with jsPDF (not an HTML screenshot).
 *
 * Features:
 *  - Dark navy header bar on every page (matching reference PDF)
 *  - Selectable text throughout
 *  - Evidence images with aspect-ratio preservation
 *  - Graceful handling of missing/broken images
 *  - Page numbers and footer on every page
 *  - Chronological timeline section
 *  - All sections conditional (only shown when data exists)
 */

import jsPDF from 'jspdf';
import type { Challenge } from '../types';

// ─── Color palette ────────────────────────────────────────────────────────────
const COL = {
  navy:     [15, 32, 68]   as [number, number, number],
  navyMid:  [22, 48, 90]   as [number, number, number],
  white:    [255, 255, 255] as [number, number, number],
  slate50:  [248, 250, 252] as [number, number, number],
  slate100: [241, 245, 249] as [number, number, number],
  slate200: [226, 232, 240] as [number, number, number],
  slate500: [100, 116, 139] as [number, number, number],
  slate700: [51,  65,  85]  as [number, number, number],
  slate900: [15,  23,  42]  as [number, number, number],
  amber400: [251, 191, 36]  as [number, number, number],
  amber500: [245, 158, 11]  as [number, number, number],
  emerald600:[5, 150, 105]  as [number, number, number],
  emerald50: [236, 253, 245] as [number, number, number],
  indigo50:  [238, 242, 255] as [number, number, number],
  indigo700: [67, 56, 202]  as [number, number, number],
  rose50:    [255, 241, 242] as [number, number, number],
  rose700:   [190, 18, 60]  as [number, number, number],
};

// ─── Page constants ───────────────────────────────────────────────────────────
const PAGE_W = 210; // A4 mm width
const PAGE_H = 297; // A4 mm height
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 16;
const FOOTER_H = 12;
const CONTENT_TOP = HEADER_H + 8;
const CONTENT_BOTTOM = PAGE_H - FOOTER_H - 6;

// ─── Helper: load image URL as base64 ─────────────────────────────────────────
async function loadImageAsBase64(url: string): Promise<string | null> {
  if (!url || url.startsWith('blob:') || !url.startsWith('http')) return null;
  try {
    const resp = await fetch(url, { mode: 'cors' });
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── Helper: detect image format ──────────────────────────────────────────────
function detectFormat(base64: string): 'JPEG' | 'PNG' | 'WEBP' {
  if (base64.includes('data:image/png')) return 'PNG';
  if (base64.includes('data:image/webp')) return 'WEBP';
  return 'JPEG';
}

// ─── Helper: format date ──────────────────────────────────────────────────────
function fmtDate(d?: string | null): string {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── PDF Generator class ──────────────────────────────────────────────────────
class PDFGenerator {
  private pdf: jsPDF;
  private pageNum = 1;
  private totalPages = 0; // filled in at end via addPageNumbers
  private y = CONTENT_TOP; // current Y cursor
  private generatedAt: string;

  constructor() {
    this.pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    this.generatedAt = new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  // ── Header bar (drawn on every page) ──────────────────────────────────────
  private drawHeader() {
    const pdf = this.pdf;
    // Navy background
    pdf.setFillColor(...COL.navy);
    pdf.rect(0, 0, PAGE_W, HEADER_H, 'F');

    // Left: JH INNOVATION CONNECT
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...COL.amber400);
    pdf.text('JH INNOVATION CONNECT', MARGIN, 10.5);

    // Right: portal tagline
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.setTextColor(180, 195, 215);
    pdf.text('Societal Innovation Collaboration Portal', PAGE_W - MARGIN, 10.5, { align: 'right' });
  }

  // ── Footer (drawn on every page) ─────────────────────────────────────────
  private drawFooter(pageNum: number) {
    const pdf = this.pdf;
    const y = PAGE_H - FOOTER_H + 2;

    pdf.setDrawColor(...COL.slate200);
    pdf.setLineWidth(0.3);
    pdf.line(MARGIN, y - 2, PAGE_W - MARGIN, y - 2);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6);
    pdf.setTextColor(...COL.slate500);
    pdf.text('JH Innovation Connect  •  Connecting Community Problems with Innovation', MARGIN, y + 2);
    pdf.text(`Page ${pageNum}`, PAGE_W - MARGIN, y + 2, { align: 'right' });
    pdf.text(`Generated: ${this.generatedAt}`, PAGE_W / 2, y + 2, { align: 'center' });
  }

  // ── Add a new page ─────────────────────────────────────────────────────────
  private newPage() {
    this.pdf.addPage();
    this.pageNum++;
    this.y = CONTENT_TOP;
    this.drawHeader();
  }

  // ── Ensure Y has enough space, else new page ───────────────────────────────
  private ensureSpace(needed: number) {
    if (this.y + needed > CONTENT_BOTTOM) {
      this.newPage();
    }
  }

  // ── Section heading ────────────────────────────────────────────────────────
  private sectionHeading(num: number, title: string) {
    this.ensureSpace(14);
    const pdf = this.pdf;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(...COL.navy);
    pdf.text(`${num}. ${title}`, MARGIN, this.y);
    this.y += 6;
    // Accent underline
    pdf.setDrawColor(...COL.amber500);
    pdf.setLineWidth(0.8);
    pdf.line(MARGIN, this.y - 2, MARGIN + 60, this.y - 2);
    this.y += 2;
  }

  // ── Simple two-column table row ────────────────────────────────────────────
  private tableRow(label: string, value: string, shade: boolean) {
    if (!value || value === '—' || value.trim() === '') return;
    this.ensureSpace(8);
    const pdf = this.pdf;
    const rowH = 7;
    const labelW = 52;

    if (shade) {
      pdf.setFillColor(...COL.slate50);
      pdf.rect(MARGIN, this.y - 4.5, CONTENT_W, rowH, 'F');
    }

    // Border
    pdf.setDrawColor(...COL.slate200);
    pdf.setLineWidth(0.2);
    pdf.rect(MARGIN, this.y - 4.5, CONTENT_W, rowH, 'S');

    // Label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...COL.slate500);
    pdf.text(label, MARGIN + 2, this.y);

    // Value
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COL.slate900);
    const maxW = CONTENT_W - labelW - 4;
    const lines = pdf.splitTextToSize(value, maxW);
    pdf.text(lines[0] || '', MARGIN + labelW, this.y);

    this.y += rowH;
  }

  // ── Status badge pill ──────────────────────────────────────────────────────
  private badge(text: string, x: number, y: number, color: [number,number,number], bg: [number,number,number]) {
    const pdf = this.pdf;
    const w = pdf.getTextWidth(text) + 5;
    pdf.setFillColor(...bg);
    pdf.roundedRect(x, y - 3.5, w, 5.5, 1, 1, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(...color);
    pdf.text(text, x + 2.5, y);
  }

  // ── Wrapped text block ─────────────────────────────────────────────────────
  private textBlock(text: string, fontSize = 8, color: [number,number,number] = COL.slate700, indent = 0) {
    if (!text) return;
    const pdf = this.pdf;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(fontSize);
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(text, CONTENT_W - indent);
    const lineH = fontSize * 0.45;
    for (const line of lines) {
      this.ensureSpace(lineH + 2);
      pdf.text(line, MARGIN + indent, this.y);
      this.y += lineH + 1.5;
    }
  }

  // ── Horizontal rule ────────────────────────────────────────────────────────
  private hr(gap = 4) {
    this.y += gap / 2;
    this.pdf.setDrawColor(...COL.slate100);
    this.pdf.setLineWidth(0.2);
    this.pdf.line(MARGIN, this.y, PAGE_W - MARGIN, this.y);
    this.y += gap / 2;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN GENERATOR
  // ─────────────────────────────────────────────────────────────────────────
  async generate(challenge: Challenge): Promise<Uint8Array> {
    const pdf = this.pdf;

    // Page 1: draw header
    this.drawHeader();
    this.y = CONTENT_TOP + 4;

    // ── Title area ───────────────────────────────────────────────────────────
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(...COL.slate900);
    pdf.text('Verified Problem Report', PAGE_W / 2, this.y + 2, { align: 'center' });
    this.y += 9;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COL.slate500);
    pdf.text(
      'Community-submitted challenge record with location, priority, evidence and tracking information.',
      PAGE_W / 2, this.y, { align: 'center' }
    );
    this.y += 8;

    // ── Tracking ID / Status info box ────────────────────────────────────────
    pdf.setFillColor(...COL.slate50);
    pdf.setDrawColor(...COL.slate200);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(MARGIN, this.y - 3, CONTENT_W, 12, 1.5, 1.5, 'FD');

    const trackingId = challenge.trackingId || challenge.id;
    const col1X = MARGIN + 4;
    const col2X = MARGIN + 55;
    const col3X = MARGIN + 120;
    const col4X = MARGIN + 150;
    const rowY = this.y + 4.5;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(...COL.slate500);
    pdf.text('TRACKING ID', col1X, rowY - 2.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...COL.navy);
    pdf.text(trackingId, col2X, rowY - 0.5);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(...COL.slate500);
    pdf.text('STATUS', col3X, rowY - 2.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...COL.emerald600);
    pdf.text(challenge.status || 'Validated', col4X, rowY - 0.5);

    this.y += 14;

    // ── SECTION 1: Challenge Overview ────────────────────────────────────────
    this.sectionHeading(1, 'Challenge Overview');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(...COL.slate900);
    const titleLines = pdf.splitTextToSize(challenge.title || 'Untitled Problem Report', CONTENT_W);
    for (const line of titleLines) {
      this.ensureSpace(8);
      pdf.text(line, MARGIN, this.y);
      this.y += 6;
    }
    this.y += 1;

    // Description with highlight (key words bold via color)
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COL.slate700);
    const descLines = pdf.splitTextToSize(challenge.description || 'No description provided.', CONTENT_W);
    for (const line of descLines) {
      this.ensureSpace(6);
      pdf.text(line, MARGIN, this.y);
      this.y += 4.5;
    }
    this.y += 3;

    // Info table
    let rowAlt = false;
    const infoRows: [string, string][] = [
      ['Domain', challenge.category || '—'],
      ['Sub-domain', challenge.subCategory || challenge.aiAnalysis?.subCategory || '—'],
      ['Urgency', challenge.urgency || '—'],
      ['Frequency', challenge.frequency || '—'],
      ['Affected population', (challenge.affectedPopulation || 0).toLocaleString() + ' people'],
      ['Current stage', challenge.currentStage || challenge.status || '—'],
      ['Reported date', fmtDate(challenge.submittedAt)],
    ];
    for (const [label, value] of infoRows) {
      if (value && value !== '—') {
        this.tableRow(label, value, rowAlt);
        rowAlt = !rowAlt;
      }
    }
    this.y += 4;

    // ── SECTION 2: Location ───────────────────────────────────────────────────
    this.sectionHeading(2, 'Location');
    rowAlt = false;
    const locationRows: [string, string][] = [
      ['District', challenge.district || '—'],
      ['Block', challenge.block || '—'],
      ['Village / Ward', challenge.village || '—'],
      ['Coordinates',
        challenge.gpsCoordinates && challenge.gpsCoordinates.lat
          ? `${Number(challenge.gpsCoordinates.lat).toFixed(6)}, ${Number(challenge.gpsCoordinates.lng).toFixed(6)}`
          : '—'
      ],
      ['State', 'Jharkhand'],
    ];
    for (const [label, value] of locationRows) {
      if (value && value !== '—') {
        this.tableRow(label, value, rowAlt);
        rowAlt = !rowAlt;
      }
    }
    this.y += 4;

    // ── SECTION 3: Reporter Information ───────────────────────────────────────
    this.sectionHeading(3, 'Reporter Information');
    rowAlt = false;
    const reporterRows: [string, string][] = [
      ['Reported by', challenge.submittedBy?.userName || '—'],
      ['Reporter role', challenge.submittedBy?.userRole?.replace(/_/g, ' ') || '—'],
      ['Organization', challenge.submittedBy?.organization || '—'],
    ];
    for (const [label, value] of reporterRows) {
      if (value && value !== '—') {
        this.tableRow(label, value, rowAlt);
        rowAlt = !rowAlt;
      }
    }
    this.y += 4;

    // ── SECTION 4: Expected Impact ────────────────────────────────────────────
    if (challenge.expectedImpact) {
      this.sectionHeading(4, 'Expected Impact');
      pdf.setFillColor(...COL.slate50);
      pdf.setDrawColor(...COL.slate200);
      pdf.setLineWidth(0.2);
      const impactLines = pdf.splitTextToSize(challenge.expectedImpact, CONTENT_W - 8);
      const impactH = impactLines.length * 4.5 + 6;
      this.ensureSpace(impactH);
      pdf.roundedRect(MARGIN, this.y - 3, CONTENT_W, impactH, 1.5, 1.5, 'FD');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...COL.slate700);
      for (const line of impactLines) {
        pdf.text(line, MARGIN + 4, this.y + 1.5);
        this.y += 4.5;
      }
      this.y += 6;
    }

    // ── PAGE 2: Evidence & Verification ──────────────────────────────────────
    this.newPage();

    // Section 5: Evidence & Verification
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(...COL.slate900);
    pdf.text('4. Evidence & Verification', PAGE_W / 2, this.y + 2, { align: 'center' });
    this.y += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COL.slate500);
    pdf.text(
      'Evidence section for the challenge record. Images below are the original citizen-uploaded photographs.',
      PAGE_W / 2, this.y, { align: 'center' }
    );
    this.y += 8;

    const validImages = (challenge.evidence || []).filter(
      (ev) => ev.type === 'image' && ev.url && !ev.url.startsWith('blob:') && ev.url.startsWith('http')
    );

    if (validImages.length === 0) {
      // No evidence placeholder
      this.ensureSpace(30);
      pdf.setFillColor(...COL.slate100);
      pdf.setDrawColor(...COL.slate200);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(MARGIN, this.y - 2, CONTENT_W, 28, 2, 2, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(...COL.slate500);
      pdf.text('No evidence images available for this challenge.', PAGE_W / 2, this.y + 12, { align: 'center' });
      this.y += 32;
    } else {
      // Load and render images
      for (let i = 0; i < Math.min(validImages.length, 4); i++) {
        const ev = validImages[i];
        this.ensureSpace(75);

        // Label bar
        pdf.setFillColor(...COL.navy);
        pdf.rect(MARGIN, this.y - 2, CONTENT_W, 8, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(...COL.white);
        pdf.text(
          `EVIDENCE ${i + 1}${ev.isGeotagged ? '  |  GEOTAGGED' : ''}`,
          MARGIN + 3, this.y + 3
        );
        if (ev.caption) {
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(180, 195, 215);
          pdf.text(ev.caption, PAGE_W - MARGIN - 3, this.y + 3, { align: 'right' });
        }
        this.y += 8;

        // Image area
        const imgH = 60;
        const base64 = await loadImageAsBase64(ev.url);
        if (base64 && base64.length > 100) {
          try {
            const fmt = detectFormat(base64);
            pdf.addImage(base64, fmt, MARGIN, this.y, CONTENT_W, imgH, '', 'FAST');
          } catch {
            // Render broken image placeholder
            pdf.setFillColor(...COL.slate100);
            pdf.rect(MARGIN, this.y, CONTENT_W, imgH, 'F');
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(7);
            pdf.setTextColor(...COL.slate500);
            pdf.text('Image could not be rendered.', PAGE_W / 2, this.y + imgH / 2, { align: 'center' });
          }
        } else {
          pdf.setFillColor(...COL.slate100);
          pdf.rect(MARGIN, this.y, CONTENT_W, imgH, 'F');
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7);
          pdf.setTextColor(...COL.slate500);
          pdf.text('Image unavailable or could not be loaded.', PAGE_W / 2, this.y + imgH / 2, { align: 'center' });
        }
        this.y += imgH + 2;

        // GPS caption if available
        if (ev.gpsCoordinates) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(6.5);
          pdf.setTextColor(...COL.slate500);
          pdf.text(
            `📍 GPS: ${ev.gpsCoordinates.lat.toFixed(6)}° N, ${ev.gpsCoordinates.lng.toFixed(6)}° E${ev.geotagLocation ? '  |  ' + ev.geotagLocation : ''}`,
            MARGIN, this.y + 2
          );
          this.y += 6;
        }
        this.y += 4;
      }
    }

    // Evidence status table
    this.ensureSpace(24);
    this.y += 2;
    rowAlt = false;
    const evidenceStatRows: [string, string][] = [
      ['Evidence status', (challenge.evidence || []).length > 0 ? 'Evidence Submitted' : 'No Evidence'],
      ['Number of artifacts', String((challenge.evidence || []).length)],
      ['Photo evidence', validImages.length > 0 ? `${validImages.length} image(s) in challenge-evidence storage` : 'None'],
      ['Video evidence', (challenge.evidence || []).some(e => e.type === 'video') ? 'Available in challenge-evidence storage' : 'None'],
    ];
    for (const [label, value] of evidenceStatRows) {
      this.tableRow(label, value, rowAlt);
      rowAlt = !rowAlt;
    }
    this.y += 6;

    // ── SECTION 5: Tracking & Workflow ────────────────────────────────────────
    this.ensureSpace(50);
    this.sectionHeading(5, 'Tracking & Workflow');

    const timelineStatuses = [
      { stage: 'Challenge submitted', done: true },
      { stage: 'Evidence submitted', done: (challenge.evidence || []).length > 0 },
      { stage: 'Validation / review', done: challenge.trustStatus === 'Verified' || challenge.status !== 'Submitted' },
      { stage: 'Government verification', done: challenge.trustStatus === 'Verified' },
      { stage: 'Institutional assignment', done: !!(challenge.assignedUniversityId || challenge.assignedUniversityName) },
      { stage: 'Solution project', done: ['In Development', 'Pilot', 'Implemented', 'Impact Measured'].includes(challenge.status) },
    ];

    // Table header
    this.ensureSpace(8);
    pdf.setFillColor(...COL.navy);
    pdf.rect(MARGIN, this.y - 4, CONTENT_W, 7, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...COL.white);
    pdf.text('Stage', MARGIN + 3, this.y);
    pdf.text('Status', MARGIN + 110, this.y);
    this.y += 5;

    rowAlt = false;
    for (const row of timelineStatuses) {
      this.ensureSpace(7);
      if (rowAlt) {
        pdf.setFillColor(...COL.slate50);
        pdf.rect(MARGIN, this.y - 4, CONTENT_W, 6.5, 'F');
      }
      pdf.setDrawColor(...COL.slate200);
      pdf.setLineWidth(0.15);
      pdf.rect(MARGIN, this.y - 4, CONTENT_W, 6.5, 'S');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      if (row.done) {
        pdf.setTextColor(...COL.slate700);
      } else {
        pdf.setTextColor(...COL.slate500);
      }
      pdf.text(row.stage, MARGIN + 3, this.y);

      if (row.done) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...COL.emerald600);
        pdf.text('Completed', MARGIN + 110, this.y);
      } else {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...COL.slate500);
        pdf.text('Pending', MARGIN + 110, this.y);
      }
      this.y += 6.5;
      rowAlt = !rowAlt;
    }
    this.y += 6;

    // ── PAGE 3: Government Verification & Assignments ─────────────────────────
    this.newPage();

    // Section 6: Government Verification
    this.sectionHeading(6, 'Government Verification');

    const isVerified = challenge.trustStatus === 'Verified';
    this.ensureSpace(22);

    if (isVerified) {
      pdf.setFillColor(...COL.emerald50);
      pdf.setDrawColor(...COL.emerald600);
    } else {
      pdf.setFillColor(...COL.slate50);
      pdf.setDrawColor(...COL.slate200);
    }
    pdf.setLineWidth(0.4);
    pdf.roundedRect(MARGIN, this.y - 3, CONTENT_W, 18, 1.5, 1.5, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    if (isVerified) { pdf.setTextColor(...COL.emerald600); } else { pdf.setTextColor(...COL.slate500); }
    pdf.text(
      isVerified ? '✓  Government Verification: VERIFIED' : '⏳  Government Verification: PENDING',
      MARGIN + 5, this.y + 6
    );

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    if (isVerified) { pdf.setTextColor(...COL.emerald600); } else { pdf.setTextColor(...COL.slate500); }
    pdf.text(
      isVerified
        ? 'This problem has been officially validated by Government of Jharkhand state authorities.'
        : 'This problem is awaiting official review and verification by Government authorities.',
      MARGIN + 5, this.y + 12
    );
    this.y += 22;

    rowAlt = false;
    const govRows: [string, string][] = [
      ['Verification status', challenge.trustStatus || 'Under Review'],
      ['Problem status', challenge.status || '—'],
      ['Current lifecycle stage', challenge.currentStage || '—'],
      ['Trust level', challenge.trustStatus || 'Community Report'],
    ];

    // Get verification timeline entry
    const verEntry = (challenge.timeline || []).find(t =>
      (t.stage || '').toLowerCase().includes('verif') ||
      (t.stage || '').toLowerCase().includes('validat')
    );
    if (verEntry) {
      govRows.push(['Verification date', fmtDate(verEntry.date)]);
      govRows.push(['Verified by', verEntry.actor || 'Government Authority']);
      if (verEntry.description) govRows.push(['Remarks', verEntry.description]);
    }

    for (const [label, value] of govRows) {
      if (value && value !== '—') {
        this.tableRow(label, value, rowAlt);
        rowAlt = !rowAlt;
      }
    }
    this.y += 6;

    // ── SECTION 7: University / Industry Assignment ───────────────────────────
    if (challenge.assignedUniversityName || challenge.expressionsOfInterest?.length) {
      this.sectionHeading(7, 'University Assignment');
      rowAlt = false;
      const uniRows: [string, string][] = [
        ['Assigned university', challenge.assignedUniversityName || '—'],
        ['Faculty lead', challenge.assignedFacultyName || '—'],
        ['Assignment date', fmtDate(challenge.officialAssignment?.assignedDate)],
        ['Attempt number', challenge.officialAssignment?.attemptNumber ? String(challenge.officialAssignment.attemptNumber) : '—'],
        ['Assignment status', challenge.officialAssignment?.status || '—'],
      ];
      for (const [label, value] of uniRows) {
        if (value && value !== '—') {
          this.tableRow(label, value, rowAlt);
          rowAlt = !rowAlt;
        }
      }

      if ((challenge.expressionsOfInterest || []).length > 0 && !challenge.assignedUniversityName) {
        this.y += 2;
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(7.5);
        pdf.setTextColor(...COL.slate500);
        pdf.text(
          `${challenge.expressionsOfInterest!.length} university/universities have submitted expressions of interest.`,
          MARGIN, this.y
        );
        this.y += 6;
      }
      this.y += 4;
    }

    // Industry submissions
    if ((challenge.industrySubmissions || []).length > 0) {
      this.sectionHeading(8, 'Industry / CSR Participation');
      const submissions = challenge.industrySubmissions!;
      for (const sub of submissions.slice(0, 3)) {
        this.ensureSpace(28);
        pdf.setFillColor(...COL.indigo50);
        pdf.setDrawColor(200, 210, 240);
        pdf.setLineWidth(0.2);
        pdf.roundedRect(MARGIN, this.y - 3, CONTENT_W, 25, 1.5, 1.5, 'FD');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(...COL.indigo700);
        pdf.text(sub.industryName, MARGIN + 4, this.y + 2);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(...COL.slate700);
        pdf.text(sub.solutionTitle, MARGIN + 4, this.y + 7);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(...COL.slate500);
        const sumLines = pdf.splitTextToSize(sub.summary, CONTENT_W - 12);
        pdf.text(sumLines[0] || '', MARGIN + 4, this.y + 12);
        pdf.text(`Status: ${sub.status}  |  Timeline: ${sub.timelineEstimate || '—'}  |  Budget: ${sub.budgetOrCsrCommitment || '—'}`, MARGIN + 4, this.y + 18);

        this.y += 28;
      }
      this.y += 4;
    }

    // ── SECTION 9: Timeline ───────────────────────────────────────────────────
    if ((challenge.timeline || []).length > 0) {
      this.ensureSpace(20);
      this.sectionHeading(9, 'Official Activity Timeline');

      const timelineEntries = challenge.timeline.slice(0, 12);
      for (const entry of timelineEntries) {
        this.ensureSpace(14);
        // Dot
        pdf.setFillColor(...COL.emerald600);
        pdf.circle(MARGIN + 2.5, this.y - 1, 1.8, 'F');
        // Line
        pdf.setDrawColor(...COL.slate200);
        pdf.setLineWidth(0.3);
        pdf.line(MARGIN + 2.5, this.y + 1.5, MARGIN + 2.5, this.y + 8);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.setTextColor(...COL.slate900);
        pdf.text(entry.stage, MARGIN + 7, this.y);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6.5);
        pdf.setTextColor(...COL.slate500);
        pdf.text(fmtDate(entry.date) + (entry.actor ? `  •  ${entry.actor}` : ''), MARGIN + 7, this.y + 4);

        if (entry.description) {
          pdf.setFontSize(6.5);
          pdf.setTextColor(...COL.slate500);
          const dLines = pdf.splitTextToSize(entry.description, CONTENT_W - 10);
          pdf.text(dLines[0] || '', MARGIN + 7, this.y + 8);
          this.y += 13;
        } else {
          this.y += 10;
        }
      }
      this.y += 4;
    }

    // ── SECTION 10: Report Summary ────────────────────────────────────────────
    this.ensureSpace(40);
    this.sectionHeading(10, 'Report Summary');

    pdf.setFillColor(...COL.slate50);
    pdf.setDrawColor(...COL.slate200);
    pdf.setLineWidth(0.3);
    const summaryH = 32;
    pdf.roundedRect(MARGIN, this.y - 3, CONTENT_W, summaryH, 1.5, 1.5, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...COL.slate500);
    pdf.text('PROBLEM STATUS', MARGIN + 4, this.y + 2);
    pdf.text('VERIFICATION', MARGIN + 55, this.y + 2);
    pdf.text('RESPONSIBLE ORGANIZATION', MARGIN + 110, this.y + 2);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...COL.slate900);
    pdf.text(challenge.status || '—', MARGIN + 4, this.y + 8);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    if (isVerified) { pdf.setTextColor(...COL.emerald600); } else { pdf.setTextColor(...COL.slate500); }
    pdf.text(isVerified ? 'VERIFIED' : 'PENDING', MARGIN + 55, this.y + 8);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...COL.slate900);
    const responsible = challenge.assignedUniversityName || 'Awaiting Assignment';
    pdf.text(responsible.length > 28 ? responsible.substring(0, 28) + '…' : responsible, MARGIN + 110, this.y + 8);

    pdf.setDrawColor(...COL.slate200);
    pdf.setLineWidth(0.2);
    pdf.line(MARGIN + 4, this.y + 11, MARGIN + CONTENT_W - 4, this.y + 11);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...COL.slate500);
    pdf.text('CURRENT STAGE', MARGIN + 4, this.y + 16);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...COL.slate700);
    pdf.text(challenge.currentStage || challenge.status || '—', MARGIN + 4, this.y + 22);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...COL.slate500);
    pdf.text('AFFECTED POPULATION', MARGIN + 110, this.y + 16);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...COL.slate700);
    pdf.text((challenge.affectedPopulation || 0).toLocaleString() + ' people', MARGIN + 110, this.y + 22);

    this.y += summaryH + 6;

    // ── Draw footers on all pages ─────────────────────────────────────────────
    const numPages = this.pdf.getNumberOfPages();
    for (let p = 1; p <= numPages; p++) {
      this.pdf.setPage(p);
      this.drawFooter(p);
    }

    return this.pdf.output('arraybuffer') as unknown as Uint8Array;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function generateProblemReport(challenge: Challenge): Promise<void> {
  const gen = new PDFGenerator();
  const buffer = await gen.generate(challenge);

  // Trigger browser download
  const blob = new Blob([buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const trackingId = (challenge.trackingId || challenge.id).replace(/[^a-zA-Z0-9-]/g, '');
  link.download = `JH-Innovation-Connect-Problem-${trackingId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

