import { defineStore } from 'pinia';
import type { Patient } from '../../../shared/types/index.js';
import { useAuthStore } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const usePatientStore = defineStore('patients', {
  state: () => ({
    patients: [] as Patient[],
  }),
  actions: {
    async fetchPatients() {
      const auth = useAuthStore();
      if (!auth.token) return;
      try {
        const res = await fetch(`${API_URL}/patients`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (res.ok) {
          this.patients = await res.json();
          await import('../services/offlineStorage.js').then(m => m.cacheData('patients_list', this.patients));
        }
      } catch (err) {
          await import('../services/offlineStorage.js').then(async m => {
             const cached = await m.getCachedData('patients_list');
             if (cached) {
               this.patients = cached;
             }
          });
      }
    }
  }
});
