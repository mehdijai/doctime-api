import { ApiResponseBody, ResponseHandler } from '@/utils/responseHandler';
import { apiMethod } from '@/decorators/api.decorator';
import { Auth, AuthClass } from '@/decorators/auth.decorator';
import prisma from '@/services/prisma.service';
import { parseAppointment } from '@/utils/parsers';
import { $Enums } from '@prisma/client';

export class AppointmentRepository extends AuthClass {
  @Auth
  @apiMethod<IAppointment>()
  static async getAppointment(id: string): Promise<ApiResponseBody<IAppointment>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IAppointment> = (this as any).getResBody();
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
        OR: [
          {
            doctor: {
              userId,
            },
          },
          {
            patient: {
              userId,
            },
          },
        ],
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!appointment) {
      return ResponseHandler.NotFound('Appointment not found');
    }

    resBody.data = parseAppointment(appointment);
    return resBody;
  }

  @Auth
  @apiMethod<IAppointment[]>()
  static async getAppointments(
    searchPayload: TSearchAppointmentSchema
  ): Promise<ApiResponseBody<IAppointment[]>> {
    const userId = this.USER.userId;
    const resBody: ApiResponseBody<IAppointment[]> = (this as any).getResBody();

    const wherePrisma: any = {};

    if (searchPayload.patientId) {
      wherePrisma['patientId'] = searchPayload.patientId;
    }

    if (searchPayload.doctorId) {
      wherePrisma['doctorId'] = searchPayload.doctorId;
    }

    if (searchPayload.status) {
      wherePrisma['status'] = searchPayload.status;
    }

    if (searchPayload.reason) {
      wherePrisma['reason'] = {
        startWith: searchPayload.reason,
      };
    }

    if (searchPayload.note) {
      wherePrisma['note'] = {
        startWith: searchPayload.note,
      };
    }

    if (searchPayload.cancellationReason) {
      wherePrisma['cancellationReason'] = {
        startWith: searchPayload.cancellationReason,
      };
    }

    if (searchPayload.scheduleFrom) {
      if (!wherePrisma['schedule']) {
        wherePrisma['schedule'] = {};
      }
      wherePrisma['schedule']['gte'] = searchPayload.scheduleFrom;
    }

    if (searchPayload.scheduleTo) {
      if (!wherePrisma['schedule']) {
        wherePrisma['schedule'] = {};
      }
      wherePrisma['schedule']['lte'] = searchPayload.scheduleTo;
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        OR: [
          {
            doctor: {
              userId,
            },
          },
          {
            patient: {
              userId,
            },
          },
        ],
        ...wherePrisma,
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    resBody.data = appointments.map((appointment) => parseAppointment(appointment));
    return resBody;
  }

  @apiMethod<IAppointment>()
  static async createAppointment(
    payload: TCreateAppointmentSchema
  ): Promise<ApiResponseBody<IAppointment>> {
    const resBody: ApiResponseBody<IAppointment> = (this as any).getResBody();
    const appointment = await prisma.appointment.create({
      data: payload,
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
      },
    });
    resBody.data = parseAppointment(appointment);
    return resBody;
  }

  @apiMethod<IAppointment>()
  static async updateAppointment({
    id,
    ...payload
  }: TUpdateAppointmentSchema): Promise<ApiResponseBody<IAppointment>> {
    const resBody: ApiResponseBody<IAppointment> = (this as any).getResBody();
    const appointment = await prisma.appointment.update({
      where: {
        id,
      },
      data: payload,
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
      },
    });
    resBody.data = parseAppointment(appointment);
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async deleteAppointment(
    payload: TDeleteAppointmentSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody: ApiResponseBody<IStatusResponse> = (this as any).getResBody();
    await prisma.appointment.delete({
      where: {
        id: payload.id,
      },
    });
    return resBody;
  }
}
