import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface SyncQueueItem {
  id?: number;
  url: string;
  method: string;
  body: any;
  headers?: any;
  timestamp: number;
}

interface DentistPwaDB extends DBSchema {
  'sync-queue': {
    key: number;
    value: SyncQueueItem;
  };
  'cached-data': {
    key: string;
    value: { id: string; data: any; updated_at: number };
  };
}

const DB_NAME = 'dentist-pwa-db';

export async function initDB(): Promise<IDBPDatabase<DentistPwaDB>> {
  return openDB<DentistPwaDB>(DB_NAME, 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1 || !db.objectStoreNames.contains('sync-queue' as any)) {
        if (db.objectStoreNames.contains('offline-submissions' as any)) {
          db.deleteObjectStore('offline-submissions' as any);
        }
        db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('cached-data', { keyPath: 'id' });
      }
    }
  });
}

// ------------------------------------------------------------------
// Caching Layer (Read Offline)
// ------------------------------------------------------------------
export async function cacheData(key: string, data: any) {
  const db = await initDB();
  await db.put('cached-data', { id: key, data, updated_at: Date.now() });
}

export async function getCachedData(key: string) {
  const db = await initDB();
  const entry = await db.get('cached-data', key);
  return entry ? entry.data : null;
}

// ------------------------------------------------------------------
// Sync Queue Layer (Write Offline)
// ------------------------------------------------------------------
export async function queueSyncRequest(url: string, method: string, body: any, headers: any = {}) {
  const db = await initDB();
  await db.add('sync-queue', {
    url,
    method,
    body,
    headers,
    timestamp: Date.now()
  });

  // Attempt sync immediately if online
  if (navigator.onLine) {
    syncQueue();
  }
}

export async function getSyncQueue() {
  const db = await initDB();
  return db.getAll('sync-queue');
}

export async function clearSyncQueueItem(id: number) {
  const db = await initDB();
  await db.delete('sync-queue', id);
}

export async function syncQueue() {
  const items = await getSyncQueue();
  if (items.length === 0) return;

  for (const item of items) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          ...(item.headers || {})
        },
        body: JSON.stringify(item.body)
      });

      if (res.ok || res.status >= 400) {
        // If it succeeds or permanently fails (e.g., 400 Bad Request), remove from queue.
        if (item.id) {
          await clearSyncQueueItem(item.id);
        }
      }
    } catch (err) {
      // Network error, keep in queue and break.
      break;
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', syncQueue);
}
