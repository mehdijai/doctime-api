import { sendEmail } from '@/services/mail.service';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';
import { ApiResponseBody, ResponseHandler } from '@/utils/responseHandler';
import { logger } from '@/utils/winston';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/services/prisma.service';
import appConfig from '@/config/app.config';
import { addTime } from '@/utils/helpers';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { apiMethod } from '@/decorators/api.decorator';

export class AppointmentRepository {
  @apiMethod<IAppointment>()
  static async getAppointment(id: string): Promise<ApiResponseBody<IAppointment>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }

  @apiMethod<IAppointment[]>()
  static async getAppointments(
    searchPayload: TSearchAppointmentSchema
  ): Promise<ApiResponseBody<IAppointment[]>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }

  @apiMethod<IAppointment>()
  static async createAppointment(
    payload: TCreateAppointmentSchema
  ): Promise<ApiResponseBody<IAppointment>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }

  @apiMethod<IAppointment>()
  static async updateAppointment(
    payload: TUpdateAppointmentSchema
  ): Promise<ApiResponseBody<IAppointment>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async deleteAppointment(
    payload: TDeleteAppointmentSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }
}
