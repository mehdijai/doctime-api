"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientZODSchema = void 0;
const zod_1 = require("zod");
class PatientZODSchema {
}
exports.PatientZODSchema = PatientZODSchema;
PatientZODSchema.createPatientSchema = zod_1.z.strictObject({
    birthDate: zod_1.z.coerce.date(),
    gender: zod_1.z.enum(['Male', 'Female']),
    address: zod_1.z.string().min(5),
    occupation: zod_1.z.string().min(2),
    emergencyContactName: zod_1.z.string().min(2),
    emergencyContactNumber: zod_1.z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
    primaryPhysician: zod_1.z.string().min(2),
    insuranceProvider: zod_1.z.string().optional(),
    insurancePolicyNumber: zod_1.z.string().optional(),
    allergies: zod_1.z.string().optional(),
    currentMedication: zod_1.z.string().optional(),
    familyMedicalHistory: zod_1.z.string().optional(),
    pastMedicalHistory: zod_1.z.string().optional(),
    identificationType: zod_1.z.string().optional(),
    identificationNumber: zod_1.z.string().optional(),
    identificationUrl: zod_1.z.string().url().optional(),
    privacyConsent: zod_1.z.boolean(),
});
PatientZODSchema.updatePatientSchema = zod_1.z.strictObject({
    id: zod_1.z.string().uuid(),
    birthDate: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.enum(['Male', 'Female']).optional(),
    address: zod_1.z.string().min(5).optional(),
    occupation: zod_1.z.string().min(2).optional(),
    emergencyContactName: zod_1.z.string().min(2).optional(),
    emergencyContactNumber: zod_1.z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number')
        .optional(),
    primaryPhysician: zod_1.z.string().min(2).optional(),
    insuranceProvider: zod_1.z.string().optional(),
    insurancePolicyNumber: zod_1.z.string().optional(),
    allergies: zod_1.z.string().optional(),
    currentMedication: zod_1.z.string().optional(),
    familyMedicalHistory: zod_1.z.string().optional(),
    pastMedicalHistory: zod_1.z.string().optional(),
    identificationType: zod_1.z.string().optional(),
    identificationNumber: zod_1.z.string().optional(),
    identificationUrl: zod_1.z.string().url().optional(),
});
PatientZODSchema.deletePatientSchema = zod_1.z.strictObject({
    id: zod_1.z.string().uuid(),
});
PatientZODSchema.searchPatientSchema = zod_1.z.strictObject({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number')
        .optional(),
    birthDate: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.enum(['Male', 'Female']).optional(),
    address: zod_1.z.string().min(5).optional(),
});
PatientZODSchema.addDoctorSchema = zod_1.z.strictObject({
    doctorId: zod_1.z.string().uuid(),
});
PatientZODSchema.validateDeleteSchema = zod_1.z.strictObject({
    token: zod_1.z.string().uuid(),
});
