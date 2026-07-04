<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Admin Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Revenue Overview</h2>
        <p>Simulation data for testing purposes.</p>
        <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded" @click="fetchRevenue">Load Revenue</button>
        <div v-if="revenue" class="mt-4">
          <p><strong>Total:</strong> ${{ revenue.totalRevenue }}</p>
          <p><strong>Completed Appointments:</strong> {{ revenue.appointmentsCompleted }}</p>
        </div>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Form Templates</h2>
        <button class="bg-green-500 text-white px-4 py-2 rounded" @click="showBuilder = true">Create New Template</button>
        <ul class="mt-4 space-y-2">
          <li v-for="t in forms.templates" :key="t.id" class="border p-2 rounded">
            {{ t.title }} ({{ t.isActive ? 'Active' : 'Draft' }})
          </li>
        </ul>
      </div>
    </div>
    <div v-if="showBuilder" class="mt-6 border-t pt-4">
      <FormBuilder @close="showBuilder = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useFormStore } from '../stores/forms.js';
import FormBuilder from '../components/FormBuilder.vue';

const authStore = useAuthStore();
const forms = useFormStore();
const revenue = ref<any>(null);
const showBuilder = ref(false);

const fetchRevenue = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/billing/overview?startDate=2023-01-01&endDate=2099-12-31`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    if (res.ok) {
      revenue.value = await res.json();
      await import('../services/offlineStorage.js').then(m => m.cacheData('admin_revenue', revenue.value));
    }
  } catch (error) {
      await import('../services/offlineStorage.js').then(async m => {
          const cached = await m.getCachedData('admin_revenue');
          if (cached) {
              revenue.value = cached;
          }
      });
  }
};

onMounted(() => {
  forms.fetchTemplates();
});
</script>
