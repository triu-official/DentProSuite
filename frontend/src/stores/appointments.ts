import { defineStore } from 'pinia';
import type { Appointment } from '../../../shared/types/index.js';
import { useAuthStore } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const useAppointmentStore = defineStore('appointments', {
  state: () => ({
    appointments: [] as Appointment[],
  }),
  actions: {
    async fetchAppointments(date?: string, dentistId?: string) {
      const auth = useAuthStore();
      if (!auth.token) return;

      let url = `${API_URL}/appointments?`;
      if (date) url += `date=${date}&`;
      if (dentistId) url += `dentistId=${dentistId}`;

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (res.ok) {
          this.appointments = await res.json();
          localStorage.setItem('cachedAppointments', JSON.stringify(this.appointments));
        }
      } catch (err) {
        const cached = localStorage.getItem('cachedAppointments');
        if (cached) {
          this.appointments = JSON.parse(cached);
        }
      }
    },
    async updateStatus(id: string, status: string) {
       const index = this.appointments.findIndex(a => a.id === id);
       if (index !== -1) {
           this.appointments[index].status = status as any;
       }
       const auth = useAuthStore();

       try {
         const res = await fetch(`${API_URL}/appointments/${id}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${auth.token}`
           },
           body: JSON.stringify({ status })
         });

         if (!res.ok) throw new Error('Network error');
         // Update cache on success
         localStorage.setItem('cachedAppointments', JSON.stringify(this.appointments));
       } catch (err) {
         // Queue offline sync
         await import('../services/offlineStorage.js').then(m => m.queueSyncRequest(
           `${API_URL}/appointments/${id}`,
           'PUT',
           { status },
           { Authorization: `Bearer ${auth.token}` }
         ));
         // Update cache anyway to reflect local optimism
         localStorage.setItem('cachedAppointments', JSON.stringify(this.appointments));
       }
    }
  }
});
