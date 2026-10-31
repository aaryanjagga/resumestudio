import React from 'react';
import { ResumeData } from '../types/resume';
import { ClassicATS } from './ClassicATS';
import { Modern } from './Modern';
import { Developer } from './Developer';
import { Executive } from './Executive';
import { Compact } from './Compact';
import { Editorial } from './Editorial';

interface TemplateRendererProps {
  data: ResumeData;
  accentColor?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ data, accentColor }) => {
  const activeColor = accentColor || data.accentColor || '#4338CA';

  switch (data.templateId) {
    case 'classic-ats':
      return <ClassicATS data={data} accentColor={activeColor} />;
    case 'modern':
      return <Modern data={data} accentColor={activeColor} />;
    case 'developer':
      return <Developer data={data} accentColor={activeColor} />;
    case 'executive':
      return <Executive data={data} accentColor={activeColor} />;
    case 'compact':
      return <Compact data={data} accentColor={activeColor} />;
    case 'editorial':
      return <Editorial data={data} accentColor={activeColor} />;
    default:
      return <ClassicATS data={data} accentColor={activeColor} />;
  }
};
