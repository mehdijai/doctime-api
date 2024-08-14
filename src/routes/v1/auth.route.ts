import { NextFunction, Request, Response } from 'express';
import { AuthRepository } from '@/repositories/auth.repo';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { AuthZODSchema } from '@/schemas/auth/auth.schema';
import { AuthGuard, Middlewares, Post, RequestBody } from '@/decorators/router.decorator';
import { MainRouter } from '../router';
import { parseAPIVersion } from '@/config/app.config';

class AuthRouter extends MainRouter {
  constructor(prefix: string) {
    super(prefix, 'Auth');
  }

  @RequestBody(AuthZODSchema.authSchema, 'authSchema')
  @Post('/login')
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TAuthSchema = req.body;
      const resBody = await AuthRepository.loginUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @RequestBody(AuthZODSchema.sendMFARequestSchema, 'sendMFARequestSchema')
  @Post('/send-mfa-request')
  async sendMFARequest(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TSendMFARequestSchema = req.body;
      const resBody = await AuthRepository.sendMFARequest(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @RequestBody(AuthZODSchema.confirmMFASchema, 'confirmMFASchema')
  @Post('/confirm-mfa-request')
  async confirmMfaRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TConfirmMFASchema = req.body;
      const resBody = await AuthRepository.confirmMFARequest(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @RequestBody(AuthZODSchema.refreshTokenSchema, 'refreshTokenSchema')
  @Post('/refresh-token')
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TRefreshTokenSchema = req.body;
      const resBody = await AuthRepository.refreshToken(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @RequestBody(AuthZODSchema.registerSchema, 'registerSchema')
  @Post('/register')
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TRegisterSchema = req.body;
      const resBody = await AuthRepository.createUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @RequestBody(AuthZODSchema.forgetPasswordSchema, 'forgetPasswordSchema')
  @Post('/forget-password')
  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TForgetPasswordSchema = req.body;
      const resBody = await AuthRepository.forgotPassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @RequestBody(AuthZODSchema.resetPasswordSchema, 'resetPasswordSchema')
  @Post('/reset-password')
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TResetPasswordSchema = req.body;
      const resBody = await AuthRepository.resetPassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @RequestBody(AuthZODSchema.updatePasswordSchema, 'updatePasswordSchema')
  @Post('/update-password')
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TUpdatePasswordSchema = req.body;
      const resBody = await AuthRepository.updatePassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @RequestBody(AuthZODSchema.validateUserSchema, 'validateUserSchema')
  @Post('/confirm-update-password')
  async confirmUpdatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TValidateUserSchema = req.body;
      const resBody = await AuthRepository.confirmUpdatePassword(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @RequestBody(AuthZODSchema.validateUserSchema, 'validateUserSchema')
  @Post('/verify-user')
  async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TValidateUserSchema = req.body;
      const resBody = await AuthRepository.verifyUser(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Post('/verify-phone-number')
  async verifyPhoneNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const resBody = await AuthRepository.verifyUserPhoneNumber();
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @RequestBody(AuthZODSchema.validateOTPSchema, 'validateOTPSchema')
  @Post('/confirm-phone-number')
  async confirmPhoneNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TValidateOTPSchema = req.body;
      const resBody = await AuthRepository.confirmUserPhoneNumber(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @RequestBody(AuthZODSchema.validateOTPSchema, 'validateOTPSchema')
  @Post('/confirm-verification-otp')
  async confirmVerificationOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TValidateOTPSchema = req.body;
      const resBody = await AuthRepository.confirm2faOtp(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Post('/enable-mfa')
  async enableMfa(req: Request, res: Response, next: NextFunction) {
    try {
      const resBody = await AuthRepository.enableMFA();
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Post('/disable-mfa')
  async disableMfa(req: Request, res: Response, next: NextFunction) {
    try {
      const resBody = await AuthRepository.enableMFA();
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @RequestBody(AuthZODSchema.setPermissionSchema, 'setPermissionSchema')
  @Post('/set-permission')
  async setPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TSetPermissionSchema = req.body;
      const resBody = await AuthRepository.setPermission(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
}

const authRoute = new AuthRouter(parseAPIVersion(1) + '/auth');
export const authRoutes = authRoute.getRoute(authRoute);
