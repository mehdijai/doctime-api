import { sendEmail } from '@/services/mail.service';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';
import { ApiResponseBody, ResponseHandler } from '@/utils/responseHandler';
import { logger } from '@/utils/winston';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/services/prisma.service';
import appConfig from '@/config/app.config';
import { addTime } from '@/utils/helpers';
import { apiMethod } from '@/decorators/api.decorator';

export class AuthRepository {
  @apiMethod<IAuthResponse>()
  static async loginUser(payload: TAuthSchema): Promise<ApiResponseBody<IAuthResponse>> {
    const resBody = (this as any).getResBody();
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return ResponseHandler.Unauthorized('Credentials Error');
    }

    const isValidPassword = await bcrypt.compare(payload.password, user.password);

    if (isValidPassword) {
      const token = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken();
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: addTime(30, 'd'),
        },
      });

      const accessToken = {
        token: token,
        refreshToken: refreshToken,
      };

      const responseData = {
        accessToken: accessToken,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          verifiedEmail: user.verifiedEmail,
          userType: user.userType,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };

      resBody.data = responseData;
      return resBody;
    } else {
      return ResponseHandler.Unauthorized('Password not match');
    }
  }

  @apiMethod<IRefreshTokenResponse>()
  static async refreshToken({
    refreshToken,
  }: TRefreshTokenSchema): Promise<ApiResponseBody<IRefreshTokenResponse>> {
    const resBody = (this as any).getResBody();
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || new Date() > storedToken.expiresAt) {
      return ResponseHandler.Unauthorized('Invalid or expired refresh token');
    }

    const newAccessToken = generateAccessToken(storedToken.userId);
    const newRefreshToken = generateRefreshToken();

    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        token: newRefreshToken,
        expiresAt: addTime(30, 'd'),
      },
    });

    resBody.data = { accessToken: newAccessToken, refreshToken: newRefreshToken };
    return resBody;
  }

  @apiMethod<IUser>()
  static async createUser(payload: TRegisterSchema): Promise<ApiResponseBody<IUser>> {
    const resBody = (this as any).getResBody();

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        phone: payload.phone,
        name: payload.name,
        password: bcrypt.hashSync(payload.password, 10),
        userType: payload.type,
      },
    });

    resBody.data = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      verifiedEmail: user.verifiedEmail,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (appConfig.requireVerifyEmail) {
      await this.sendEmailVerification(user);
    }
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async forgotPassword(
    payload: TForgetPasswordSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();

    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
        userType: payload.type,
      },
    });

    if (!user) {
      return ResponseHandler.NotFound('User not found');
    }

    const token = uuidv4();

    await prisma.resetPasswordToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: addTime(30, 'm'),
      },
    });

    const bodyHTML = `<h1>Reset Password</h1>
      <p>Click here to reset your password:</p>
      <a id="token-link" href="${process.env.RESET_PASSWORD_UI_URL}/${token}">Reset Password</a><br>
        or copy this link: <br>
        <span>${process.env.RESET_PASSWORD_UI_URL}/${token}</span>`;

    if (user) {
      sendEmail({
        receivers: [user.email],
        subject: 'Reset Password',
        html: bodyHTML,
      });
    }

    resBody.data = {
      status: true,
    };

    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async resetPassword(
    payload: TResetPasswordSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();
    const token = await prisma.resetPasswordToken.findUnique({
      where: {
        token: payload.token,
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!token) {
      return ResponseHandler.Forbidden('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    await prisma.user.update({
      where: {
        id: token.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.resetPasswordToken.delete({
      where: {
        token: payload.token,
      },
    });

    resBody.data = {
      status: true,
    };
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async updatePassword(
    payload: TUpdatePasswordSchema,
    userId: string
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      resBody.error = {
        code: HttpStatusCode.NOT_FOUND,
        message: 'User not found',
      };
      return resBody;
    }

    const isValidPassword = await bcrypt.compare(payload.oldPassword, user.password);

    if (!isValidPassword) {
      return ResponseHandler.Unauthorized('Invalid old password');
    }

    if (appConfig.updatePasswordRequireVerification) {
      await this.sendConfirmPasswordUpdate(user, payload.newPassword);
    } else {
      const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });
    }
    resBody.data = {
      status: true,
    };

    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async confirmUpdatePassword(
    payload: TValidateUserSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();
    const token = await prisma.updatePasswordToken.findUnique({
      where: {
        token: payload.token,
      },
    });

    if (!token) {
      return ResponseHandler.Forbidden('Invalid or expired token');
    }

    await prisma.user.update({
      where: {
        id: token.userId,
      },
      data: {
        password: token.newPassword,
      },
    });

    await prisma.updatePasswordToken.delete({
      where: {
        token: payload.token,
      },
    });

    resBody.data = {
      status: true,
    };

    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async verifyUser(payload: TValidateUserSchema): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();
    const token = await prisma.verifyEmailToken.findUnique({
      where: {
        token: payload.token,
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!token) {
      return ResponseHandler.Forbidden('Invalid or expired token');
    }

    await prisma.user.update({
      where: {
        id: token.userId,
      },
      data: {
        verifiedEmail: true,
      },
    });

    await prisma.verifyEmailToken.delete({
      where: {
        token: payload.token,
      },
    });

    resBody.data = {
      status: true,
    };

    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async deleteUser(payload: TValidateUserSchema): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();
    return resBody;
  }

  @apiMethod<IStatusResponse>()
  static async confirmDeleteUser(
    payload: TValidateUserSchema
  ): Promise<ApiResponseBody<IStatusResponse>> {
    const resBody = (this as any).getResBody();
    return resBody;
  }

  private static async sendEmailVerification(user: User) {
    try {
      const token = uuidv4();

      await prisma.verifyEmailToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: addTime(1, 'h'),
        },
      });

      const bodyHTML = `<h1>Verify Your Email</h1>
        <p>Verify your email. The link expires after <strong>1 hour</strong>.</p>
        <a id="token-link" href="${process.env.VERIFY_EMAIL_UI_URL}/${token}">Confirm Email</a><br>
        or copy this link: <br>
        <span>${process.env.VERIFY_EMAIL_UI_URL}/${token}</span>`;

      sendEmail({
        receivers: [user.email],
        subject: 'Verify Email',
        html: bodyHTML,
      });
    } catch (err) {
      logger.error({ message: 'Send Email Verification Error:', error: err });
    }
  }

  private static async sendConfirmPasswordUpdate(user: User, newPassword: string) {
    try {
      const token = uuidv4();

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.updatePasswordToken.create({
        data: {
          token,
          newPassword: hashedPassword,
          userId: user.id,
          expiresAt: addTime(1, 'h'),
        },
      });

      const bodyHTML = `<h1>Confirm password update</h1>
        <p>Confirm updating password. The link expires after <strong>1 hour</strong>.</p>
        <a id="token-link" href="${process.env.CONFIRM_UPDATE_PASSWORD_EMAIL_UI_URL}/${token}">Confirm password</a><br>
        or copy this link: <br>
        <span>${process.env.CONFIRM_UPDATE_PASSWORD_EMAIL_UI_URL}/${token}</span>`;

      sendEmail({
        receivers: [user.email],
        subject: 'Update Password',
        html: bodyHTML,
      });
    } catch (err) {
      logger.error({ message: 'Send password update Email Error:', error: err });
    }
  }
}
