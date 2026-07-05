import fs from 'fs/promises';
import path from 'path';

// Define the root data path. Adjust if running from different directories.
// In dev, 'backend' is the cwd or parent depending on how it's run.
const DATA_DIR = path.join(process.cwd(), '../data');

export async function ensureDataDirExists() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Intentionally swallowed for robust startup
  }
}

export async function readJson<T>(filename: string, defaultValue: T): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return defaultValue;
    }
    throw err;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  await ensureDataDirExists();
  const filePath = path.join(DATA_DIR, filename);
  const tempFilePath = `${filePath}.tmp`;
  await fs.writeFile(tempFilePath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempFilePath, filePath);
}

import { StorageAdapter } from '../StorageAdapter.js';

export class LocalJsonAdapter<T extends { id: string }> implements StorageAdapter<T> {
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  async getAll(): Promise<T[]> {
    return readJson<T[]>(this.filename, []);
  }

  async getById(id: string): Promise<T | undefined> {
    const all = await this.getAll();
    return all.find(item => item.id === id);
  }

  async insert(item: T): Promise<T> {
    const all = await this.getAll();
    all.push(item);
    await writeJson(this.filename, all);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    const all = await this.getAll();
    const index = all.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    all[index] = { ...all[index], ...updates } as T;
=======
    all[index] = { ...all[index], ...updates } as T;
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
    await writeJson(this.filename, all);
    return all[index];
  }

  async delete(id: string): Promise<boolean> {
    const all = await this.getAll();
    const filtered = all.filter(item => item.id !== id);
    if (filtered.length === all.length) return false;

    await writeJson(this.filename, filtered);
    return true;
  }
}
