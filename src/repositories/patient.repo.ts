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
import { apiMethod } from '@/decorators/api.decorator';

export class PatientRepository {
  @apiMethod<IPrivatePatient>()
  static async getPatient(
    patientId: string,
    doctorId: string
  ): Promise<ApiResponseBody<IPrivatePatient>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }

  @apiMethod<IPublicPatient[]>()
  static async getPatients(
    searchPayload: TSearchPatientSchema,
    doctorId: string
  ): Promise<ApiResponseBody<IPublicPatient[]>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }

  @apiMethod<IPrivatePatient>()
  static async createPatient(
    payload: TCreatePatientSchema
  ): Promise<ApiResponseBody<IPrivatePatient>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }

  @apiMethod<IPrivatePatient>()
  static async updatePatient(
    payload: TUpdatePatientSchema
  ): Promise<ApiResponseBody<IPrivatePatient>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async deletePatient(
    payload: TDeletePatientSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();
    //
    return resBody;
  }
}
