import { StorageAdapter } from './StorageAdapter.js';
import { LocalJsonAdapter } from './adapters/LocalJsonAdapter.js';
import { SqliteAdapter } from './adapters/SqliteAdapter.js';
import { AppwriteAdapter } from './adapters/AppwriteAdapter.js';
import { getEnv } from '../utils/env.js';
// We export the abstract interface so controllers can use it
=======
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
export type { StorageAdapter };

export function getDatabaseAdapter<T extends { id: string }>(collectionName: string): StorageAdapter<T> {
  const mode = process.env.STORAGE_ADAPTER || process.env.STORAGE_MODE || 'local';
=======
  const mode = process.env.STORAGE_ADAPTER || process.env.STORAGE_MODE || 'local';
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3

  if (env.STORAGE_MODE === 'appwrite') {
    return new AppwriteAdapter<T>(collectionName);
  }

  if (mode === 'local-json') {
     return new LocalJsonAdapter<T>(`${collectionName}.json`);
  }

  // Default hardened local production adapter is sqlite
  return new SqliteAdapter<T>(collectionName);
<<<<<<< HEAD
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
=======
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
}
