import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface PdfExportOptions {
  filename?: string;
  onProgress?: (progressPercent: number) => void;
}

/**
 * Sanitizes candidate name for filename generation
 */
export function formatPdfFilename(candidateName?: string, resumeTitle?: string): string {
  const base = candidateName?.trim() || resumeTitle?.trim() || 'Resume';
  const clean = base
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return `Resume_${clean || 'Document'}.pdf`;
}

const UNSUPPORTED_COLOR_FN_PREFIXES = [
  'oklch(',
  'oklab(',
  'color-mix(',
  'lab(',
  'lch(',
  'color(',
  'light-dark(',
];

/**
 * Creates a fast, memoized CSS color converter that converts modern CSS Color 4
 * functions (oklch, oklab, color-mix, lab, lch, color) into standard rgb()/rgba()
 * strings supported by html2canvas.
 */
function createRgbColorConverter() {
  const cache = new Map<string, string>();
  let ctx: CanvasRenderingContext2D | null = null;
  let helperEl: HTMLSpanElement | null = null;

  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      ctx = canvas.getContext('2d', { willReadFrequently: true });
    } catch {
      ctx = null;
    }

    try {
      helperEl = document.createElement('span');
      helperEl.style.position = 'fixed';
      helperEl.style.left = '-9999px';
      helperEl.style.top = '-9999px';
      helperEl.style.visibility = 'hidden';
      helperEl.style.pointerEvents = 'none';
      document.body.appendChild(helperEl);
    } catch {
      helperEl = null;
    }
  }

  const convert = (rawColor: string): string => {
    if (!rawColor) return rawColor;
    const trimmed = rawColor.trim();
    if (!trimmed || trimmed === 'none' || trimmed === 'transparent' || trimmed === 'inherit' || trimmed === 'currentColor') {
      return trimmed;
    }

    const cached = cache.get(trimmed);
    if (cached !== undefined) {
      return cached;
    }

    const lower = trimmed.toLowerCase();
    const hasUnsupported =
      UNSUPPORTED_COLOR_FN_PREFIXES.some((prefix) => lower.includes(prefix)) ||
      lower.includes('var(');

    if (!hasUnsupported && (lower.startsWith('rgb') || lower.startsWith('#') || lower.startsWith('hsl'))) {
      cache.set(trimmed, trimmed);
      return trimmed;
    }

    let resolved = trimmed;
    if (helperEl && typeof window !== 'undefined' && window.getComputedStyle) {
      try {
        helperEl.style.color = 'rgb(15, 23, 42)';
        helperEl.style.color = trimmed;
        const computed = window.getComputedStyle(helperEl).color;
        if (computed) {
          resolved = computed;
        }
      } catch {
        // ignore
      }
    }

    const resolvedLower = resolved.toLowerCase();
    if (
      !UNSUPPORTED_COLOR_FN_PREFIXES.some((prefix) => resolvedLower.includes(prefix)) &&
      (resolvedLower.startsWith('rgb') || resolvedLower.startsWith('#'))
    ) {
      cache.set(trimmed, resolved);
      return resolved;
    }

    if (ctx) {
      try {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = '#000000';
        ctx.fillStyle = resolved;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        const r = data[0];
        const g = data[1];
        const b = data[2];
        const a = data[3];
        const rgbResult =
          a === 0
            ? 'rgba(0, 0, 0, 0)'
            : a === 255
            ? `rgb(${r}, ${g}, ${b})`
            : `rgba(${r}, ${g}, ${b}, ${Number((a / 255).toFixed(3))})`;
        cache.set(trimmed, rgbResult);
        return rgbResult;
      } catch {
        // fallback below
      }
    }

    const fallback = 'rgb(15, 23, 42)';
    cache.set(trimmed, fallback);
    return fallback;
  };

  const cleanup = () => {
    if (helperEl && helperEl.parentNode) {
      helperEl.parentNode.removeChild(helperEl);
    }
  };

  return { convert, cleanup };
}

