import { AuthZODSchema } from './auth.schema';
import { z } from 'zod';

declare global {
  type TAuthSchema = z.infer<typeof AuthZODSchema.authSchema>;
  type TRegisterSchema = z.infer<typeof AuthZODSchema.registerSchema>;
  type TForgetPasswordSchema = z.infer<typeof AuthZODSchema.forgetPasswordSchema>;
  type TResetPasswordSchema = z.infer<typeof AuthZODSchema.resetPasswordSchema>;
  type TUpdatePasswordSchema = z.infer<typeof AuthZODSchema.updatePasswordSchema>;
  type TValidateUserSchema = z.infer<typeof AuthZODSchema.validateUserSchema>;
  type TRefreshTokenSchema = z.infer<typeof AuthZODSchema.refreshTokenSchema>;
}
