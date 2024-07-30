"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthZODSchema = void 0;
const zod_1 = require("zod");
class AuthZODSchema {
}
exports.AuthZODSchema = AuthZODSchema;
AuthZODSchema.authSchema = zod_1.z.strictObject({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    type: zod_1.z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
});
AuthZODSchema.registerSchema = zod_1.z.strictObject({
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    type: zod_1.z.enum(['DOCTOR', 'PATIENT']),
});
AuthZODSchema.refreshTokenSchema = zod_1.z.strictObject({
    refreshToken: zod_1.z.string().uuid(),
});
AuthZODSchema.forgetPasswordSchema = zod_1.z.strictObject({
    email: zod_1.z.string().email(),
    type: zod_1.z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
});
AuthZODSchema.resetPasswordSchema = zod_1.z.strictObject({
    newPassword: zod_1.z.string().min(8),
    token: zod_1.z.string().uuid(),
});
AuthZODSchema.validateUserSchema = zod_1.z.strictObject({
    token: zod_1.z.string().uuid(),
});
AuthZODSchema.updatePasswordSchema = zod_1.z.strictObject({
    oldPassword: zod_1.z.string().min(8),
    newPassword: zod_1.z.string().min(8),
    type: zod_1.z.enum(['DOCTOR', 'PATIENT', 'ADMIN']),
});
