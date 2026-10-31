import React from 'react';
import { SectionId } from '../../types/resume';
import { ArrowUp, ArrowDown, Eye, EyeOff, GripVertical } from 'lucide-react';

interface SectionManagerProps {
  sectionOrder: SectionId[];
  sectionVisibility: Record<SectionId, boolean>;
  onChangeOrder: (newOrder: SectionId[]) => void;
  onToggleVisibility: (sectionId: SectionId) => void;
}

const SECTION_LABELS: Record<SectionId, { title: string; desc: string }> = {
  summary: { title: 'Professional Summary', desc: 'Brief introductory career positioning' },
  experience: { title: 'Work Experience', desc: 'Chronological employment and bullet points' },
  skills: { title: 'Technical Skills', desc: 'Categorized competencies and tools' },
  projects: { title: 'Featured Projects', desc: 'Repositories, products, and architectures' },
  education: { title: 'Academic Education', desc: 'Degrees, institutions, and honors' },
  certifications: { title: 'Certifications', desc: 'Accreditations and credential links' },
};

export const SectionManager: React.FC<SectionManagerProps> = ({
  sectionOrder,
  sectionVisibility,
  onChangeOrder,
  onToggleVisibility,
}) => {
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sectionOrder.length - 1)
    ) {
      return;
    }
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    onChangeOrder(newOrder);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Section Organization & Visibility</h2>
        <p className="text-xs text-slate-500">
          Reorder sections or hide optional sections without deleting their data.
        </p>
      </div>

      <div className="space-y-2">
        {sectionOrder.map((sectionId, index) => {
          const isVisible = sectionVisibility[sectionId];
          const info = SECTION_LABELS[sectionId] || { title: sectionId, desc: '' };

          return (
            <div
              key={sectionId}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                isVisible
                  ? 'bg-white border-slate-200'
                  : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{info.title}</h4>
                  <p className="text-[11px] text-slate-500">{info.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleVisibility(sectionId)}
                  title={isVisible ? 'Hide section from resume' : 'Show section on resume'}
                  aria-label={isVisible ? `Hide ${info.title}` : `Show ${info.title}`}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    isVisible
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                </button>

                {/* Move Up / Down */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move section up"
                    aria-label={`Move ${info.title} up`}
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-200" />
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === sectionOrder.length - 1}
                    title="Move section down"
                    aria-label={`Move ${info.title} down`}
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
