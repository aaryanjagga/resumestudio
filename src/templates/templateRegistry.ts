import { TemplateId } from '../types/resume';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  bestFor: string;
  isSingleColumn: boolean;
  atsCompliant: boolean;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'classic-ats',
    name: 'Classic ATS',
    tagline: 'High-parser compliance with zero distraction',
    description: 'Clean single-column layout with standard headings, clear dates, and maximum readability across applicant tracking systems.',
    badge: 'Recommended for ATS',
    bestFor: 'Corporate roles, engineering, finance, government',
    isSingleColumn: true,
    atsCompliant: true,
  },
  {
    id: 'modern',
    name: 'Modern Clean',
    tagline: 'Contemporary balanced layout with subtle accents',
    description: 'A stylish presentation with balanced hierarchy, subtle color touches on section headers, and scannable bullet points.',
    badge: 'Versatile',
    bestFor: 'Tech companies, high-growth startups, consulting',
    isSingleColumn: false,
    atsCompliant: true,
  },
  {
    id: 'developer',
    name: 'Developer Tech',
    tagline: 'Engineered for software engineers & tech leads',
    description: 'Brings GitHub, technical skill taxonomies, and open-source project architecture to the forefront with monospace touches.',
    badge: 'Tech Focused',
    bestFor: 'Software engineers, DevOps, data engineers, architects',
    isSingleColumn: false,
    atsCompliant: true,
  },
  {
    id: 'executive',
    name: 'Executive Brief',
    tagline: 'Distinguished serif hierarchy for leaders',
    description: 'Commanding editorial presence with refined serif headings, strategic summary focus, and leadership achievement framing.',
    badge: 'Leadership',
    bestFor: 'Directors, VPs, executives, product leaders',
    isSingleColumn: true,
    atsCompliant: true,
  },
  {
    id: 'compact',
    name: 'Compact Density',
    tagline: 'High-density space optimization for 1-page fit',
    description: 'Carefully calculated padding and vertical rhythms designed to fit rich multi-year careers onto a single page cleanly without tiny fonts.',
    badge: 'Single Page',
    bestFor: '1-page targets, dense work histories, career pivots',
    isSingleColumn: true,
    atsCompliant: true,
  },
  {
    id: 'editorial',
    name: 'Editorial Journal',
    tagline: 'Sophisticated magazine typography and elegance',
    description: 'Elevated typographic layout with refined contrast, generous breathing room, and a memorable professional presence.',
    badge: 'Distinguished',
    bestFor: 'Designers, creative directors, researchers, academics',
    isSingleColumn: false,
    atsCompliant: true,
  },
];

export function getTemplateById(id: TemplateId): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
