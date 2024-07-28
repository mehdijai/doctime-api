import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '@/middlewares/validateRequest.middleware';
import { AuthRepository } from '@/repositories/auth.repo';
import { authenticateJWT } from '@/middlewares/jwt.middleware';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { AuthZODSchema } from '@/schemas/auth/auth.schema';

const AuthRoutes = Router();

AuthRoutes.post(
  '/login',
  validate(AuthZODSchema.authSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TAuthSchema = req.body;
      const resBody = await AuthRepository.loginUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/refresh-token',
  validate(AuthZODSchema.refreshTokenSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TRefreshTokenSchema = req.body;
      const resBody = await AuthRepository.refreshToken(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/register',
  validate(AuthZODSchema.registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TRegisterSchema = req.body;
      const resBody = await AuthRepository.createUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/forget-password',
  validate(AuthZODSchema.forgetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TForgetPasswordSchema = req.body;
      const resBody = await AuthRepository.forgotPassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/reset-password',
  validate(AuthZODSchema.resetPasswordSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TResetPasswordSchema = req.body;
      const resBody = await AuthRepository.resetPassword(body);
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
  validate(AuthZODSchema.updatePasswordSchema),
  async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const body: TUpdatePasswordSchema = req.body;
      const resBody = await AuthRepository.updatePassword(body, req.user.userId);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/confirm-update-password',
  validate(AuthZODSchema.validateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TValidateUserSchema = req.body;
      const resBody = await AuthRepository.confirmUpdatePassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/verify-user',
  validate(AuthZODSchema.validateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TValidateUserSchema = req.body;
      const resBody = await AuthRepository.verifyUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default AuthRoutes;
