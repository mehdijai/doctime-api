import { ApiResponseBody, ResponseHandler } from '@/utils/responseHandler';
import prisma from '@/services/prisma.service';
import { apiMethod } from '@/decorators/api.decorator';
import { parseCoords, parseDoctor } from '@/utils/parsers';
import { isNearCoordinates } from '@/utils/geo';
import { Auth, AuthClass } from '@/decorators/auth.decorator';
import appConfig from '@/config/app.config';

export class DoctorRepository extends AuthClass {
  @apiMethod<IDoctor>()
  static async getDoctor(id: string): Promise<ApiResponseBody<IDoctor>> {
    const resBody: ApiResponseBody<IDoctor> = (this as any).getResBody();

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!doctor) return ResponseHandler.NotFound('Doctor not found');

    resBody.data = parseDoctor(doctor);

    return resBody;
  }

  @apiMethod<IPageList<IDoctor>>()
  static async getDoctors(
    searchPayload: TSearchDoctorSchema
  ): Promise<ApiResponseBody<IPageList<IDoctor>>> {
    const resBody: ApiResponseBody<IPageList<IDoctor>> = (this as any).getResBody();
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
    if (searchPayload.status) {
      wherePrisma['status'] = searchPayload.status;
    }
    if (searchPayload.address) {
      wherePrisma['address'] = {
        contains: searchPayload.address,
      };
    }
    if (searchPayload.specialty) {
      wherePrisma['specialty'] = searchPayload.specialty;
    }

    const doctors = await prisma.doctor.findMany({
      take: searchPayload.take,
      skip: searchPayload.skip,
      where: wherePrisma,
      include: {
        user: true,
      },
    });

    const count = await prisma.doctor.count({
      where: wherePrisma,
    });

    resBody.data = {
      items: doctors.map((doctor) => parseDoctor(doctor)),
      total: count,
    };

    // resBody.data = doctors
    //   .filter((doctor) => {
    //     if (!searchPayload.nearMe || !searchPayload.nearMe.lat || !searchPayload.nearMe.lng)
    //       return true;
    //     if (!doctor.mapPosition) return false;
    //     return isNearCoordinates(
    //       parseCoords(searchPayload.nearMe),
    //       JSON.parse(doctor.mapPosition) as ICoordinates,
    //       5
    //     );
    //   })
    //   .map((doctor) => parseDoctor(doctor));
    return resBody;
  }

  @Auth
  @apiMethod<IDoctor>()
  static async createDoctor(payload: TCreateDoctorSchema): Promise<ApiResponseBody<IDoctor>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IDoctor> = (this as any).getResBody();

    if (!(await this.isValidUser(userId, 'DOCTOR'))) {
      return ResponseHandler.Forbidden('This user is not allowed to perform this action');
    }

    const doctor = await prisma.doctor.create({
      data: {
        address: payload.address,
        status: 'AVAILABLE',
        mapPosition: payload.mapPosition ? JSON.stringify(payload.mapPosition) : undefined,
        specialty: payload.specialty,
        biography: payload.biography,
        pictureUrl: payload.pictureUrl,
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

    resBody.data = parseDoctor(doctor);
    return resBody;
  }

  @apiMethod<IDoctor>()
  static async updateDoctor(payload: TUpdateDoctorSchema): Promise<ApiResponseBody<IDoctor>> {
    const resBody: ApiResponseBody<IDoctor> = (this as any).getResBody();

    const doctor = await prisma.doctor.update({
      where: {
        id: payload.id,
      },
      data: {
        address: payload.address,
        status: payload.status,
        mapPosition: payload.mapPosition ? JSON.stringify(payload.mapPosition) : undefined,
        specialty: payload.specialty,
        biography: payload.biography,
        pictureUrl: payload.pictureUrl,
      },
      include: {
        user: true,
      },
    });

    resBody.data = parseDoctor(doctor);
    return resBody;
  }

  @Auth
  @apiMethod<IStatusResponse>()
  static async deleteDoctor({
    id,
  }: TDeleteDoctorSchema): Promise<ApiResponseBody<IStatusResponse>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IStatusResponse> = (this as any).getResBody();

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && appConfig.deleteProfileRequireVerification) {
      await this.sendConfirmDeletionToken(user);
    } else {
      const doctor = await prisma.doctor.delete({
        where: { id },
      });

      await prisma.user.delete({
        where: { id: doctor.userId },
      });
    }

    resBody.data = { status: true };
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async confirmDeleteDoctor(
    payload: TValidateDeleteSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody: ApiResponseBody<IStatusResponse> = (this as any).getResBody();

    const token = await prisma.confirmDeletionToken.findUnique({
      where: {
        token: payload.token,
        user: {
          userType: 'DOCTOR',
          doctor: {
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
            doctor: true,
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

    await prisma.doctor.delete({
      where: {
        id: token.user.doctor?.id,
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
}
