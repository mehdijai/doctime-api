import { Request, Response, NextFunction } from 'express';
import { ApiResponseBody, ResponseHandler } from '@/utils/responseHandler';
import { AuthFacade } from '@/facades/auth.facade';
import prisma from '@/services/prisma.service';

export async function requireVerifiedEmail(_: Request, res: Response, next: NextFunction) {
  try {
    const userBody = AuthFacade.get();

    if (!userBody) {
      const resBody = ResponseHandler.Unauthorized('Unauthenticated');
      res.status(resBody.error!.code).json(resBody);
    } else {
      const user = await prisma.user.findUnique({
        where: {
          id: userBody.userId,
        },
      });

      if (!user) {
        const resBody = ResponseHandler.Forbidden('Unauthorized');
        res.status(resBody.error!.code).json(resBody);
      } else {
        if (user.verifiedEmail) {
          next();
        } else {
          const resBody = ResponseHandler.Forbidden('Your email must be verified!');
          res.status(resBody.error!.code).json(resBody);
        }
      }
    }
  } catch (error: any) {
    const resBody: ApiResponseBody = {
      error: {
        code: 505,
        message: String(error),
      },
    };

    res.status(resBody.error!.code).json(resBody);
  }
}
