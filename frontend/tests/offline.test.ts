import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { queueSyncRequest, getSyncQueue, clearSyncQueueItem, initDB } from '../src/services/offlineStorage';

describe('Offline Storage Queue', () => {
  beforeEach(async () => {
    // Clear the idb object store before each test
    const db = await initDB();
    const tx = db.transaction('sync-queue', 'readwrite');
    await tx.objectStore('sync-queue').clear();
  });

  it('should queue a sync request and retrieve it', async () => {
    const payload = { templateId: '123', answers: { q1: 'yes' } };
    await queueSyncRequest('/api/test', 'POST', payload);

    const queuedItems = await getSyncQueue();
    expect(queuedItems.length).toBe(1);
    expect(queuedItems[0].url).toContain('/api/test');
    expect(queuedItems[0].method).toBe('POST');
    expect(queuedItems[0].body).toEqual(payload);
  });

  it('should remove a sync item', async () => {
    await queueSyncRequest('/api/test', 'POST', { q: 1 });
    let queuedItems = await getSyncQueue();
    expect(queuedItems.length).toBe(1);

    const itemId = queuedItems[0].id!;
    await clearSyncQueueItem(itemId);

    queuedItems = await getSyncQueue();
    expect(queuedItems.length).toBe(0);
  });
});
