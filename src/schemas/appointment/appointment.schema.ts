import { z } from 'zod';
import { searchPaginationSchema } from '../common/common.schema';

export class AppointmentZODSchema {
  static readonly createAppointmentSchema = z.strictObject({
    patientId: z.string().uuid(),
    doctorId: z.string().uuid(),
    schedule: z.coerce.date(),
    reason: z.string().min(5),
    note: z.string().optional(),
  });

  static readonly updateAppointmentSchema = z.strictObject({
    id: z.string().uuid(),
    schedule: z.coerce.date().optional(),
    status: z.enum(['PENDING', 'SCHEDULED', 'CANCELLED']).optional(),
    reason: z.string().min(5).optional(),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
  });

  static readonly deleteAppointmentSchema = z.strictObject({
    id: z.string().uuid(),
  });

  static readonly searchAppointmentSchema = z.strictObject({
    ...searchPaginationSchema,
    patientId: z.string().uuid().optional(),
    doctorId: z.string().uuid().optional(),
    scheduleFrom: z.coerce.date().optional(),
    scheduleTo: z.coerce.date().optional(),
    status: z.enum(['PENDING', 'SCHEDULED', 'CANCELLED']).optional(),
    reason: z.string().min(5).optional(),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
  });
}
