"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorZODSchema = void 0;
const zod_1 = require("zod");
class DoctorZODSchema {
}
exports.DoctorZODSchema = DoctorZODSchema;
DoctorZODSchema.createDoctorSchema = zod_1.z.strictObject({
    address: zod_1.z.string().min(5),
    specialty: zod_1.z.string().min(5),
    biography: zod_1.z.string().min(5).optional(),
    pictureUrl: zod_1.z.string().url().optional(),
    mapPosition: zod_1.z
        .object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180),
    })
        .optional(),
});
DoctorZODSchema.updateDoctorSchema = zod_1.z.strictObject({
    id: zod_1.z.string().uuid(),
    address: zod_1.z.string().min(5).optional(),
    specialty: zod_1.z.string().min(5).optional(),
    status: zod_1.z.enum(['AVAILABLE', 'UNAVAILABLE', 'SUSPENDED']).optional(),
    biography: zod_1.z.string().min(5).optional(),
    pictureUrl: zod_1.z.string().url().optional(),
    mapPosition: zod_1.z
        .object({
        lat: zod_1.z.number().min(-90).max(90),
        lng: zod_1.z.number().min(-180).max(180),
    })
        .optional(),
});
DoctorZODSchema.deleteDoctorSchema = zod_1.z.strictObject({
    id: zod_1.z.string().uuid(),
});
DoctorZODSchema.searchDoctorSchema = zod_1.z.strictObject({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number')
        .optional(),
    status: zod_1.z.enum(['AVAILABLE', 'UNAVAILABLE', 'SUSPENDED']).optional(),
    address: zod_1.z.string().min(5).optional(),
    specialty: zod_1.z.string().min(5).optional(),
    nearMe: zod_1.z
        .object({
        lat: zod_1.z.string().refine((lat) => parseFloat(lat) >= -90 && parseFloat(lat) <= 90),
        lng: zod_1.z.string().refine((lat) => parseFloat(lat) >= -180 && parseFloat(lat) <= 180),
    })
        .optional(),
});
DoctorZODSchema.validateDeleteSchema = zod_1.z.strictObject({
    token: zod_1.z.string().uuid(),
});
