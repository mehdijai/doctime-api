import { z } from 'zod';

export class AppointmentZODSchema {
  static readonly createAppointmentSchema = z.object({
    patientId: z.string().uuid(),
    doctorId: z.string().uuid(),
    schedule: z.date(),
    status: z.enum(['PENDING', 'SCHEDULED', 'CANCELLED']),
    reason: z.string().min(5),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
  });

  static readonly updateAppointmentSchema = z.object({
    id: z.string().uuid(),
    schedule: z.date(),
    status: z.enum(['PENDING', 'SCHEDULED', 'CANCELLED']),
    reason: z.string().min(5),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
  });

  static readonly deleteAppointmentSchema = z.object({
    id: z.string().uuid(),
  });

  static readonly searchAppointmentSchema = z.object({
    patientId: z.string().uuid().optional(),
    doctorId: z.string().uuid().optional(),
    scheduleFrom: z.date().optional(),
    scheduleTo: z.date().optional(),
    status: z.enum(['PENDING', 'SCHEDULED', 'CANCELLED']).optional(),
    reason: z.string().min(5).optional(),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
  });
}
