import { StorageAdapter } from './StorageAdapter.js';
import { LocalJsonAdapter } from './adapters/LocalJsonAdapter.js';
import { SqliteAdapter } from './adapters/SqliteAdapter.js';
import { AppwriteAdapter } from './adapters/AppwriteAdapter.js';
// We export the abstract interface so controllers can use it
export type { StorageAdapter };

// Factory for getting the correct adapter based on env
export function getDatabaseAdapter<T extends { id: string }>(collectionName: string): StorageAdapter<T> {
  const mode = process.env.STORAGE_ADAPTER || process.env.STORAGE_MODE || 'local';

  if (mode === 'appwrite') {
    return new AppwriteAdapter<T>(collectionName);
  }

  if (mode === 'local-json') {
     return new LocalJsonAdapter<T>(`${collectionName}.json`);
  }

  // Default hardened local production adapter is sqlite
  return new SqliteAdapter<T>(collectionName);
}