/**
 * Replaces all balanced-parenthesis calls to unsupported CSS Color 4 functions
 * (such as oklch(...), oklab(...), color-mix(...)) inside a CSS stylesheet or value string.
 */
export function sanitizeCssString(cssText: string, convertColor: (c: string) => string): string {
  if (!cssText) return cssText;

  // Strip CSS Color 4 gradient interpolation syntax like "in oklab" or "in oklch"
  let result = cssText.replace(/\s+in\s+(?:oklab|oklch|srgb|hsl|lab|lch)(?:\s+(?:shorter|longer|increasing|decreasing)\s+hue)?/gi, '');

  const fnRegex = /\b(?:oklch|oklab|color-mix|lab|lch|color|light-dark)\s*\(/gi;
  let match: RegExpExecArray | null;
  let cursor = 0;
  let output = '';

  while ((match = fnRegex.exec(result)) !== null) {
    const startIdx = match.index;
    if (startIdx < cursor) continue;

    output += result.slice(cursor, startIdx);

    // Find balanced closing parenthesis
    let depth = 0;
    let i = startIdx;
    let foundEnd = false;
    while (i < result.length) {
      const ch = result[i];
      if (ch === '(') {
        depth++;
      } else if (ch === ')') {
        depth--;
        if (depth === 0) {
          i++;
          foundEnd = true;
          break;
        }
      }
      i++;
    }

    if (foundEnd) {
      const fullCall = result.slice(startIdx, i);
      output += convertColor(fullCall);
      cursor = i;
      fnRegex.lastIndex = i;
    } else {
      output += result.slice(startIdx, match.index + match[0].length);
      cursor = match.index + match[0].length;
    }
  }

  output += result.slice(cursor);
  return output;
}

const COLOR_STYLE_PROPS = [
  'color',
  'background-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'column-rule-color',
  '-webkit-text-stroke-color',
] as const;

/**
 * Inlines RGB-converted computed color styles onto every element in the subtree
 * and removes shadows that might contain oklch variables.
 */
function inlineSanitizedColorsOnSubtree(
  root: HTMLElement,
  convertColor: (c: string) => string
): void {
  if (typeof window === 'undefined' || !window.getComputedStyle) return;

  const elements: HTMLElement[] = [
    root,
    ...Array.from(root.querySelectorAll<HTMLElement>('*')),
  ];

  for (const el of elements) {
    try {
      const cs = window.getComputedStyle(el);
      for (const prop of COLOR_STYLE_PROPS) {
        const val = cs.getPropertyValue(prop);
        if (val) {
          el.style.setProperty(prop, convertColor(val), 'important');
        }
      }
      const bgImg = cs.getPropertyValue('background-image');
      if (bgImg && bgImg !== 'none') {
        el.style.setProperty('background-image', sanitizeCssString(bgImg, convertColor), 'important');
      }
      el.style.setProperty('box-shadow', 'none', 'important');
      el.style.setProperty('text-shadow', 'none', 'important');
    } catch {
      // continue on individual node error
    }
  }
}

interface LinkAnnotationBox {
  url: string;
  xMm: number;
  yMm: number;
  wMm: number;
  hMm: number;
}

/**
 * Collects clickable link coordinates in millimeters (relative to the 210x297mm A4 sheet)
 * so the generated PDF has active clickable hyperlinks over every masked link.
 */
function collectLinkAnnotations(
  container: HTMLElement,
  widthPx: number,
  heightPx: number
): LinkAnnotationBox[] {
  const boxes: LinkAnnotationBox[] = [];
  const containerRect = container.getBoundingClientRect();
  if (!containerRect.width || !containerRect.height) return boxes;

  const scaleX = 210 / widthPx;
  const scaleY = 297 / heightPx;

  const anchors = container.querySelectorAll<HTMLAnchorElement>('a[href]');
  anchors.forEach((a) => {
    const href = a.getAttribute('href')?.trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    const rect = a.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const relX = rect.left - containerRect.left;
    const relY = rect.top - containerRect.top;
    if (relY < 0 || relY >= heightPx) return;

    boxes.push({
      url: href,
      xMm: Math.max(0, relX * scaleX),
      yMm: Math.max(0, relY * scaleY),
      wMm: Math.min(210, rect.width * scaleX),
      hMm: Math.min(297, rect.height * scaleY),
    });
  });

  return boxes;
}

/**
 * Client-side direct PDF generation and file download using html2canvas & jsPDF.
 * Renders the full A4 container from top (0mm) to bottom (297mm) with crisp resolution,
 * active hyperlinks, and Tailwind v4 oklch color sanitization.
 */
export async function generateAndDownloadPdf(
  targetElement?: HTMLElement | null,
  options: PdfExportOptions = {}
): Promise<void> {
  const element = targetElement || document.getElementById('resume-print-area');
  if (!element) {
    throw new Error('Resume preview element not found. Please ensure the preview is rendered.');
  }

  const filename = options.filename || 'Resume.pdf';
  options.onProgress?.(15);

  // Wait for web fonts to be ready
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // proceed even if font ready promise rejects
    }
  }
  options.onProgress?.(30);

  // Standard A4 dimensions at 96 DPI: 794px x 1123px (exact 210mm x 297mm)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  const { convert: convertColor, cleanup: cleanupColorConverter } = createRgbColorConverter();

  // Position container at (0, 0) behind the UI so getBoundingClientRect() has top=0, left=0
  // and the top section of the resume is never shifted or clipped.
  const offscreenContainer = document.createElement('div');
  offscreenContainer.style.position = 'fixed';
  offscreenContainer.style.left = '0px';
  offscreenContainer.style.top = '0px';
  offscreenContainer.style.width = `${A4_WIDTH_PX}px`;
  offscreenContainer.style.height = `${A4_HEIGHT_PX}px`;
  offscreenContainer.style.overflow = 'hidden';
  offscreenContainer.style.zIndex = '-9999';
  offscreenContainer.style.pointerEvents = 'none';
  offscreenContainer.style.background = '#ffffff';
  offscreenContainer.style.margin = '0';
  offscreenContainer.style.padding = '0';

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.height = `${A4_HEIGHT_PX}px`;
  clone.style.maxHeight = `${A4_HEIGHT_PX}px`;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.overflow = 'hidden';
  clone.style.display = 'block';
  clone.style.position = 'relative';
  clone.style.top = '0px';
  clone.style.left = '0px';
  clone.style.backgroundColor = '#ffffff';

  // Ensure any inner template container also fills exact 794x1123 without clipping the top
  const innerRoot = clone.firstElementChild as HTMLElement | null;
  if (innerRoot) {
    innerRoot.style.width = `${A4_WIDTH_PX}px`;
    innerRoot.style.height = `${A4_HEIGHT_PX}px`;
    innerRoot.style.maxHeight = `${A4_HEIGHT_PX}px`;
    innerRoot.style.margin = '0';
    innerRoot.style.transform = 'none';
    innerRoot.style.boxSizing = 'border-box';
  }

  // Remove any warning boundaries or no-print indicators from clone
  const noPrintElements = clone.querySelectorAll('.no-print');
  noPrintElements.forEach((el) => el.remove());

  offscreenContainer.appendChild(clone);
  document.body.appendChild(offscreenContainer);

  try {
    // Convert all computed oklch/oklab/color-mix styles on the live clone to standard RGB
    inlineSanitizedColorsOnSubtree(clone, convertColor);

    // Collect clickable link bounding boxes before rendering canvas
    const linkBoxes = collectLinkAnnotations(clone, A4_WIDTH_PX, A4_HEIGHT_PX);

    options.onProgress?.(50);

    // Collect and sanitize all CSS rules from the main document so the cloned iframe
    // has zero oklch/oklab/color-mix tokens in its stylesheets
    let combinedSanitizedCss = '';
    if (typeof document !== 'undefined' && document.styleSheets) {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = sheet.cssRules;
          if (rules) {
            for (const rule of Array.from(rules)) {
              combinedSanitizedCss += rule.cssText + '\n';
            }
          }
        } catch {
          // Cross-origin stylesheet (e.g. Google Fonts), skip rule extraction
        }
      }
    }
    if (combinedSanitizedCss) {
      combinedSanitizedCss = sanitizeCssString(combinedSanitizedCss, convertColor);
    }

    const canvas = await html2canvas(clone, {
      scale: 2, // 2x gives 1588px x 2246px crystal-clear text and lines
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      x: 0,
      y: 0,
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
        // Sanitize all <style> tags in the cloned document
        const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
        styleTags.forEach((styleTag) => {
          if (styleTag.textContent) {
            styleTag.textContent = sanitizeCssString(styleTag.textContent, convertColor);
          }
        });

        // If external stylesheets exist, replace local CSS links with sanitized inline style
        if (combinedSanitizedCss) {
          const linkTags = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'));
          linkTags.forEach((linkTag) => {
            const href = linkTag.getAttribute('href') || '';
            if (!href.includes('fonts.googleapis.com')) {
              linkTag.remove();
            }
          });
          const cleanStyle = clonedDoc.createElement('style');
          cleanStyle.textContent = combinedSanitizedCss;
          clonedDoc.head.appendChild(cleanStyle);
        }

        // Isolate clonedEl as the sole child of clonedDoc.body at (0, 0)
        // so no app header or scroll wrapper can cover or offset the top section
        clonedDoc.documentElement.style.cssText =
          `margin:0!important;padding:0!important;width:${A4_WIDTH_PX}px!important;height:${A4_HEIGHT_PX}px!important;background:#ffffff!important;color:#0f172a!important;overflow:hidden!important;`;
        clonedDoc.body.innerHTML = '';
        clonedDoc.body.className = '';
        clonedDoc.body.style.cssText =
          `margin:0!important;padding:0!important;width:${A4_WIDTH_PX}px!important;height:${A4_HEIGHT_PX}px!important;background:#ffffff!important;color:#0f172a!important;overflow:hidden!important;position:relative!important;`;

        clonedEl.style.position = 'absolute';
        clonedEl.style.top = '0px';
        clonedEl.style.left = '0px';
        clonedEl.style.margin = '0px';
        clonedEl.style.width = `${A4_WIDTH_PX}px`;
        clonedEl.style.height = `${A4_HEIGHT_PX}px`;
        clonedEl.style.maxHeight = `${A4_HEIGHT_PX}px`;
        clonedEl.style.transform = 'none';
        clonedEl.style.overflow = 'hidden';
        clonedEl.style.backgroundColor = '#ffffff';

        clonedDoc.body.appendChild(clonedEl);
      },
    });

    options.onProgress?.(80);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Exact A4 dimensions: 210mm x 297mm (strict single page)
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

    // Overlay clickable link annotations for all masked links on the resume
    if (typeof (pdf as any).link === 'function') {
      linkBoxes.forEach((box) => {
        try {
          (pdf as any).link(box.xMm, box.yMm, box.wMm, box.hMm, { url: box.url });
        } catch {
          // ignore annotation error if pdf mock doesn't implement .link
        }
      });
    }

    options.onProgress?.(95);
    pdf.save(filename);
    options.onProgress?.(100);
  } catch (error) {
    console.error('Failed to generate PDF with html2canvas/jsPDF:', error);
    throw new Error('Could not generate PDF file. Please try the "Print / Vector PDF" option.');
  } finally {
    cleanupColorConverter();
    if (document.body.contains(offscreenContainer)) {
      document.body.removeChild(offscreenContainer);
    }
  }
}

/**
 * Triggers native browser print dialog with candidate name in document.title
 * so browser default save filename matches candidate name.
 */
export function triggerBrowserPrint(title?: string): void {
  const originalTitle = typeof document !== 'undefined' ? document.title : '';
  if (title && typeof document !== 'undefined') {
    document.title = title.replace(/\.pdf$/i, '');
  }
  try {
    if (typeof window !== 'undefined') {
      window.print();
    }
  } finally {
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }
  }
}
