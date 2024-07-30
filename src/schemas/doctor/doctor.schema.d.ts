import { z } from 'zod';
import { DoctorZODSchema } from './doctor.schema';

declare global {
  type TCreateDoctorSchema = z.infer<typeof DoctorZODSchema.createDoctorSchema>;
  type TUpdateDoctorSchema = z.infer<typeof DoctorZODSchema.updateDoctorSchema>;
  type TDeleteDoctorSchema = z.infer<typeof DoctorZODSchema.deleteDoctorSchema>;
  type TSearchDoctorSchema = z.infer<typeof DoctorZODSchema.searchDoctorSchema>;
  type TValidateDeleteSchema = z.infer<typeof DoctorZODSchema.validateDeleteSchema>;
}
