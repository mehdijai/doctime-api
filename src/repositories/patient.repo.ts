import { ApiResponseBody } from '@/utils/responseHandler';
import { apiMethod } from '@/decorators/api.decorator';
import { AuthClass } from '@/decorators/auth.decorator';

export class PatientRepository extends AuthClass {
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
