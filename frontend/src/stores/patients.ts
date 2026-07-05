import { defineStore } from 'pinia';
import type { Patient } from '../../../shared/types/index.js';
import { DataService } from '../services/api';
=======
import { DataService } from '../services/api';
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3

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
<<<<<<< HEAD
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
=======
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
      }
    }
  }
});
