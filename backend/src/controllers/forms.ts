import { Request, Response } from 'express';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { FormTemplate, FormSubmission } from '../../../shared/types/index.js';

const dbTemplates = getDatabaseAdapter<FormTemplate>('templates');
const dbSubmissions = getDatabaseAdapter<FormSubmission>('submissions');

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await dbTemplates.getAll();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const newTemplate: FormTemplate = {
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    const saved = await dbTemplates.insert(newTemplate);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
=======
    const id = req.params.id as string;
>>>>>>> 0a3d8169160c949370332006f3066950243c45c3
    const updated = await dbTemplates.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Template not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const patientId = req.query.patientId as string | undefined;
    let submissions = await dbSubmissions.getAll();

    if (patientId) {
      submissions = submissions.filter(s => s.patientId === patientId);
    }

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const submitForm = async (req: Request, res: Response) => {
  try {
    // Basic structural validation could go here
    const newSubmission: FormSubmission = {
      ...req.body,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString()
    };
    const saved = await dbSubmissions.insert(newSubmission);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
