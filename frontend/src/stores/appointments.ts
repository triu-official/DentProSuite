import { defineStore } from 'pinia';
import type { Appointment } from '../../../shared/types/index.js';
import { DataService } from '../services/api';
=======
import { DataService } from '../services/api';
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3

const appointmentsService = new DataService('/api/appointments', 'appointments');

export const useAppointmentStore = defineStore('appointments', {
  state: () => ({
    appointments: [] as Appointment[],
    isLoading: false,
=======
    isLoading: false,
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
    error: null as string | null,
  }),
  actions: {
    async fetchAppointments(date?: string, dentistId?: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const params: any = {};
        if (date) params.date = date;
        if (dentistId) params.dentistId = dentistId;

        this.appointments = await appointmentsService.getAll(params);
      } catch (err: any) {
         this.error = err.message || 'Failed to fetch appointments';
      } finally {
        this.isLoading = false;
<<<<<<< HEAD
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
=======
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
      }
    },

    async updateStatus(id: string, status: string) {
       // Optimistic update
       const index = this.appointments.findIndex(a => a.id === id);
       if (index !== -1) {
           this.appointments[index].status = status as any;
       }

       try {
=======
         await appointmentsService.update(id, { status });
       } catch (err) {
         console.warn('Update failed, optimistic state preserved or sync queued.', err);
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
       }
    }
  }
});
