import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ResumeData, TemplateId } from '../../types/resume';
import {
  getAllResumes,
  saveResume,
  deleteResume,
  duplicateResume,
  exportBackup,
  importBackup,
  wipeAllResumes,
} from '../../lib/idb';
import { createSampleResume, createBlankResume } from '../../data/sampleResume';
import { TEMPLATES } from '../../templates/templateRegistry';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import {
  Plus,
  Search,
  Copy,
  Trash2,
  Edit2,
  Download,
  Upload,
  HardDrive,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ResumeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState<boolean>(false);

  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [renameInput, setRenameInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Resume form state
  const [newTitle, setNewTitle] = useState<string>('My Resume');
  const [newTemplate, setNewTemplate] = useState<TemplateId>('classic-ats');
  const [newType, setNewType] = useState<'sample' | 'blank'>('sample');

  // Import backup state
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importError, setImportError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllResumes();
      setResumes(data);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Handle Create New Resume
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const freshResume =
        newType === 'sample'
          ? { ...createSampleResume(newTemplate), title: newTitle || 'Sample Resume' }
          : createBlankResume(newTitle || 'Untitled Resume', newTemplate);

      const saved = await saveResume(freshResume);
      setIsCreateModalOpen(false);
      navigate(`/editor/${saved.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create resume.');
    }
  };

  // Handle Rename
  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResume || !renameInput.trim()) return;
    try {
      const updated = { ...activeResume, title: renameInput.trim() };
      await saveResume(updated);
      setIsRenameModalOpen(false);
      showStatus('Resume renamed successfully.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to rename.');
    }
  };

  // Handle Duplicate
  const handleDuplicate = async (id: string) => {
    try {
      await duplicateResume(id);
      showStatus('Resume duplicated.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate.');
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!activeResume) return;
    try {
      await deleteResume(activeResume.id);
      setIsDeleteModalOpen(false);
      showStatus('Resume deleted.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete resume.');
    }
  };

  // Handle Backup Export
  const handleExportBackup = async () => {
    try {
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_Studio_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showStatus('Backup file downloaded.');
    } catch (err: any) {
      alert(err.message || 'Failed to export backup.');
    }
  };

  // Handle Backup Import
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    try {
      const result = await importBackup(importJsonText, importMode);
      setIsBackupModalOpen(false);
      setImportJsonText('');
      showStatus(`Successfully imported ${result.importedCount} resume(s)!`);
      loadData();
    } catch (err: any) {
      setImportError(err.message || 'Invalid backup data.');
    }
  };

  // Handle File Upload for Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  // Handle Wipe
  const handleWipeConfirm = async () => {
    try {
      await wipeAllResumes();
      setIsWipeModalOpen(false);
      showStatus('All local resume data has been cleared.');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to wipe data.');
    }
  };

  // Filtered resumes
  const filteredResumes = resumes.filter((r) => {
    const matchesQuery =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personal.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personal.headline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTemplate =
      selectedTemplateFilter === 'all' || r.templateId === selectedTemplateFilter;
    return matchesQuery && matchesTemplate;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onNewResume={() => setIsCreateModalOpen(true)} showNewButton={true} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Your Resumes
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Stored locally on your device in IndexedDB. Instant access, offline ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import JSON</span>
            </button>
            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Backup JSON</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Resume</span>
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search resumes by title, name, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label htmlFor="dashboard-template-filter" className="text-xs text-slate-500 font-medium">Template:</label>
            <select
              id="dashboard-template-filter"
              value={selectedTemplateFilter}
              onChange={(e) => setSelectedTemplateFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Templates ({resumes.length})</option>
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resume Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            Loading your local resumes...
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-12">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {searchQuery ? 'No resumes match your search' : 'No resumes saved yet'}
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              {searchQuery
                ? 'Try clearing the search query or changing the template filter.'
                : 'Create your first professional resume using one of our 6 minimalist templates.'}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-sm cursor-pointer"
            >
              + Create New Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => {
              const template = TEMPLATES.find((t) => t.id === resume.templateId) || TEMPLATES[0];
              const updatedDate = new Date(resume.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={resume.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Card Header & Color Stripe */}
                  <div className="h-2 w-full" style={{ backgroundColor: resume.accentColor || '#4338CA' }} />

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Template & Date badge */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {template.name}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {updatedDate}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">
                        {resume.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium line-clamp-1">
                        {resume.personal.fullName || 'Untitled Candidate'}
                        {resume.personal.headline && ` · ${resume.personal.headline}`}
                      </p>

                      {/* Brief statistics */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-500">
                        <span>{resume.experience?.length || 0} positions</span>
                        <span>·</span>
                        <span>{resume.skills?.length || 0} skill groups</span>
                        <span>·</span>
                        <span>{resume.projects?.length || 0} projects</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setActiveResume(resume);
                            setRenameInput(resume.title);
                            setIsRenameModalOpen(true);
                          }}
                          title="Rename resume"
                          aria-label={`Rename ${resume.title}`}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(resume.id)}
                          title="Duplicate resume"
                          aria-label={`Duplicate ${resume.title}`}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveResume(resume);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Delete resume"
                          aria-label={`Delete ${resume.title}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Link
                        to={`/editor/${resume.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Open Studio</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Local Storage & Wipe Data Info Banner */}
        <div className="mt-12 p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">IndexedDB Local Storage</h4>
              <p className="text-[11px] text-slate-500">
                Resumes never leave your device. Download a JSON backup before clearing browser data.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWipeModalOpen(true)}
            className="text-xs text-red-600 hover:text-red-800 font-semibold underline cursor-pointer"
          >
            Clear all local resume data
          </button>
        </div>
      </main>

      {/* Modal: Create Resume */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Resume</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resume Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer 2026"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Content
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setNewType('sample')}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer ${
                      newType === 'sample'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>Pre-filled Sample</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      Realistic profile to edit
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('blank')}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer ${
                      newType === 'blank'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>Blank Resume</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      Start with empty fields
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="create-modal-template-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose Template
                </label>
                <select
                  id="create-modal-template-select"
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value as TemplateId)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.tagline}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 cursor-pointer"
                >
                  Create Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rename Resume */}
      {isRenameModalOpen && activeResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Rename Resume</h3>
            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Resume Confirmation */}
      {isDeleteModalOpen && activeResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Delete Resume?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>"{activeResume.title}"</strong>? This will permanently remove it from your browser's local storage.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Keep Resume
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import Backup JSON */}
      {isBackupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-slate-900">Import Resumes (JSON)</h3>
              <button
                onClick={() => setIsBackupModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Backup File (.json)
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Paste JSON Text
                </label>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste exported Resume Studio JSON here..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Import Strategy
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer bg-slate-50">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                    />
                    <span>Merge (Keep existing)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer bg-slate-50">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                    />
                    <span>Replace All</span>
                  </label>
                </div>
              </div>

              {importError && (
                <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                  {importError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBackupModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!importJsonText.trim()}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
                >
                  Restore Resumes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Wipe Confirmation */}
      {isWipeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Clear All Local Resumes?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This action will delete all resumes stored in this browser’s IndexedDB database.
              Make sure you have downloaded a JSON backup if you wish to retain your resumes.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsWipeModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleWipeConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 cursor-pointer"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
