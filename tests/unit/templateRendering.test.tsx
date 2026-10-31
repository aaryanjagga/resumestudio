import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { createSampleResume, createBlankResume } from '../../src/data/sampleResume';
import { TemplateRenderer } from '../../src/templates/TemplateRenderer';
import { TemplateId } from '../../src/types/resume';
import { TEMPLATES } from '../../src/templates/templateRegistry';

describe('Resume Template Renders', () => {
  const sample = createSampleResume();
  const allTemplates: TemplateId[] = [
    'classic-ats',
    'modern',
    'developer',
    'executive',
    'compact',
    'editorial',
  ];

  it('renders all 6 templates with candidate name without error', () => {
    allTemplates.forEach((templateId) => {
      const { container } = render(
        <TemplateRenderer data={{ ...sample, templateId }} />
      );
      expect(container.textContent).toContain('Alex Morgan');
      expect(container.textContent).toContain('Vanguard Systems');
      expect(container.textContent).toContain('Staff Software Engineer');
    });
  });

  it('handles empty / missing fields gracefully across all templates', () => {
    const blank = createBlankResume('Blank Resume');
    allTemplates.forEach((templateId) => {
      const { container } = render(
        <TemplateRenderer data={{ ...blank, templateId }} />
      );
      expect(container).toBeDefined();
    });
  });

  it('preserves all registry definitions for 6 templates', () => {
    expect(TEMPLATES.length).toBe(6);
    allTemplates.forEach((id) => {
      const found = TEMPLATES.find((t) => t.id === id);
      expect(found).toBeDefined();
      expect(found?.name).toBeDefined();
    });
  });

  it('masks raw LinkedIn URLs into clean "LinkedIn" text while preserving active hrefs across all templates', () => {
    allTemplates.forEach((templateId) => {
      const { container } = render(
        <TemplateRenderer data={{ ...sample, templateId }} />
      );
      // Find anchor elements
      const links = container.querySelectorAll('a');
      const linkedinAnchor = Array.from(links).find((a) =>
        a.getAttribute('href')?.includes('linkedin.com/in/alex-morgan-lead')
      );

      expect(linkedinAnchor).toBeDefined();
      expect(linkedinAnchor?.getAttribute('href')).toBe('https://www.linkedin.com/in/alex-morgan-lead');
      // The displayed text should NOT be the raw URL https://www.linkedin.com/in/alex-morgan-lead
      expect(linkedinAnchor?.textContent).not.toContain('https://www.linkedin.com');
      expect(linkedinAnchor?.textContent).toContain('LinkedIn');
    });
  });

  it('enforces strict single-page A4 height constraints on all 6 templates', () => {
    allTemplates.forEach((templateId) => {
      const { container } = render(
        <TemplateRenderer data={{ ...sample, templateId }} />
      );
      const rootDiv = container.firstElementChild as HTMLElement;
      expect(rootDiv).toBeDefined();
      expect(rootDiv.className).toContain('w-[210mm]');
      expect(rootDiv.className).toContain('h-[297mm]');
      expect(rootDiv.className).toContain('max-h-[297mm]');
      expect(rootDiv.className).toContain('overflow-hidden');
    });
  });
});
