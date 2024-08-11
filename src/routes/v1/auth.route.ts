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
  '/send-mfa-request',
  validate(AuthZODSchema.sendMFARequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TSendMFARequestSchema = req.body;
      const resBody = await AuthRepository.sendMFARequest(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/confirm-mfa-request',
  validate(AuthZODSchema.confirmMFASchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TConfirmMFASchema = req.body;
      const resBody = await AuthRepository.confirmMFARequest(body);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TUpdatePasswordSchema = req.body;
      const resBody = await AuthRepository.updatePassword(body);
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

AuthRoutes.post(
  '/verify-phone-number',
  authenticateJWT,
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      const resBody = await AuthRepository.verifyUserPhoneNumber();
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/confirm-phone-number',
  authenticateJWT,
  validate(AuthZODSchema.validateOTPSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TValidateOTPSchema = req.body;
      const resBody = await AuthRepository.confirmUserPhoneNumber(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

// 2FA

AuthRoutes.post(
  '/confirm-verification-otp',
  authenticateJWT,
  validate(AuthZODSchema.validateOTPSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TValidateOTPSchema = req.body;
      const resBody = await AuthRepository.confirm2faOtp(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/enable-mfa',
  authenticateJWT,
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      const resBody = await AuthRepository.enableMFA();
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/disable-mfa',
  authenticateJWT,
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      const resBody = await AuthRepository.enableMFA();
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  '/set-permission',
  validate(AuthZODSchema.setPermissionSchema),
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TSetPermissionSchema = req.body;
      const resBody = await AuthRepository.setPermission(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default AuthRoutes;
