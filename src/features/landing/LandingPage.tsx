import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { TEMPLATES } from '../../templates/templateRegistry';
import { createSampleResume } from '../../data/sampleResume';
import { TemplateRenderer } from '../../templates/TemplateRenderer';
import { TemplateId } from '../../types/resume';
import {
  ShieldCheck,
  HardDrive,
  Printer,
  Sparkles,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
  Layers,
  Lock,
  Download,
  Eye,
  Sliders,
  Palette,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<TemplateId>('classic-ats');
  const sampleResume = createSampleResume(activePreviewTemplate);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar showNewButton={true} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Quiet kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-tracking · 100% Local in your browser</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              The Minimalist, <br className="hidden sm:inline" />
              <span className="text-indigo-600">Local-First</span> Resume Studio
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Build, refine, and export professional resumes directly on your device.
              No account creation, no cloud database, no paywalls, and no hidden subscriptions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/resumes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Create Your Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#templates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>Explore 6 Templates</span>
              </a>
            </div>

            {/* Micro social proof / specs */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Applicant Tracking System (ATS) Friendly
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                A4 Vector PDF & Instant Download
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                IndexedDB Auto-Saving
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Template Showcase */}
      <section id="templates" className="py-20 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Six Tailored Resume Formats
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Each template consumes the exact same validated data model. Switch formats at any moment without retyping content.
            </p>
          </div>

          {/* Template Selection Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActivePreviewTemplate(t.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activePreviewTemplate === t.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Interactive Document Preview Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl border border-slate-200/90 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold">
                  {TEMPLATES.find((t) => t.id === activePreviewTemplate)?.name}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">
                  {TEMPLATES.find((t) => t.id === activePreviewTemplate)?.tagline}
                </span>
              </div>
              <Link
                to="/resumes"
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Edit This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Document Scaled Container */}
            <div className="p-4 sm:p-8 bg-slate-200/60 overflow-x-auto flex justify-center">
              <div
                style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}
                className="w-[210mm] bg-white shadow-lg border border-slate-200 shrink-0"
              >
                <TemplateRenderer data={sampleResume} accentColor={sampleResume.accentColor} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Engineered for Speed, Privacy & Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to craft high-conversion job applications with peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">IndexedDB Persistence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Edits are debounced and autosaved directly in your browser's IndexedDB engine. Survives page reloads, browser restarts, and offline disconnects.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Dual PDF Export</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose between instant 1-click client-side PDF file download or native browser vector printing for pixel-perfect typography.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Custom Accent Palettes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Personalize any of the 6 templates with curated palettes: Deep Indigo, Modern Slate, Classic Navy, Forest Emerald, Crimson, and Warm Charcoal.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Strict 1-Page Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All 6 templates and exports are strictly constrained to 1 single A4 page. Live capacity metering ensures your resume never spills onto an accidental second page.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Section Control & Reordering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reorder any section up or down and hide optional sections (like Projects or Certifications) without deleting underlying data.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">JSON Backup & Migration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export all resumes as a versioned JSON file at any time. Restore on any computer or browser with smart duplicate resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee Section */}
      <section id="privacy" className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Local-First Privacy Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Your career history belongs to you.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlike cloud resume builders that monetize candidate data, store profiles in unencrypted remote databases, or hold your PDFs hostage behind subscription paywalls, Resume Studio executes completely inside your browser sandbox.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2.5 text-xs text-slate-300 sm:shrink-0 w-full md:w-72">
              <div className="font-bold text-white text-sm mb-1">Guarantees</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero backend transmission</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No tracking or advertising cookies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No required login or credit card</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
