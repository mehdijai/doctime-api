import { Response } from 'express';
import HttpStatusCode from './HTTPStatusCodes';

export class ApiResponseBody<T = undefined> {
  error?: {
    code: number;
    message: string;
  };
  data?: T;
}

export class ResponseHandler {
  static res: Response;
  static response(message: any, status: HttpStatusCode) {
    const response = new ApiResponseBody();
    response.error = {
      code: status,
      message: message,
    };
    return response;
  }
  static NoDataResponse(message: any = 'Operation successful') {
    return this.response(message, HttpStatusCode.OK);
  }
  static NotFound(message: any = 'Not found') {
    return this.response(message, HttpStatusCode.NOT_FOUND);
  }
  static InvalidBody(message: any = 'Invalid request body') {
    return this.response(message, HttpStatusCode.UNPROCESSABLE_ENTITY);
  }
  static Unauthorized(message: any = 'Unauthorized') {
    return this.response(message, HttpStatusCode.UNAUTHORIZED);
  }
  static Forbidden(message: any = 'Forbidden') {
    return this.response(message, HttpStatusCode.FORBIDDEN);
  }
  static BadRequest(message: any = 'Bad Request') {
    return this.response(message, HttpStatusCode.BAD_REQUEST);
  }
}
