import { defineStore } from 'pinia';
import type { FormTemplate, FormSubmission } from '../../../shared/types/index.js';
import { DataService } from '../services/api';
=======
import { DataService } from '../services/api';
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3

const templatesService = new DataService('/api/forms/templates', 'formTemplates');
const submissionsService = new DataService('/api/forms/submissions', 'formSubmissions');

export const useFormStore = defineStore('forms', {
  state: () => ({
    templates: [] as FormTemplate[],
    submissions: [] as FormSubmission[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchTemplates() {
      this.isLoading = true;
      this.error = null;
      try {
        this.templates = await templatesService.getAll();
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch form templates';
      } finally {
        this.isLoading = false;
      }
    },
    async submitForm(submission: any) {
      try {
        await submissionsService.create(submission);
        return true;
      } catch (error) {
        console.error('Failed to submit form directly. Offline queue will handle it.', error);
        return false;
      }
<<<<<<< HEAD
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
=======
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
    }
  }
});
