import { Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { ResponseHandler } from '@/utils/responseHandler';
import appConfig from '@/config/app.config';

const SECRET_KEY = appConfig.jwt.secret;

export function authenticateJWT(req: IRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err || !user) {
        if (err instanceof TokenExpiredError) {
          const resBody = ResponseHandler.Unauthorized('Unauthenticated');
          res.status(resBody.error!.code).json(resBody);
        } else {
          const resBody = ResponseHandler.Forbidden('Access forbidden: Invalid token');
          res.status(resBody.error!.code).json(resBody);
        }
        return;
      }
      req.user = user;
      next();
    });
  } else {
    const resBody = ResponseHandler.Unauthorized('Access denied: No token provided');
    res.status(resBody.error!.code).json(resBody);
  }
}
