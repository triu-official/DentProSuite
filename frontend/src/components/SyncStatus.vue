<template>
  <div v-if="queueLength > 0 || isOffline"
       class="fixed bottom-4 right-4 p-4 rounded shadow-lg text-white text-sm z-50 flex items-center gap-3 transition-colors"
       :class="[isOffline ? 'bg-red-600' : 'bg-orange-500']">

    <div v-if="isOffline">
      <span>You are offline. Changes saved locally.</span>
    </div>

    <div v-else>
      <span>{{ queueLength }} action(s) pending sync...</span>
      <button @click="forceSync"
              class="ml-3 px-2 py-1 bg-white text-orange-600 font-bold rounded hover:bg-orange-100 disabled:opacity-50"
              :disabled="isSyncing">
        {{ isSyncing ? 'Syncing...' : 'Sync Now' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getSyncQueue, syncQueue } from '../services/offlineStorage';

const isOffline = ref(!navigator.onLine);
const queueLength = ref(0);
const isSyncing = ref(false);

const updateStatus = async () => {
  isOffline.value = !navigator.onLine;
  const q = await getSyncQueue();
  queueLength.value = q.length;
};

const forceSync = async () => {
  if (isOffline.value) return;
  isSyncing.value = true;
  await syncQueue();
  await updateStatus();
  isSyncing.value = false;
};

let interval: any;

onMounted(() => {
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  // Periodically check queue size just in case
  interval = setInterval(updateStatus, 5000);
  updateStatus();
});

onUnmounted(() => {
  window.removeEventListener('online', updateStatus);
  window.removeEventListener('offline', updateStatus);
  clearInterval(interval);
});
</script>
