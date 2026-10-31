import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ResumeData, SectionId, TemplateId } from '../../types/resume';
import { getResumeById, saveResume } from '../../lib/idb';
import { generateAndDownloadPdf, triggerBrowserPrint, formatPdfFilename } from '../../lib/pdfExport';
import { A4PreviewCanvas } from '../../components/preview/A4PreviewCanvas';
import { PersonalInfoEditor } from '../../components/editor/PersonalInfoEditor';
import { ExperienceEditor } from '../../components/editor/ExperienceEditor';
import { EducationEditor } from '../../components/editor/EducationEditor';
import { SkillsEditor } from '../../components/editor/SkillsEditor';
import { ProjectsEditor } from '../../components/editor/ProjectsEditor';
import { CertificationsEditor } from '../../components/editor/CertificationsEditor';
import { SectionManager } from '../../components/editor/SectionManager';
import {
  ArrowLeft,
  Download,
  Printer,
  Check,
  Loader2,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Layers,
  AlertCircle,
} from 'lucide-react';

type EditorTab =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'sections';

export const ResumeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [activeTab, setActiveTab] = useState<EditorTab>('personal');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const previewSheetRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load resume from IndexedDB on mount
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getResumeById(id);
        if (!data) {
          navigate('/resumes', { replace: true });
          return;
        }
        setResume(data);
        setLastSavedTime(new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate]);

  // Debounced autosave
  const triggerAutosave = useCallback((updated: ResumeData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveResume(updated);
        setSaving(false);
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (e) {
        console.error('Autosave failed:', e);
        setSaving(false);
      }
    }, 500);
  }, []);

  const handleUpdateResume = (updated: ResumeData) => {
    setResume(updated);
    triggerAutosave(updated);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!resume) return;
    const updated = { ...resume, title: newTitle };
    handleUpdateResume(updated);
  };

  // Direct client-side PDF download
  const handleDownloadPdf = async () => {
    if (!resume) return;
    try {
      setIsExportingPdf(true);
      setExportNotice('Generating crisp A4 PDF...');
      const filename = formatPdfFilename(resume.personal.fullName, resume.title);
      await generateAndDownloadPdf(previewSheetRef.current, { filename });
      setExportNotice('PDF downloaded successfully!');
      setTimeout(() => setExportNotice(null), 3000);
    } catch (err: any) {
      setExportNotice(err.message || 'Export error. Try Print option.');
      setTimeout(() => setExportNotice(null), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Browser-native vector print
  const handleBrowserPrint = () => {
    if (!resume) return;
    const filename = formatPdfFilename(resume.personal.fullName, resume.title);
    triggerBrowserPrint(filename);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <p className="text-xs font-medium text-slate-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl border border-slate-200">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h2 className="text-sm font-bold text-slate-900 mb-1">Resume Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">The requested resume does not exist in local storage.</p>
          <Link
            to="/resumes"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const navTabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: 'Personal', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { id: 'certifications', label: 'Certs', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'sections', label: 'Sections', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden print:!h-auto print:!overflow-visible print:!block print:!bg-white">
      {/* Top Studio Control Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-30 no-print">
        <div className="flex items-center gap-3">
          <Link
            to="/resumes"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Back to Resumes Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resume.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-sm font-bold text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 py-1 rounded max-w-xs transition-colors"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 pl-2 border-l border-slate-200">
            {saving ? (
              <span className="flex items-center gap-1 text-indigo-600">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="w-3 h-3" />
                <span>Saved {lastSavedTime && `at ${lastSavedTime}`}</span>
              </span>
            )}
          </div>
        </div>

        {/* Mobile View Toggle (Editor vs Preview) */}
        <div className="flex lg:hidden items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setMobileView('editor')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              mobileView === 'editor' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              mobileView === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Dual Export Actions */}
        <div className="flex items-center gap-2">
          {exportNotice && (
            <span className="hidden md:inline-block text-xs font-semibold text-indigo-600 animate-pulse mr-2">
              {exportNotice}
            </span>
          )}

          <button
            onClick={handleBrowserPrint}
            title="Open browser print dialog for 100% vector layout"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Print / Vector PDF</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Grid (Left: Tabs & Forms, Right: A4 Preview) */}
      <div className="flex-1 flex overflow-hidden print:!block print:!overflow-visible print:!h-auto">
        {/* Left Form Editor Panel */}
        <div
          className={`w-full lg:w-[48%] flex flex-col bg-white border-r border-slate-200 no-print print:!hidden ${
            mobileView === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Sub-Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 px-3 bg-slate-50/70 scrollbar-none shrink-0 no-print">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {activeTab === 'personal' && (
              <PersonalInfoEditor
                data={resume.personal}
                onChange={(updated) => handleUpdateResume({ ...resume, personal: updated })}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceEditor
                items={resume.experience}
                onChange={(updated) => handleUpdateResume({ ...resume, experience: updated })}
              />
            )}

            {activeTab === 'education' && (
              <EducationEditor
                items={resume.education}
                onChange={(updated) => handleUpdateResume({ ...resume, education: updated })}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsEditor
                categories={resume.skills}
                onChange={(updated) => handleUpdateResume({ ...resume, skills: updated })}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsEditor
                items={resume.projects}
                onChange={(updated) => handleUpdateResume({ ...resume, projects: updated })}
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsEditor
                items={resume.certifications}
                onChange={(updated) => handleUpdateResume({ ...resume, certifications: updated })}
              />
            )}

            {activeTab === 'sections' && (
              <SectionManager
                sectionOrder={resume.sectionOrder}
                sectionVisibility={resume.sectionVisibility}
                onChangeOrder={(newOrder) => handleUpdateResume({ ...resume, sectionOrder: newOrder })}
                onToggleVisibility={(sectionId) =>
                  handleUpdateResume({
                    ...resume,
                    sectionVisibility: {
                      ...resume.sectionVisibility,
                      [sectionId]: !resume.sectionVisibility[sectionId],
                    },
                  })
                }
              />
            )}
          </div>
        </div>

        {/* Right A4 Preview Canvas Panel */}
        <div
          className={`flex-1 flex flex-col overflow-hidden print:!flex print:!visible print:!h-auto print:!overflow-visible ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <A4PreviewCanvas
            resume={resume}
            onUpdateResume={handleUpdateResume}
            previewRef={previewSheetRef}
            onDownloadPdf={handleDownloadPdf}
            onPrint={handleBrowserPrint}
            isExportingPdf={isExportingPdf}
          />
        </div>
      </div>
    </div>
  );
};
