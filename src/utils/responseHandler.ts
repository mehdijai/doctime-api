import HttpStatusCode from './HTTPStatusCodes';

export class ApiResponseBody<T = undefined> {
  error?: {
    code: HttpStatusCode;
    message: string;
  };
  data?: T;
}

export class APIError extends Error {
  code: number;

  constructor(code: HttpStatusCode, message: string) {
    super(message);
    this.code = code;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, APIError.prototype);
  }

  toString() {
    return `Error ${this.code}: ${this.message}`;
  }
}

export class NotFoundError extends APIError {
  constructor(message: string) {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}
export class UnauthorizedError extends APIError {
  constructor(message: string) {
    super(HttpStatusCode.UNAUTHORIZED, message);
  }
}
export class ForbiddenError extends APIError {
  constructor(message: string) {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}

export class ResponseHandler {
  static response<T>(message: any, status: HttpStatusCode) {
    const response = new ApiResponseBody<T>();
    response.error = {
      code: status,
      message: message,
    };
    return response;
  }
  static NoDataResponse<T>(message: any = 'Operation successful') {
    return this.response<T>(message, HttpStatusCode.OK);
  }
  static NotFound<T>(message: any = 'Not found') {
    return this.response<T>(message, HttpStatusCode.NOT_FOUND);
  }
  static InvalidBody<T>(message: any = 'Invalid request body') {
    return this.response<T>(message, HttpStatusCode.UNPROCESSABLE_ENTITY);
  }
  static Unauthorized<T>(message: any = 'Unauthorized') {
    return this.response<T>(message, HttpStatusCode.UNAUTHORIZED);
  }
  static Forbidden<T>(message: any = 'Forbidden') {
    return this.response<T>(message, HttpStatusCode.FORBIDDEN);
  }
  static BadRequest<T>(message: any = 'Bad Request') {
    return this.response<T>(message, HttpStatusCode.BAD_REQUEST);
  }
}
