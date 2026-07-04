import bcrypt from 'bcrypt';
import path from 'path';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { User, Clinic, Patient, FormTemplate, Appointment } from '../../../shared/types/index.js';

// Hardcoded for testing; adjust path if run from a different CWD
// For ts-node, process.cwd() is 'backend'
const DATA_DIR = path.join(process.cwd(), '../data');

async function seed() {
  console.log('Seeding data...');

  const dbUsers = getDatabaseAdapter<User>('users');
  const dbClinics = getDatabaseAdapter<Clinic>('clinics');
  const dbPatients = getDatabaseAdapter<Patient>('patients');
  const dbTemplates = getDatabaseAdapter<FormTemplate>('templates');
  const dbAppointments = getDatabaseAdapter<Appointment>('appointments');

  // Password hashing
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1. Clinic
  await dbClinics.insert({
    id: 'clinic-1',
    name: 'DentistPro360 Demo Clinic',
    address: '123 Fake St, Springfield',
    chairs: 3,
    operatingHours: { start: '08:00', end: '18:00' }
  });

  // 2. Users (1 Admin, 2 Dentists, 1 Receptionist)
  await dbUsers.insert({ id: 'admin-1', email: 'admin@clinic.com', passwordHash, role: 'ADMIN', name: 'Admin Alice', createdAt: new Date().toISOString() });
  await dbUsers.insert({ id: 'reception-1', email: 'reception@clinic.com', passwordHash, role: 'RECEPTION', name: 'Rec Rachel', createdAt: new Date().toISOString() });
  await dbUsers.insert({ id: 'dentist-1', email: 'dentist1@clinic.com', passwordHash, role: 'DENTIST', name: 'Dr. Smile', createdAt: new Date().toISOString() });
  await dbUsers.insert({ id: 'dentist-2', email: 'dentist2@clinic.com', passwordHash, role: 'DENTIST', name: 'Dr. Drill', createdAt: new Date().toISOString() });

  // 3. Patients (5)
  for (let i = 1; i <= 5; i++) {
    await dbPatients.insert({
      id: `patient-${i}`,
      firstName: `Patient`,
      lastName: `${i}`,
      dateOfBirth: '1990-01-01',
      phone: `555-000${i}`,
      email: `patient${i}@test.com`,
      medicalHistory: {},
      createdAt: new Date().toISOString()
    });
  }

  // 4. Form Templates
  await dbTemplates.insert({
    id: 'template-intake',
    title: 'New Patient Intake',
    description: 'Basic info for new patients.',
    isActive: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', required: true },
      { id: 'f2', type: 'checkbox', label: 'Have you had dental surgery before?', required: false },
      { id: 'f3', type: 'signature', label: 'Signature', required: true }
    ]
  });

  await dbTemplates.insert({
    id: 'template-consent',
    title: 'Informed Consent',
    description: 'Consent for standard procedures.',
    isActive: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'f1', type: 'text', label: 'Procedure Name', required: true },
      { id: 'f2', type: 'signature', label: 'Patient Signature', required: true }
    ]
  });

  // 5. Appointments (Sample)
  const today = new Date().toISOString().split('T')[0];
  await dbAppointments.insert({
    id: 'appt-1',
    patientId: 'patient-1',
    dentistId: 'dentist-1',
    chairId: 1,
    date: today,
    startTime: '09:00',
    endTime: '10:00',
    status: 'SCHEDULED',
    services: [],
    createdAt: new Date().toISOString()
  });

  await dbAppointments.insert({
    id: 'appt-2',
    patientId: 'patient-2',
    dentistId: 'dentist-1',
    chairId: 1,
    date: today,
    startTime: '10:00',
    endTime: '11:00',
    status: 'COMPLETED',
    services: [],
    createdAt: new Date().toISOString()
  });

  console.log('Seed data generated.');
}

seed().catch(console.error);
