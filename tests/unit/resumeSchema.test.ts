import { describe, it, expect } from 'vitest';
import { ResumeDataSchema, BackupFileSchema } from '../../src/types/resume';
import { createSampleResume, createBlankResume } from '../../src/data/sampleResume';

describe('Resume Data Schema & Defaults', () => {
  it('validates a pre-filled sample resume successfully', () => {
    const sample = createSampleResume('classic-ats');
    const result = ResumeDataSchema.safeParse(sample);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.personal.fullName).toBe('Alex Morgan');
      expect(result.data.experience.length).toBeGreaterThan(0);
      expect(result.data.skills.length).toBeGreaterThan(0);
    }
  });

  it('validates a blank resume with proper defaults', () => {
    const blank = createBlankResume('My Blank Resume', 'modern');
    const result = ResumeDataSchema.safeParse(blank);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('My Blank Resume');
      expect(result.data.templateId).toBe('modern');
      expect(result.data.personal.fullName).toBe('');
      expect(result.data.personal.linkedinLabel).toBe('');
      expect(result.data.personal.githubLabel).toBe('');
      expect(result.data.personal.websiteLabel).toBe('');
      expect(result.data.experience).toEqual([]);
    }
  });

  it('rejects invalid schema with missing required fields or bad types', () => {
    const invalid = {
      id: 12345, // should be string
      templateId: 'unknown-template-xyz',
    };
    const result = ResumeDataSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validates a backup file containing an array of resumes', () => {
    const sample = createSampleResume('executive');
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: 'Resume Studio' as const,
      resumes: [sample],
    };
    const result = BackupFileSchema.safeParse(backup);
    expect(result.success).toBe(true);
  });
});
