import { Response, NextFunction, Request } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { ResponseHandler } from '@/utils/responseHandler';
import appConfig from '@/config/app.config';
import { AuthFacade } from '@/facades/auth.facade';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, appConfig.jwt.secret, (err, user) => {
      if (err || !user) {
        if (err instanceof TokenExpiredError) {
          const resBody = ResponseHandler.Unauthorized('Unauthenticated');
          res.status(resBody.error!.code).json(resBody);
        } else {
          const resBody = ResponseHandler.Forbidden('Access forbidden: Invalid token');
          res.status(resBody.error!.code).json(resBody);
        }
      } else {
        const { userId, timestamp, ...jwtPayload } = user as jwt.JwtPayload;
        AuthFacade.set(userId, timestamp);
        next();
      }
    });
  } else {
    const resBody = ResponseHandler.Unauthorized('Access denied: No token provided');
    res.status(resBody.error!.code).json(resBody);
  }
}
