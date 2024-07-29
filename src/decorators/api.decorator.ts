import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { ApiResponseBody } from '@/utils/responseHandler';
import { logger } from '@/utils/winston';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function apiMethod<T>() {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const resBody = new ApiResponseBody<T>();
      try {
        const getResBody = () => resBody;
        (this as any).getResBody = getResBody;

        return await originalMethod.apply(this, args);
      } catch (err) {
        logger.error(err);
        if (err instanceof PrismaClientKnownRequestError) {
          if (
            err.code === 'P2002' &&
            err.meta?.target &&
            Array.isArray(err.meta.target) &&
            err.meta.target.includes('email')
          ) {
            resBody.error = {
              code: HttpStatusCode.CONFLICT,
              message: 'Email already exists',
            };
          } else {
            resBody.error = {
              code: HttpStatusCode.INTERNAL_SERVER_ERROR,
              message: String(err),
            };
          }
        } else {
          resBody.error = {
            code: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: String(err),
          };
        }
      } finally {
        delete (this as any).getResBody;
      }
      return resBody;
    };
    return descriptor;
  };
}
