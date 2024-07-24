import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
  email: z.string().email(),
  password: z.string().min(8),
  type: z.enum(['DOCTOR', 'PATIENT']),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email(),
  type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8),
  token: z.string().uuid(),
});

export const validateUserSchema = z.object({
  token: z.string().uuid(),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
  userId: z.string().uuid(),
  type: z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
});

export type TAuthSchema = z.infer<typeof authSchema>;
export type TRegisterSchema = z.infer<typeof registerSchema>;
export type TForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type TUpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type TValidateUserSchema = z.infer<typeof validateUserSchema>;
export type TRefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
