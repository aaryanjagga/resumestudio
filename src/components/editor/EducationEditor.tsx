import React from 'react';
import { EducationItem } from '../../types/resume';
import { generateUUID } from '../../data/sampleResume';
import { Plus, Trash2, ArrowUp, ArrowDown, GraduationCap } from 'lucide-react';

interface EducationEditorProps {
  items: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newItem: EducationItem = {
      id: generateUUID(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      honors: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, updates: Partial<EducationItem>) => {
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
          <h2 className="text-sm font-bold text-slate-900">Education</h2>
          <p className="text-xs text-slate-500">Degrees, academic institutions, and notable honors.</p>
        </div>
        <button
          onClick={handleAdd}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No education entries added yet.</p>
          <button
            onClick={handleAdd}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            + Add degree or qualification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((edu, index) => (
            <div
              key={edu.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">
                  {edu.institution || 'New Institution'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move education up"
                    aria-label="Move education up"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === items.length - 1}
                    title="Move education down"
                    aria-label="Move education down"
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id)}
                    title="Remove education"
                    aria-label="Remove education"
                    className="p-1 text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University"
                    value={edu.institution}
                    onChange={(e) => handleUpdate(edu.id, { institution: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Degree / Qualification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bachelor of Science"
                    value={edu.degree}
                    onChange={(e) => handleUpdate(edu.id, { degree: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleUpdate(edu.id, { fieldOfStudy: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY or YYYY-MM"
                    value={edu.startDate}
                    onChange={(e) => handleUpdate(edu.id, { startDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    End Date / Graduation
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY or YYYY-MM"
                    value={edu.endDate}
                    onChange={(e) => handleUpdate(edu.id, { endDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Honors / GPA / Distinctions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Magna Cum Laude · Dean's List"
                  value={edu.honors}
                  onChange={(e) => handleUpdate(edu.id, { honors: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
