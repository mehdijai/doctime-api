import { Doctor, Patient, User } from '@prisma/client';

export function parseUserPayload(user: User): IUser {
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

export function parseDoctor(doctor: Doctor & { user: User }): IDoctor {
  return {
    id: doctor.id,
    user: parseUserPayload(doctor.user),
    status: doctor.status as DoctorStatus,
    address: doctor.address,
    mapPosition: doctor.mapPosition ? JSON.parse(doctor.mapPosition) : undefined,
    specialty: doctor.specialty,
    biography: doctor.biography ?? undefined,
    pictureUrl: doctor.pictureUrl ?? undefined,
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
  };
}

export function parseCoords(coords: { lat?: string; lng?: string }) {
  return {
    lat: parseFloat(coords.lat ?? '0'),
    lng: parseFloat(coords.lng ?? '0'),
  } as ICoordinates;
}

export function parsePublicPatient(patient: Patient & { user: User }): IPublicPatient {
  return {
    id: patient.id,
    user: parseUserPayload(patient.user),
    birthDate: patient.birthDate,
    gender: patient.gender as Gender,
    address: patient.address,
    occupation: patient.occupation,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
  };
}

export function parsePrivatePatient(patient: Patient & { user: User, doctors?: Doctor[] }): IPrivatePatient {
  const publicPatient = parsePublicPatient(patient);
  return {
    ...publicPatient,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactNumber: patient.emergencyContactNumber,
    primaryPhysician: patient.primaryPhysician,
    insuranceProvider: patient.insuranceProvider ?? undefined,
    insurancePolicyNumber: patient.insurancePolicyNumber ?? undefined,
    allergies: patient.allergies ?? undefined,
    currentMedication: patient.currentMedication ?? undefined,
    familyMedicalHistory: patient.familyMedicalHistory ?? undefined,
    pastMedicalHistory: patient.pastMedicalHistory ?? undefined,
    identificationType: patient.identificationType ?? undefined,
    identificationNumber: patient.identificationNumber ?? undefined,
    identificationUrl: patient.identificationUrl ?? undefined,
    privacyConsent: patient.privacyConsent,
    doctors: patient.doctors?.map(parseDoctor) ?? undefined,
  };
}
