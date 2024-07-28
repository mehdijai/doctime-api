import { z } from 'zod';

export class PatientZODSchema {
  static readonly createPatientSchema = z.object({
    userId: z.string().uuid(),
    birthDate: z.date(),
    gender: z.enum(['MALE', 'FEMALE']),
    address: z.string().min(5),
    occupation: z.string().min(2),
    emergencyContactName: z.string().min(2),
    emergencyContactNumber: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
    primaryPhysician: z.string().min(2),
    insuranceProvider: z.string().optional(),
    insurancePolicyNumber: z.string().optional(),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    identificationType: z.string().optional(),
    identificationNumber: z.string().optional(),
    identificationUrl: z.string().url().optional(),
    privacyConsent: z.boolean(),
  });

  static readonly updatePatientSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    birthDate: z.date(),
    gender: z.enum(['MALE', 'FEMALE']),
    address: z.string().min(5),
    occupation: z.string().min(2),
    emergencyContactName: z.string().min(2),
    emergencyContactNumber: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
    primaryPhysician: z.string().min(2),
    insuranceProvider: z.string().optional(),
    insurancePolicyNumber: z.string().optional(),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    identificationType: z.string().optional(),
    identificationNumber: z.string().optional(),
    identificationUrl: z.string().url().optional(),
    privacyConsent: z.boolean(),
  });

  static readonly deletePatientSchema = z.object({
    id: z.string().uuid(),
  });

  static readonly searchPatientSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number')
      .optional(),
    birthDate: z.date().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    address: z.string().min(5).optional(),
  });
}
