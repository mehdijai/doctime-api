import { z } from 'zod';
import { searchPaginationSchema } from '../common/common.schema';

export class PatientZODSchema {
  static readonly createPatientSchema = z.strictObject({
    birthDate: z.coerce.date(),
    gender: z.enum(['Male', 'Female']),
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

  static readonly updatePatientSchema = z.strictObject({
    id: z.string().uuid(),
    birthDate: z.coerce.date().optional(),
    gender: z.enum(['Male', 'Female']).optional(),
    address: z.string().min(5).optional(),
    occupation: z.string().min(2).optional(),
    emergencyContactName: z.string().min(2).optional(),
    emergencyContactNumber: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number')
      .optional(),
    primaryPhysician: z.string().min(2).optional(),
    insuranceProvider: z.string().optional(),
    insurancePolicyNumber: z.string().optional(),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    identificationType: z.string().optional(),
    identificationNumber: z.string().optional(),
    identificationUrl: z.string().url().optional(),
  });

  static readonly deletePatientSchema = z.strictObject({
    id: z.string().uuid(),
  });

  static readonly searchPatientSchema = z.strictObject({
    ...searchPaginationSchema,
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number')
      .optional(),
    birthDate: z.coerce.date().optional(),
    gender: z.enum(['Male', 'Female']).optional(),
    address: z.string().min(5).optional(),
  });

  static readonly addDoctorSchema = z.strictObject({
    doctorId: z.string().uuid(),
  });

  static readonly validateDeleteSchema = z.strictObject({
    token: z.string().uuid(),
  });
}
