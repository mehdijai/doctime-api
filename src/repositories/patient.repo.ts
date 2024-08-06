import { ApiResponseBody, ResponseHandler } from '@/utils/responseHandler';
import { apiMethod } from '@/decorators/api.decorator';
import { Auth, AuthClass } from '@/decorators/auth.decorator';
import { parsePrivatePatient, parsePublicPatient } from '@/utils/parsers';
import prisma from '@/services/prisma.service';
import { $Enums } from '@prisma/client';
import moment from 'moment';
import appConfig from '@/config/app.config';

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
        doctors: !isProfile
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
  @apiMethod<IPageList<IPublicPatient>>()
  static async getPatients(
    searchPayload: TSearchPatientSchema
  ): Promise<ApiResponseBody<IPageList<IPublicPatient>>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IPageList<IPublicPatient>> = (this as any).getResBody();
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
      take: searchPayload.take,
      skip: searchPayload.skip,
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

    const count = await prisma.patient.count({
      where: {
        doctors: {
          some: { userId },
        },
        ...wherePrisma,
      },
    });

    resBody.data = {
      items: patients.map((patient) => parsePublicPatient(patient)),
      total: count,
    };

    return resBody;
  }

  @Auth
  @apiMethod<IPrivatePatient>()
  static async createPatient(
    payload: TCreatePatientSchema
  ): Promise<ApiResponseBody<IPrivatePatient>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IPrivatePatient> = (this as any).getResBody();

    if (!(await this.isValidUser(userId, 'PATIENT'))) {
      return ResponseHandler.Forbidden('This user is not allowed to perform this action');
    }

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

  @Auth
  @apiMethod<IStatusResponse>()
  static async deletePatient({
    id,
  }: TDeletePatientSchema): Promise<ApiResponseBody<IStatusResponse>> {
    const userId = this.USER.userId;

    const resBody: ApiResponseBody<IStatusResponse> = (this as any).getResBody();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && appConfig.deleteProfileRequireVerification) {
      await this.sendConfirmDeletionToken(user);
    } else {
      const patient = await prisma.patient.delete({
        where: { id },
      });

      await prisma.user.delete({
        where: { id: patient.userId },
      });
    }

    resBody.data = { status: true };
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async confirmDeletePatient(
    payload: TValidateDeleteSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody: ApiResponseBody<IStatusResponse> = (this as any).getResBody();

    const token = await prisma.confirmDeletionToken.findUnique({
      where: {
        token: payload.token,
        user: {
          userType: 'PATIENT',
          patient: {
            NOT: undefined,
          },
        },
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        user: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!token) {
      return ResponseHandler.Forbidden('Invalid or expired token');
    }

    await prisma.confirmDeletionToken.delete({
      where: {
        id: token.id,
      },
    });

    await prisma.patient.delete({
      where: {
        id: token.user.patient?.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: token.userId,
      },
    });

    resBody.data = {
      status: true,
    };
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
