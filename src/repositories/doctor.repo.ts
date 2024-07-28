import { ApiResponseBody, ResponseHandler } from '@/utils/responseHandler';
import prisma from '@/services/prisma.service';
import { apiMethod } from '@/decorators/api.decorator';
import { parseDoctor } from '@/utils/parsers';
import { isNearCoordinates } from '@/utils/geo';

export class DoctorRepository {
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

  @apiMethod<IDoctor[]>()
  static async getDoctors(searchPayload: TSearchDoctorSchema): Promise<ApiResponseBody<IDoctor[]>> {
    const resBody: ApiResponseBody<IDoctor[]> = (this as any).getResBody();
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
      wherePrisma['address'] = searchPayload.address;
    }
    if (searchPayload.specialty) {
      wherePrisma['specialty'] = searchPayload.specialty;
    }

    const doctors = await prisma.doctor.findMany({
      where: wherePrisma,
      include: {
        user: true,
      },
    });

    resBody.data = doctors
      .filter((doctor) => {
        if (!searchPayload.nearMe || !searchPayload.nearMe.lat || !searchPayload.nearMe.lng)
          return true;
        if (!doctor.mapPosition) return false;
        return isNearCoordinates(
          searchPayload.nearMe as ICoordinates,
          JSON.parse(doctor.mapPosition) as ICoordinates,
          5
        );
      })
      .map((doctor) => parseDoctor(doctor));
    return resBody;
  }

  @apiMethod<IDoctor>()
  static async createDoctor(payload: TCreateDoctorSchema): Promise<ApiResponseBody<IDoctor>> {
    const resBody: ApiResponseBody<IDoctor> = (this as any).getResBody();

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
            id: payload.userId,
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

  @apiMethod<IStatusResponse>()
  static async deleteDoctor({
    id,
  }: TDeleteDoctorSchema): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody: ApiResponseBody<IStatusResponse> = (this as any).getResBody();
    await prisma.doctor.delete({
      where: { id },
    });

    resBody.data = { status: true };
    return resBody;
  }
}
