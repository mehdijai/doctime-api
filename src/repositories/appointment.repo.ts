import { ApiResponseBody } from '@/utils/responseHandler';
import { apiMethod } from '@/decorators/api.decorator';
import { AuthClass } from '@/decorators/auth.decorator';

export class AppointmentRepository extends AuthClass {
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
