"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentZODSchema = void 0;
const zod_1 = require("zod");
class AppointmentZODSchema {
}
exports.AppointmentZODSchema = AppointmentZODSchema;
AppointmentZODSchema.createAppointmentSchema = zod_1.z.strictObject({
    patientId: zod_1.z.string().uuid(),
    doctorId: zod_1.z.string().uuid(),
    schedule: zod_1.z.coerce.date(),
    reason: zod_1.z.string().min(5),
    note: zod_1.z.string().optional(),
});
AppointmentZODSchema.updateAppointmentSchema = zod_1.z.strictObject({
    id: zod_1.z.string().uuid(),
    schedule: zod_1.z.coerce.date().optional(),
    status: zod_1.z.enum(['PENDING', 'SCHEDULED', 'CANCELLED']).optional(),
    reason: zod_1.z.string().min(5).optional(),
    note: zod_1.z.string().optional(),
    cancellationReason: zod_1.z.string().optional(),
});
AppointmentZODSchema.deleteAppointmentSchema = zod_1.z.strictObject({
    id: zod_1.z.string().uuid(),
});
AppointmentZODSchema.searchAppointmentSchema = zod_1.z.strictObject({
    patientId: zod_1.z.string().uuid().optional(),
    doctorId: zod_1.z.string().uuid().optional(),
    scheduleFrom: zod_1.z.coerce.date().optional(),
    scheduleTo: zod_1.z.coerce.date().optional(),
    status: zod_1.z.enum(['PENDING', 'SCHEDULED', 'CANCELLED']).optional(),
    reason: zod_1.z.string().min(5).optional(),
    note: zod_1.z.string().optional(),
    cancellationReason: zod_1.z.string().optional(),
});
