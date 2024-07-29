import { z } from 'zod';
import { PatientZODSchema } from './patient.schema';

declare global {
  type TCreatePatientSchema = z.infer<typeof PatientZODSchema.createPatientSchema>;
  type TUpdatePatientSchema = z.infer<typeof PatientZODSchema.updatePatientSchema>;
  type TDeletePatientSchema = z.infer<typeof PatientZODSchema.deletePatientSchema>;
  type TSearchPatientSchema = z.infer<typeof PatientZODSchema.searchPatientSchema>;
  type TAddDoctorSchema = z.infer<typeof PatientZODSchema.addDoctorSchema>;
}
