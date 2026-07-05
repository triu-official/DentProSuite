import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import axios from 'axios';

export interface SyncQueueItem {
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

  // Try to clean up URL formatting since DataService might just pass relative paths
  const targetUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || ''}${url.startsWith('/') ? '' : '/'}${url}`;

  // Attach current auth token
  const token = localStorage.getItem('token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  await db.add('sync-queue', {
    url: targetUrl,
    method,
    body,
    headers: { ...authHeaders, ...headers },
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
      // Push via backend
      const res = await axios({
         url: item.url,
         method: item.method,
         data: item.body,
         headers: item.headers
      });

      if (res.status >= 200 && res.status < 300) {
        if (item.id) await clearSyncQueueItem(item.id);
      }
    } catch (err: any) {
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        // Permanent failure (e.g. validation error) - clear from queue to prevent block
        if (item.id) await clearSyncQueueItem(item.id);
      } else {
        // Network error / Server 500 - keep in queue but DO NOT break,
        // to allow independent queue items a chance to attempt.
        console.warn('Sync failed due to network/server, keeping in queue', err);
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', syncQueue);
}
