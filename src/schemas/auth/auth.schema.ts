import { z } from 'zod';

export class AuthZODSchema {
  static readonly authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
  });

  static readonly registerSchema = z.object({
    name: z.string().min(2),
    phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
    email: z.string().email(),
    password: z.string().min(8),
    type: z.enum(['DOCTOR', 'PATIENT']),
  });

  static readonly refreshTokenSchema = z.object({
    refreshToken: z.string().uuid(),
  });

  static readonly forgetPasswordSchema = z.object({
    email: z.string().email(),
    type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
  });

  static readonly resetPasswordSchema = z.object({
    newPassword: z.string().min(8),
    token: z.string().uuid(),
  });

  static readonly validateUserSchema = z.object({
    token: z.string().uuid(),
  });

  static readonly updatePasswordSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
  });
}
