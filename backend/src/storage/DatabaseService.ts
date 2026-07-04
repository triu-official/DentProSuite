import { StorageAdapter } from './StorageAdapter.js';
import { LocalJsonAdapter } from './adapters/LocalJsonAdapter.js';
import { AppwriteAdapter } from './adapters/AppwriteAdapter.js';
// We export the abstract interface so controllers can use it
export { StorageAdapter };

// Factory for getting the correct adapter based on env
export function getDatabaseAdapter<T extends { id: string }>(collectionName: string): StorageAdapter<T> {
  const mode = process.env.STORAGE_MODE || 'local';

  if (mode === 'appwrite') {
    return new AppwriteAdapter<T>(collectionName);
  }

  // Default to local JSON
  // Append .json to keep backwards compatibility with the existing files
  return new LocalJsonAdapter<T>(`${collectionName}.json`);
}
