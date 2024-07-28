import { z } from 'zod';
import { AppointmentZODSchema } from './appointment.schema';

declare global {
  type TCreateAppointmentSchema = z.infer<typeof AppointmentZODSchema.createAppointmentSchema>;
  type TUpdateAppointmentSchema = z.infer<typeof AppointmentZODSchema.updateAppointmentSchema>;
  type TDeleteAppointmentSchema = z.infer<typeof AppointmentZODSchema.deleteAppointmentSchema>;
  type TSearchAppointmentSchema = z.infer<typeof AppointmentZODSchema.searchAppointmentSchema>;
}
