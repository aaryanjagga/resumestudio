import React from 'react';
import { CertificationItem } from '../../types/resume';
import { generateUUID } from '../../data/sampleResume';
import { Plus, Trash2, ArrowUp, ArrowDown, Award } from 'lucide-react';
import { formatCertificationLinkLabel } from '../../lib/linkUtils';

interface CertificationsEditorProps {
  items: CertificationItem[];
  onChange: (updated: CertificationItem[]) => void;
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newItem: CertificationItem = {
      id: generateUUID(),
      name: '',
      issuer: '',
      issueDate: '',
      url: '',
      urlLabel: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, updates: Partial<CertificationItem>) => {
    onChange(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onChange(newItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Certifications & Licenses</h2>
          <p className="text-xs text-slate-500">Accreditations, technical certifications, and verification links.</p>
        </div>
        <button
          onClick={handleAdd}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No certifications listed.</p>
          <button
            onClick={handleAdd}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            + Add a credential or license
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((cert, index) => (
            <div
              key={cert.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">
                  {cert.name || 'New Certification'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move certification up"
                    aria-label="Move certification up"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === items.length - 1}
                    title="Move certification down"
                    aria-label="Move certification down"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cert.id)}
                    title="Remove certification"
                    aria-label="Remove certification"
                    className="p-1 text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Certified Solutions Architect"
                    value={cert.name}
                    onChange={(e) => handleUpdate(cert.id, { name: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) => handleUpdate(cert.id, { issuer: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM"
                    value={cert.issueDate}
                    onChange={(e) => handleUpdate(cert.id, { issueDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Credential URL / Verification Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={cert.url}
                    onChange={(e) => handleUpdate(cert.id, { url: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Display Label on Resume (Masked)
                  </label>
                  <input
                    type="text"
                    placeholder="Verify Credential"
                    value={cert.urlLabel || ''}
                    onChange={(e) => handleUpdate(cert.id, { urlLabel: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div className="flex items-center text-[10.5px] text-slate-500">
                  {cert.url ? (
                    <div className="flex items-center gap-1.5 pt-3 sm:pt-0">
                      <span>Displays on resume as:</span>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        {formatCertificationLinkLabel(cert.url, cert.urlLabel)} ↗
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic pt-3 sm:pt-0">
                      Add a URL above to show a masked verification link on your resume.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
