import { Doctor, User } from '@prisma/client';

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
    biography: doctor.biography,
    pictureUrl: doctor.pictureUrl,
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
