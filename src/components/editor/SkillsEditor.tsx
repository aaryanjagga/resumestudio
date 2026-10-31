import React, { useState } from 'react';
import { SkillCategory } from '../../types/resume';
import { generateUUID } from '../../data/sampleResume';
import { Plus, Trash2, X, Wrench } from 'lucide-react';

interface SkillsEditorProps {
  categories: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ categories, onChange }) => {
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: generateUUID(),
      name: 'New Category',
      skills: [],
    };
    onChange([...categories, newCat]);
  };

  const handleUpdateCategoryName = (id: string, name: string) => {
    onChange(categories.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const handleDeleteCategory = (id: string) => {
    onChange(categories.filter((c) => c.id !== id));
  };

  const handleAddSkillToCategory = (catId: string, skillText: string) => {
    const trimmed = skillText.trim();
    if (!trimmed) return;

    // split if comma separated
    const parts = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;

    const merged = Array.from(new Set([...cat.skills, ...parts]));
    onChange(categories.map((c) => (c.id === catId ? { ...c, skills: merged } : c)));
    setNewSkillInput({ ...newSkillInput, [catId]: '' });
  };

  const handleRemoveSkill = (catId: string, skillToRemove: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    onChange(
      categories.map((c) =>
        c.id === catId ? { ...c, skills: c.skills.filter((s) => s !== skillToRemove) } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Skills & Competencies</h2>
          <p className="text-xs text-slate-500">Group skills by domain (e.g. Languages, Cloud, Frameworks, Tools).</p>
        </div>
        <button
          onClick={handleAddCategory}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill Group</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No skill groups configured.</p>
          <button
            onClick={handleAddCategory}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            + Create your first skill group
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Backend Architecture)"
                  value={cat.name}
                  onChange={(e) => handleUpdateCategoryName(cat.id, e.target.value)}
                  className="font-bold text-xs text-slate-900 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  title="Remove group"
                  aria-label="Remove group"
                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Skills Tags list */}
              <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-slate-50 rounded-lg border border-slate-150">
                {cat.skills.length === 0 ? (
                  <span className="text-[11px] text-slate-400 italic">No skills in this group yet.</span>
                ) : (
                  cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white text-slate-800 border border-slate-200 shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(cat.id, skill)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a skill and press Enter or comma..."
                  value={newSkillInput[cat.id] || ''}
                  onChange={(e) => setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddSkillToCategory(cat.id, newSkillInput[cat.id] || '');
                    }
                  }}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkillToCategory(cat.id, newSkillInput[cat.id] || '')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
