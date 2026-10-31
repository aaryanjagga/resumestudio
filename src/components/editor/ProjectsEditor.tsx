import React, { useState } from 'react';
import { ProjectItem } from '../../types/resume';
import { generateUUID } from '../../data/sampleResume';
import { Plus, Trash2, ArrowUp, ArrowDown, FolderGit2 } from 'lucide-react';
import { formatProjectLinkLabel } from '../../lib/linkUtils';

interface ProjectsEditorProps {
  items: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ items, onChange }) => {
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: generateUUID(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      urlLabel: '',
      role: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, updates: Partial<ProjectItem>) => {
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

  const handleAddTech = (projId: string) => {
    const input = techInput[projId]?.trim();
    if (!input) return;
    const proj = items.find((p) => p.id === projId);
    if (!proj) return;
    const splitted = input.split(',').map((s) => s.trim()).filter(Boolean);
    handleUpdate(projId, { technologies: [...proj.technologies, ...splitted] });
    setTechInput({ ...techInput, [projId]: '' });
  };

  const handleRemoveTech = (projId: string, techName: string) => {
    const proj = items.find((p) => p.id === projId);
    if (!proj) return;
    handleUpdate(projId, { technologies: proj.technologies.filter((t) => t !== techName) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Featured Projects</h2>
          <p className="text-xs text-slate-500">Showcase open-source repositories, client architectures, and products.</p>
        </div>
        <button
          onClick={handleAdd}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No project items added yet.</p>
          <button
            onClick={handleAdd}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            + Add your first project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((proj, index) => (
            <div
              key={proj.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">
                  {proj.name || 'New Project'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move project up"
                    aria-label="Move project up"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === items.length - 1}
                    title="Move project down"
                    aria-label="Move project down"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    title="Remove project"
                    aria-label="Remove project"
                    className="p-1 text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chronicle — Distributed Audit Engine"
                    value={proj.name}
                    onChange={(e) => handleUpdate(proj.id, { name: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Creator & Maintainer"
                    value={proj.role}
                    onChange={(e) => handleUpdate(proj.id, { role: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Project URL or Repository
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project"
                    value={proj.url}
                    onChange={(e) => handleUpdate(proj.id, { url: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Display Label on Resume (Masked)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GitHub, Live Demo, View Project"
                    value={proj.urlLabel || ''}
                    onChange={(e) => handleUpdate(proj.id, { urlLabel: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                {proj.url && (
                  <div className="sm:col-span-2 text-[10.5px] text-slate-500 flex items-center gap-1.5">
                    <span>Displays on resume as:</span>
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {formatProjectLinkLabel(proj.url, proj.urlLabel)} ↗
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Description & Impact
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description highlighting technical architecture and measurable performance..."
                  value={proj.description}
                  onChange={(e) => handleUpdate(proj.id, { description: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              {/* Technologies list */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {proj.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-800"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(proj.id, tech)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technology (e.g. Go, Docker) and press Enter..."
                    value={techInput[proj.id] || ''}
                    onChange={(e) => setTechInput({ ...techInput, [proj.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTech(proj.id);
                      }
                    }}
                    className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTech(proj.id)}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
