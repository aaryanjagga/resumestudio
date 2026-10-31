import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ResumeData, ResumeDataSchema, BackupFileSchema, BackupFile } from '../types/resume';
import { createSampleResume, generateUUID } from '../data/sampleResume';

const DB_NAME = 'resume_studio_db';
const DB_VERSION = 1;
const STORE_NAME = 'resumes';

interface ResumeStudioDB extends DBSchema {
  resumes: {
    key: string;
    value: ResumeData;
    indexes: {
      'by-updatedAt': string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<ResumeStudioDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<ResumeStudioDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ResumeStudioDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-updatedAt', 'updatedAt');
        }
      },
      blocked() {
        console.warn('Resume Studio IndexedDB upgrade blocked by older tab.');
      },
      blocking() {
        console.warn('Resume Studio IndexedDB blocking another connection.');
      },
    });
  }
  return dbPromise;
}

/**
 * Retrieves all saved resumes, ordered by last modified date descending.
 * If empty on first boot, seeds with a default sample resume so the user has an immediate starting point.
 */
export async function getAllResumes(): Promise<ResumeData[]> {
  try {
    const db = await getDB();
    const resumes = await db.getAllFromIndex(STORE_NAME, 'by-updatedAt');
    
    if (resumes.length === 0) {
      // First run: seed with one sample resume
      const defaultSample = createSampleResume('classic-ats');
      await db.put(STORE_NAME, defaultSample);
      return [defaultSample];
    }
    
    // Return sorted newest first
    return resumes.reverse();
  } catch (error) {
    console.error('Failed to load resumes from IndexedDB:', error);
    throw new Error('Could not access local storage. Please check if cookies/storage are enabled.');
  }
}

/**
 * Retrieves a single resume by its ID.
 */
export async function getResumeById(id: string): Promise<ResumeData | null> {
  try {
    const db = await getDB();
    const item = await db.get(STORE_NAME, id);
    if (!item) return null;
    
    // Ensure data conforms to schema
    const parsed = ResumeDataSchema.safeParse(item);
    if (!parsed.success) {
      console.warn('Resume schema warning:', parsed.error);
      return item as ResumeData;
    }
    return parsed.data;
  } catch (error) {
    console.error(`Failed to get resume ${id}:`, error);
    return null;
  }
}

/**
 * Saves or updates a resume document in IndexedDB.
 */
export async function saveResume(resume: ResumeData): Promise<ResumeData> {
  try {
    const db = await getDB();
    const updatedResume: ResumeData = {
      ...resume,
      updatedAt: new Date().toISOString(),
    };
    
    // Validate schema
    const validated = ResumeDataSchema.parse(updatedResume);
    await db.put(STORE_NAME, validated);
    return validated;
  } catch (error) {
    console.error('Failed to save resume to IndexedDB:', error);
    throw new Error('Failed to save resume locally. Storage may be full or blocked.');
  }
}

/**
 * Deletes a resume document by ID.
 */
export async function deleteResume(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  } catch (error) {
    console.error(`Failed to delete resume ${id}:`, error);
    throw new Error('Failed to delete resume.');
  }
}

/**
 * Duplicates an existing resume with a new ID and updated title.
 */
export async function duplicateResume(id: string): Promise<ResumeData> {
  const source = await getResumeById(id);
  if (!source) {
    throw new Error('Source resume not found to duplicate.');
  }
  
  const now = new Date().toISOString();
  const copy: ResumeData = {
    ...JSON.parse(JSON.stringify(source)),
    id: generateUUID(),
    title: `${source.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };
  
  return await saveResume(copy);
}

/**
 * Exports all resumes into a versioned JSON backup object.
 */
export async function exportBackup(): Promise<string> {
  const resumes = await getAllResumes();
  const backup: BackupFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'Resume Studio',
    resumes,
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Imports resumes from a JSON backup file with validation and duplicate protection.
 */
export async function importBackup(
  jsonText: string,
  mode: 'merge' | 'replace' = 'merge'
): Promise<{ importedCount: number }> {
  let parsedJson: any;
  try {
    parsedJson = JSON.parse(jsonText);
  } catch {
    throw new Error('Invalid JSON format. Please upload a valid JSON backup file.');
  }

  const validated = BackupFileSchema.safeParse(parsedJson);
  if (!validated.success) {
    // If not matching BackupFileSchema, check if it's an array of resumes or a single resume
    const singleResume = ResumeDataSchema.safeParse(parsedJson);
    if (singleResume.success) {
      await saveResume(singleResume.data);
      return { importedCount: 1 };
    }
    throw new Error('File does not match the Resume Studio backup schema.');
  }

  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  if (mode === 'replace') {
    await store.clear();
  }

  let count = 0;
  for (const item of validated.data.resumes) {
    // If merging and an item with the same ID already exists, generate a new ID to prevent accidental overwrite
    if (mode === 'merge') {
      const existing = await store.get(item.id);
      if (existing) {
        item.id = generateUUID();
        item.title = `${item.title} (Imported)`;
      }
    }
    await store.put(item);
    count++;
  }

  await tx.done;
  return { importedCount: count };
}

/**
 * Wipes all resumes from IndexedDB (with clear confirmation requirement in UI).
 */
export async function wipeAllResumes(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}
