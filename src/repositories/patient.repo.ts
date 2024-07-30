import { ApiResponseBody, ResponseHandler } from '@/utils/responseHandler';
import { apiMethod } from '@/decorators/api.decorator';
import { Auth, AuthClass } from '@/decorators/auth.decorator';
import { parsePrivatePatient, parsePublicPatient } from '@/utils/parsers';
import prisma from '@/services/prisma.service';
import { $Enums } from '@prisma/client';
import moment from 'moment';

export class PatientRepository extends AuthClass {
  private static async getPatientByUser(userId: string) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    return patient;
  }
  @Auth
  @apiMethod<IPrivatePatient>()
  static async getPatient(patientId?: string): Promise<ApiResponseBody<IPrivatePatient>> {
    const userId = this.USER.userId;
    const isProfile = !patientId;

    if (!patientId) {
      const patient = await this.getPatientByUser(userId);
      if (!patient) {
        return ResponseHandler.Forbidden('You are not eligible to access this resource');
      } else {
        patientId = patient.id;
      }
    }

    const resBody: ApiResponseBody<IPrivatePatient> = (this as any).getResBody();
    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
        doctors: patientId
          ? {
              some: { userId },
            }
          : undefined,
      },
      include: {
        user: true,
        doctors: isProfile && {
          include: {
            user: true,
          },
        },
      },
    });

    if (!patient) {
      return ResponseHandler.NotFound('Patient not found');
    }
    resBody.data = parsePrivatePatient(patient);
    return resBody;
  }

  @Auth
  @apiMethod<IPublicPatient[]>()
  static async getPatients(
    searchPayload: TSearchPatientSchema
  ): Promise<ApiResponseBody<IPublicPatient[]>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IPublicPatient[]> = (this as any).getResBody();
    const wherePrisma: any = {};

    if (searchPayload.name) {
      if (!wherePrisma['user']) {
        wherePrisma['user'] = {};
      }
      wherePrisma['user']['name'] = { contains: searchPayload.name };
    }
    if (searchPayload.email) {
      if (!wherePrisma['user']) {
        wherePrisma['user'] = {};
      }
      wherePrisma['user']['email'] = searchPayload.email;
    }
    if (searchPayload.phone) {
      if (!wherePrisma['user']) {
        wherePrisma['user'] = {};
      }
      wherePrisma['user']['phone'] = searchPayload.phone;
    }

    if (searchPayload.birthDate) {
      wherePrisma['birthDate'] = {
        lte: moment(searchPayload.birthDate).startOf('D'),
        gte: moment(searchPayload.birthDate).endOf('D'),
      };
    }

    if (searchPayload.gender) {
      wherePrisma['gender'] = searchPayload.gender;
    }

    if (searchPayload.address) {
      wherePrisma['address'] = {
        contains: searchPayload.address,
      };
    }

    const patients = await prisma.patient.findMany({
      where: {
        doctors: {
          some: { userId },
        },
        ...wherePrisma,
      },
      include: {
        user: true,
      },
    });

    resBody.data = patients.map((patient) => parsePublicPatient(patient));

    return resBody;
  }

  @Auth
  @apiMethod<IPrivatePatient>()
  static async createPatient(
    payload: TCreatePatientSchema
  ): Promise<ApiResponseBody<IPrivatePatient>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IPrivatePatient> = (this as any).getResBody();

    const patient = await prisma.patient.create({
      data: {
        ...payload,
        gender: payload.gender as $Enums.Gender,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    resBody.data = parsePrivatePatient(patient);
    return resBody;
  }

  @apiMethod<IPrivatePatient>()
  static async updatePatient({
    id,
    ...payload
  }: TUpdatePatientSchema): Promise<ApiResponseBody<IPrivatePatient>> {
    const resBody: ApiResponseBody<IPrivatePatient> = (this as any).getResBody();

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...payload,
        gender: payload.gender && (payload.gender as $Enums.Gender),
      },
      include: {
        user: true,
      },
    });

    resBody.data = parsePrivatePatient(patient);
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async deletePatient({
    id,
  }: TDeletePatientSchema): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody: ApiResponseBody<IStatusResponse> = (this as any).getResBody();
    await prisma.patient.delete({
      where: { id },
    });

    resBody.data = { status: true };
    return resBody;
  }

  @Auth
  @apiMethod<IPrivatePatient>()
  static async addDoctor({
    doctorId,
  }: TAddDoctorSchema): Promise<ApiResponseBody<IPrivatePatient>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IPrivatePatient> = (this as any).getResBody();

    const patient = await prisma.patient.update({
      where: { userId },
      data: {
        doctors: {
          connect: {
            id: doctorId,
          },
        },
      },
      include: {
        user: true,
        doctors: {
          include: {
            user: true,
          },
        },
      },
    });

    resBody.data = parsePrivatePatient(patient);
    return resBody;
  }

  @Auth
  @apiMethod<IPrivatePatient>()
  static async removeDoctor({
    doctorId,
  }: TAddDoctorSchema): Promise<ApiResponseBody<IPrivatePatient>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IPrivatePatient> = (this as any).getResBody();

    const patient = await prisma.patient.update({
      where: { userId },
      data: {
        doctors: {
          disconnect: {
            id: doctorId,
          },
        },
      },
      include: {
        user: true,
        doctors: {
          include: {
            user: true,
          },
        },
      },
    });

    resBody.data = parsePrivatePatient(patient);
    return resBody;
  }
}
