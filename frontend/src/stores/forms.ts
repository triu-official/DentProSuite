import { defineStore } from 'pinia';
import type { FormTemplate, FormSubmission } from '../../../shared/types/index.js';

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const useFormStore = defineStore('forms', {
  state: () => ({
    templates: [] as FormTemplate[],
    submissions: [] as FormSubmission[],
  }),
  actions: {
    async fetchTemplates() {
      try {
        const res = await fetch(`${API_URL}/forms/templates`);
        if (res.ok) {
          this.templates = await res.json();
          localStorage.setItem('cachedTemplates', JSON.stringify(this.templates));
        }
      } catch (err) {
        const cached = localStorage.getItem('cachedTemplates');
        if (cached) {
            this.templates = JSON.parse(cached);
        }
      }
    },
    async submitForm(submission: any) {
        try {
            const res = await fetch(`${API_URL}/forms/submissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission)
            });
            if (res.ok) {
                return true;
            }
        } catch (error) {
            await import('../services/offlineStorage.ts').then(m => m.queueSyncRequest(
              `${API_URL}/forms/submissions`,
              'POST',
              submission
            ));
            return false;
        }
    }
  }
});
