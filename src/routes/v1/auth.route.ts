import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '@/middlewares/validateRequest.middleware';
import {
  authSchema,
  forgetPasswordSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  TAuthSchema,
  TForgetPasswordSchema,
  TRefreshTokenSchema,
  TRegisterSchema,
  TResetPasswordSchema,
  TUpdatePasswordSchema,
  TValidateUserSchema,
  updatePasswordSchema,
  validateUserSchema,
} from '@/schemas/auth.schema';
import {
  confirmUpdatePassword,
  createUser,
  forgotPassword,
  loginUser,
  refreshToken,
  resetPassword,
  updatePassword,
  verifyUser,
} from '@/repositories/auth.repo';
import { authenticateJWT } from '@/middlewares/jwt.middleware';
import HttpStatusCode from '@/utils/HTTPStatusCodes';

const AuthRoutes = Router();

AuthRoutes.post(
  '/login',
  validate(authSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TAuthSchema = req.body;
      const resBody = await loginUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TRefreshTokenSchema = req.body;
      const resBody = await refreshToken(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/register',
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TRegisterSchema = req.body;
      const resBody = await createUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/forget-password',
  validate(forgetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TForgetPasswordSchema = req.body;
      const resBody = await forgotPassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/reset-password',
  validate(resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TResetPasswordSchema = req.body;
      const resBody = await resetPassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/update-password',
  authenticateJWT,
  validate(updatePasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TUpdatePasswordSchema = req.body;
      const resBody = await updatePassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/confirm-update-password',
  validate(validateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TValidateUserSchema = req.body;
      const resBody = await confirmUpdatePassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/verify-user',
  validate(validateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TValidateUserSchema = req.body;
      const resBody = await verifyUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default AuthRoutes;
