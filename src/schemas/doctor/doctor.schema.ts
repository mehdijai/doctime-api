import { z } from 'zod';

export class DoctorZODSchema {
  static readonly createDoctorSchema = z.object({
    userId: z.string().uuid(),
    address: z.string().min(5),
    specialty: z.string().min(5),
    biography: z.string().min(5).optional(),
    pictureUrl: z.string().url().optional(),
    mapPosition: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }),
  });

  static readonly updateDoctorSchema = z.object({
    id: z.string().uuid(),
    address: z.string().min(5),
    specialty: z.string().min(5),
    status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'SUSPENDED']).optional(),
    biography: z.string().min(5).optional(),
    pictureUrl: z.string().url().optional(),
    mapPosition: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }).optional(),
  });

  static readonly deleteDoctorSchema = z.object({
    id: z.string().uuid(),
  });

  static readonly searchDoctorSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number')
      .optional(),
    status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'SUSPENDED']).optional(),
    address: z.string().min(5).optional(),
    specialty: z.string().min(5).optional(),
    nearMe: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }).optional(),
  });
}
