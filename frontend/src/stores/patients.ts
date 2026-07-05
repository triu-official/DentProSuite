import { defineStore } from 'pinia';
import type { Patient } from '../../../shared/types/index.js';
import { DataService } from '../services/api';

const patientsService = new DataService('/api/patients', 'patients');

export const usePatientStore = defineStore('patients', {
  state: () => ({
    patients: [] as Patient[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPatients() {
      this.isLoading = true;
      this.error = null;
      try {
        this.patients = await patientsService.getAll();
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch patients';
      } finally {
        this.isLoading = false;
      }
    }
  }
});
