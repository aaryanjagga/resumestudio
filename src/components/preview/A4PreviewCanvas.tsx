import React, { useRef, useState, useEffect } from 'react';
import { ResumeData, TemplateId } from '../../types/resume';
import { TemplateRenderer } from '../../templates/TemplateRenderer';
import { AlertTriangle, ZoomIn, ZoomOut, Maximize2, CheckCircle2, Download, Printer, Loader2 } from 'lucide-react';
import { ACCENT_COLORS } from '../../data/sampleResume';
import { TEMPLATES } from '../../templates/templateRegistry';

interface A4PreviewCanvasProps {
  resume: ResumeData;
  onUpdateResume?: (updated: ResumeData) => void;
  scale?: number;
  onScaleChange?: (scale: number) => void;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  onDownloadPdf?: () => void;
  onPrint?: () => void;
  isExportingPdf?: boolean;
}

export const A4PreviewCanvas: React.FC<A4PreviewCanvasProps> = ({
  resume,
  onUpdateResume,
  scale: externalScale,
  onScaleChange,
  previewRef,
  onDownloadPdf,
  onPrint,
  isExportingPdf = false,
}) => {
  const localRef = useRef<HTMLDivElement>(null);
  const containerRef = previewRef || localRef;
  const [internalScale, setInternalScale] = useState<number>(0.85);
  const scale = externalScale !== undefined ? externalScale : internalScale;
  const setScale = onScaleChange || setInternalScale;

  const [fillPercent, setFillPercent] = useState<number>(85);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  // A4 standard at 96 DPI: 210mm x 297mm ≈ 794px x 1123px
  const A4_HEIGHT_PX = 1123;

  useEffect(() => {
    const measureHeight = () => {
      if (containerRef.current) {
        // Measure first child (the template content) scrollHeight vs 1123px A4 limit
        const contentChild = containerRef.current.firstElementChild as HTMLElement | null;
        const actualHeight = contentChild ? contentChild.scrollHeight : containerRef.current.scrollHeight;
        const pct = Math.round((actualHeight / A4_HEIGHT_PX) * 100);
        setFillPercent(pct);
        setIsOverflowing(actualHeight > A4_HEIGHT_PX);
      }
    };

    measureHeight();
    const timeout = setTimeout(measureHeight, 200);
    return () => clearTimeout(timeout);
  }, [resume, containerRef]);

  const handleZoomIn = () => setScale(Math.min(1.3, Number((scale + 0.1).toFixed(2))));
  const handleZoomOut = () => setScale(Math.max(0.5, Number((scale - 0.1).toFixed(2))));
  const handleResetZoom = () => setScale(0.85);

  const handleTemplateSelect = (templateId: TemplateId) => {
    if (onUpdateResume) {
      onUpdateResume({ ...resume, templateId });
    }
  };

  const handleColorSelect = (hex: string) => {
    if (onUpdateResume) {
      onUpdateResume({ ...resume, accentColor: hex });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/90 border-l border-slate-200">
      {/* Top Preview Toolbar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 no-print">
        {/* Template & Color Dropdown / Quick Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="preview-template-select" className="text-slate-500 font-medium hidden sm:inline">Template:</label>
          <select
            id="preview-template-select"
            value={resume.templateId}
            onChange={(e) => handleTemplateSelect(e.target.value as TemplateId)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Color palette pickers */}
          <div className="flex items-center gap-1.5 ml-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleColorSelect(c.hex)}
                title={c.name}
                aria-label={`Select accent color ${c.name}`}
                className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                  resume.accentColor === c.hex ? 'ring-2 ring-offset-1 ring-slate-800 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* 1-Page Constraint Badge & Zoom Controls */}
        <div className="flex items-center gap-2.5">
          {/* Strict 1-Page Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-colors ${
              isOverflowing
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
            title="All templates and exports are strictly constrained to 1 single A4 page"
          >
            {isOverflowing ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>1-Page Limit ({fillPercent}%)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Strict 1-Page ({fillPercent}% used)</span>
              </>
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-50 rounded border border-slate-200 p-0.5">
            <button
              onClick={handleZoomOut}
              title="Zoom out"
              aria-label="Zoom out"
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-mono text-slate-600 tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom in"
              aria-label="Zoom in"
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset zoom"
              aria-label="Reset zoom"
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors ml-0.5 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Toolbar Print & Download buttons */}
          {(onPrint || onDownloadPdf) && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
              {onPrint && (
                <button
                  onClick={onPrint}
                  title="Print / Save Vector PDF via browser"
                  aria-label="Print resume"
                  className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              )}
              {onDownloadPdf && (
                <button
                  onClick={onDownloadPdf}
                  disabled={isExportingPdf}
                  title="Download crisp 1-page A4 PDF"
                  aria-label="Download PDF"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">PDF</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overflow Warning Bar if content exceeds single page */}
      {isOverflowing && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900 no-print animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Strict 1-Page Constraint:</strong> Document content occupies ~{fillPercent}% of page height. Overflowing items will be clipped to prevent a second page. Condense bullet points or toggle sections in Section Manager.
            </span>
          </div>
          {resume.templateId !== 'compact' && (
            <button
              onClick={() => handleTemplateSelect('compact')}
              className="text-[11px] font-semibold text-amber-800 underline hover:text-amber-950 shrink-0 ml-3 cursor-pointer"
            >
              Try Compact Template
            </button>
          )}
        </div>
      )}

      {/* A4 Canvas Scroll Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 preview-viewport-scroll">
        <div
          style={{
            width: `${Math.round(794 * scale)}px`,
            height: `${Math.round(1123 * scale)}px`,
          }}
          className="mx-auto relative preview-scale-outer"
        >
          {/* Scaled Document Container */}
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease-out',
            }}
            className="relative preview-scale-wrapper print:transform-none"
          >
            {/* Printable Resume Sheet: Strictly locked to 210mm x 297mm (1 Page A4) */}
            <div
              id="resume-print-area"
              ref={containerRef as any}
              className="w-[210mm] h-[297mm] max-h-[297mm] overflow-hidden bg-white text-slate-900 shadow-xl border border-slate-200/80 rounded-sm relative box-border"
            >
              <TemplateRenderer data={resume} accentColor={resume.accentColor} />

              {/* Visual Overflow Boundary Line if text extends beyond 1 page */}
              {isOverflowing && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 pointer-events-none no-print">
                  <span className="absolute right-2 bottom-2 bg-amber-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow">
                    1-Page Boundary
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
