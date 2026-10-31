import React from 'react';
import { ExperienceItem } from '../../types/resume';
import { generateUUID } from '../../data/sampleResume';
import { Plus, Trash2, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';

interface ExperienceEditorProps {
  items: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ items, onChange }) => {
  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: generateUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, updates: Partial<ExperienceItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
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

  const handleAddBullet = (expId: string) => {
    const exp = items.find((i) => i.id === expId);
    if (!exp) return;
    handleUpdate(expId, { bullets: [...exp.bullets, ''] });
  };

  const handleBulletChange = (expId: string, bulletIndex: number, text: string) => {
    const exp = items.find((i) => i.id === expId);
    if (!exp) return;
    const newBullets = [...exp.bullets];
    newBullets[bulletIndex] = text;
    handleUpdate(expId, { bullets: newBullets });
  };

  const handleRemoveBullet = (expId: string, bulletIndex: number) => {
    const exp = items.find((i) => i.id === expId);
    if (!exp) return;
    const newBullets = exp.bullets.filter((_, idx) => idx !== bulletIndex);
    handleUpdate(expId, { bullets: newBullets });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Work Experience</h2>
          <p className="text-xs text-slate-500">Chronological employment, responsibilities, and quantified achievements.</p>
        </div>
        <button
          onClick={handleAddExperience}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No work experience entries added yet.</p>
          <button
            onClick={handleAddExperience}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            + Add your first position
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4"
            >
              {/* Item Header Controls */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">
                  {exp.position || 'New Position'} {exp.company && `@ ${exp.company}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move position up"
                    aria-label="Move position up"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === items.length - 1}
                    title="Move position down"
                    aria-label="Move position down"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp.id)}
                    title="Remove position"
                    aria-label="Remove position"
                    className="p-1 text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Company & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={exp.company}
                    onChange={(e) => handleUpdate(exp.id, { company: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Job Title / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={exp.position}
                    onChange={(e) => handleUpdate(exp.id, { position: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. New York, NY / Remote"
                    value={exp.location}
                    onChange={(e) => handleUpdate(exp.id, { location: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              {/* Dates and Current */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM or Sep 2021"
                    value={exp.startDate}
                    onChange={(e) => handleUpdate(exp.id, { startDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM or Present"
                    value={exp.current ? 'Present' : exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => handleUpdate(exp.id, { endDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white disabled:bg-slate-100"
                  />
                </div>

                <div className="pt-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => handleUpdate(exp.id, { current: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium text-slate-700">Currently employed here</span>
                  </label>
                </div>
              </div>

              {/* Bullets & Achievements */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-baseline">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Achievements & Responsibilities (Bullets)
                  </label>
                  <span className="text-[10px] text-slate-400">Action verb + Context + Measurable result</span>
                </div>

                <div className="space-y-2">
                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-slate-400 text-xs mt-1.5">·</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        placeholder="e.g. Architected streaming data pipeline cutting 99th percentile latency by 35% across 20M requests..."
                        onChange={(e) => handleBulletChange(exp.id, bIdx, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white leading-normal"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(exp.id, bIdx)}
                        title="Remove bullet"
                        aria-label="Remove bullet"
                        className="text-slate-400 hover:text-red-600 p-1 mt-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddBullet(exp.id)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 pt-1 cursor-pointer"
                >
                  + Add another bullet point
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
