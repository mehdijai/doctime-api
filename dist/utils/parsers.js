"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserPayload = parseUserPayload;
exports.parseDoctor = parseDoctor;
exports.parseCoords = parseCoords;
exports.parsePublicPatient = parsePublicPatient;
exports.parsePrivatePatient = parsePrivatePatient;
exports.parseAppointment = parseAppointment;
function parseUserPayload(user) {
    return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        verifiedEmail: user.verifiedEmail,
        userType: user.userType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
function parseDoctor(doctor) {
    var _a, _b;
    return {
        id: doctor.id,
        user: parseUserPayload(doctor.user),
        status: doctor.status,
        address: doctor.address,
        mapPosition: doctor.mapPosition ? JSON.parse(doctor.mapPosition) : undefined,
        specialty: doctor.specialty,
        biography: (_a = doctor.biography) !== null && _a !== void 0 ? _a : undefined,
        pictureUrl: (_b = doctor.pictureUrl) !== null && _b !== void 0 ? _b : undefined,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
    };
}
function parseCoords(coords) {
    var _a, _b;
    return {
        lat: parseFloat((_a = coords.lat) !== null && _a !== void 0 ? _a : '0'),
        lng: parseFloat((_b = coords.lng) !== null && _b !== void 0 ? _b : '0'),
    };
}
function parsePublicPatient(patient) {
    return {
        id: patient.id,
        user: parseUserPayload(patient.user),
        birthDate: patient.birthDate,
        gender: patient.gender,
        address: patient.address,
        occupation: patient.occupation,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
    };
}
function parsePrivatePatient(patient) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const publicPatient = parsePublicPatient(patient);
    return Object.assign(Object.assign({}, publicPatient), { emergencyContactName: patient.emergencyContactName, emergencyContactNumber: patient.emergencyContactNumber, primaryPhysician: patient.primaryPhysician, insuranceProvider: (_a = patient.insuranceProvider) !== null && _a !== void 0 ? _a : undefined, insurancePolicyNumber: (_b = patient.insurancePolicyNumber) !== null && _b !== void 0 ? _b : undefined, allergies: (_c = patient.allergies) !== null && _c !== void 0 ? _c : undefined, currentMedication: (_d = patient.currentMedication) !== null && _d !== void 0 ? _d : undefined, familyMedicalHistory: (_e = patient.familyMedicalHistory) !== null && _e !== void 0 ? _e : undefined, pastMedicalHistory: (_f = patient.pastMedicalHistory) !== null && _f !== void 0 ? _f : undefined, identificationType: (_g = patient.identificationType) !== null && _g !== void 0 ? _g : undefined, identificationNumber: (_h = patient.identificationNumber) !== null && _h !== void 0 ? _h : undefined, identificationUrl: (_j = patient.identificationUrl) !== null && _j !== void 0 ? _j : undefined, privacyConsent: patient.privacyConsent, doctors: (_l = (_k = patient.doctors) === null || _k === void 0 ? void 0 : _k.map(parseDoctor)) !== null && _l !== void 0 ? _l : undefined });
}
function parseAppointment(appointment) {
    var _a, _b;
    return {
        id: appointment.id,
        reason: appointment.reason,
        cancellationReason: (_a = appointment.cancellationReason) !== null && _a !== void 0 ? _a : undefined,
        note: (_b = appointment.note) !== null && _b !== void 0 ? _b : undefined,
        doctor: parseDoctor(appointment.doctor),
        patient: parsePublicPatient(appointment.patient),
        status: appointment.status,
        schedule: appointment.schedule,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
    };
}
