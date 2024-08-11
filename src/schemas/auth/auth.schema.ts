import { PermissionRole, PermissionVerb } from '@/services/permissions.service';
import { z } from 'zod';

export class AuthZODSchema {
  static readonly authSchema = z.strictObject({
    email: z.string().email(),
    password: z.string().min(8),
    type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
  });

  static readonly registerSchema = z.strictObject({
    name: z.string().min(2),
    phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
    email: z.string().email(),
    password: z.string().min(8),
    type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
  });

  static readonly refreshTokenSchema = z.strictObject({
    refreshToken: z.string().uuid(),
  });

  static readonly forgetPasswordSchema = z.strictObject({
    email: z.string().email(),
    type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
  });

  static readonly resetPasswordSchema = z.strictObject({
    newPassword: z.string().min(8),
    token: z.string().uuid(),
  });

  static readonly validateUserSchema = z.strictObject({
    token: z.string().uuid(),
  });

  static readonly updatePasswordSchema = z.strictObject({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
  });

  static readonly validateOTPSchema = z.strictObject({
    otp: z.string().min(6),
  });

  static readonly sendMFARequestSchema = z.strictObject({
    userId: z.string().uuid(),
    method: z.enum(['phone', 'email']),
  });

  static readonly confirmMFASchema = z.strictObject({
    userId: z.string().uuid(),
    otp: z.string().min(6),
  });

  static readonly setPermissionSchema = z.strictObject({
    permissions: z.object({}).catchall(z.array(z.nativeEnum(PermissionVerb)).optional()),
    roleName: z.nativeEnum(PermissionRole),
  });
}
