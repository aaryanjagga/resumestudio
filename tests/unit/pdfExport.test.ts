import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatPdfFilename,
  triggerBrowserPrint,
  generateAndDownloadPdf,
  sanitizeCssString,
} from '../../src/lib/pdfExport';

describe('PDF Export & Print Utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('formats clean PDF filenames based on candidate name and resume title', () => {
    expect(formatPdfFilename('Alex Morgan', 'Software Engineer')).toBe('Resume_Alex_Morgan.pdf');
    expect(formatPdfFilename('', 'Frontend Specialist 2026')).toBe('Resume_Frontend_Specialist_2026.pdf');
    expect(formatPdfFilename('Jane & John / Doe @ Tech!', '')).toBe('Resume_Jane_John_Doe_Tech.pdf');
    expect(formatPdfFilename('', '')).toBe('Resume_Resume.pdf');
  });

  it('triggers browser window.print with custom document title formatting', () => {
    vi.useFakeTimers();
    const printSpy = vi.fn();
    window.print = printSpy;
    document.title = 'Resume Studio';
    const initialTitle = document.title;

    triggerBrowserPrint('Alex_Morgan_Resume.pdf');
    expect(printSpy).toHaveBeenCalledTimes(1);
    expect(document.title).toBe('Alex_Morgan_Resume');

    // Restores original title after timer
    vi.advanceTimersByTime(1100);
    expect(document.title).toBe(initialTitle);
  });

  it('sanitizes Tailwind v4 oklch and nested color-mix functions into standard RGB strings', () => {
    const sampleCss = `
      .text-slate-900 { color: oklch(0.208 0.042 265.755); }
      .bg-indigo-500\\/80 { background-color: color-mix(in oklab, oklch(0.585 0.233 277.117) 80%, transparent); }
      .gradient { background-image: linear-gradient(to right in oklab, oklch(0.5 0.2 260), oklch(0.7 0.1 200)); }
    `;
    const sanitized = sanitizeCssString(sampleCss, () => 'rgb(15, 23, 42)');
    expect(sanitized).not.toContain('oklch(');
    expect(sanitized).not.toContain('color-mix(');
    expect(sanitized).not.toContain('in oklab');
    expect(sanitized).toContain('color: rgb(15, 23, 42);');
    expect(sanitized).toContain('background-color: rgb(15, 23, 42);');
  });

  it('rejects generateAndDownloadPdf when target element is not provided and not in DOM', async () => {
    await expect(generateAndDownloadPdf(null)).rejects.toThrow(
      'Resume preview element not found. Please ensure the preview is rendered.'
    );
  });
});

