import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import {
  saveResume,
  getAllResumes,
  getResumeById,
  exportBackup,
  importBackup,
  wipeAllResumes,
  duplicateResume,
  deleteResume,
} from '../../src/lib/idb';
import { createSampleResume, createBlankResume } from '../../src/data/sampleResume';

describe('IndexedDB Repository & Backup Engine', () => {
  beforeEach(async () => {
    await wipeAllResumes();
  });

  it('saves and retrieves resumes properly', async () => {
    const sample = createSampleResume('modern');
    await saveResume(sample);

    const fetched = await getResumeById(sample.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(sample.id);
    expect(fetched?.personal.fullName).toBe('Alex Morgan');
    expect(fetched?.templateId).toBe('modern');
  });

  it('duplicates an existing resume with a distinct ID', async () => {
    const sample = createSampleResume('classic-ats');
    await saveResume(sample);

    const copy = await duplicateResume(sample.id);
    expect(copy.id).not.toBe(sample.id);
    expect(copy.title).toContain('(Copy)');

    const all = await getAllResumes();
    expect(all.length).toBe(2);
  });

  it('exports and restores JSON backup in merge mode without ID collisions', async () => {
    const resume1 = createSampleResume('developer');
    resume1.title = 'Dev Resume 1';
    await saveResume(resume1);

    const backupJson = await exportBackup();
    expect(backupJson).toContain('Resume Studio');
    expect(backupJson).toContain('Dev Resume 1');

    // Import again in merge mode: should handle existing duplicate ID by giving a new ID
    const importRes = await importBackup(backupJson, 'merge');
    expect(importRes.importedCount).toBe(1);

    const all = await getAllResumes();
    expect(all.length).toBe(2);
  });

  it('restores JSON backup in replace mode cleanly', async () => {
    const resume1 = createSampleResume('compact');
    await saveResume(resume1);

    const backupJson = await exportBackup();

    // Create another resume that should be replaced
    await saveResume(createBlankResume('To be wiped'));

    const importRes = await importBackup(backupJson, 'replace');
    expect(importRes.importedCount).toBe(1);

    const all = await getAllResumes();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe(resume1.id);
  });

  it('rejects malformed JSON strings during import', async () => {
    await expect(importBackup('not-json-content', 'merge')).rejects.toThrow();
  });
});
