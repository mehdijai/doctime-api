import {
  TAuthSchema,
  TForgetPasswordSchema,
  TRefreshTokenSchema,
  TRegisterSchema,
  TResetPasswordSchema,
  TUpdatePasswordSchema,
  TValidateUserSchema,
} from '@/schemas/auth.schema';
import { sendEmail } from '@/services/mail.service';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwtHandler';
import { ApiResponseBody, ResponseHandler } from '@/utils/ResponseHandler';
import { logger } from '@/utils/winston';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/services/prisma.service';
import appConfig from '@/config/app.config';
import { addTime } from '@/utils/herlpers';

// TODO: Convert to class

export async function loginUser(payload: TAuthSchema) {
  const resBody = new ApiResponseBody<any>();
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!user) {
      const resBody = ResponseHandler.Unauthorized('Credentials Error');
      return resBody;
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

      const responseData: any = {
        accessToken: accessToken,
        user: {
          id: user.id,
          userType: user.userType,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };

      if (user.patient) {
        responseData.user = {
          ...responseData.user,
          patient: user.patient,
        };
      }
      if (user.doctor) {
        responseData.user = {
          ...responseData.user,
          doctor: user.doctor,
        };
      }
      resBody.data = responseData;
      return resBody;
    } else {
      const resBody = ResponseHandler.Unauthorized('Password not match');
      return resBody;
    }
  } catch (err) {
    logger.error(err);
    resBody.error = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: String(err),
    };
  }
  return resBody;
}
export async function refreshToken({ refreshToken }: TRefreshTokenSchema) {
  const resBody = new ApiResponseBody<any>();
  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || new Date() > storedToken.expiresAt) {
      const resBody = ResponseHandler.Unauthorized('Invalid or expired refresh token');
      return resBody;
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
  } catch (err) {
    logger.error(err);
    resBody.error = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: String(err),
    };
  }
  return resBody;
}
export async function createUser(payload: TRegisterSchema) {
  const resBody = new ApiResponseBody<any>();

  try {
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        phone: payload.phone,
        name: payload.name,
        password: bcrypt.hashSync(payload.password, 10),
        userType: payload.type,
      },
    });

    resBody.data = user;

    if (appConfig.requireVerifyEmail) {
      await sendEmailVerification(user);
    }
  } catch (err) {
    logger.error(err);
    resBody.error = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: String(err),
    };
  }
  return resBody;
}
async function sendEmailVerification(user: User) {
  try {
    const token = uuidv4();

    await prisma.verifyEmailToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: addTime(1, 'h'), // TODO: Fix Time conversions
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
export async function forgotPassword(payload: TForgetPasswordSchema) {
  const resBody = new ApiResponseBody<any>();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
        userType: payload.type,
      },
    });

    if (!user) {
      resBody.error = {
        code: HttpStatusCode.NOT_FOUND,
        message: 'User not found',
      };
      return resBody;
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
  } catch (err) {
    logger.error(err);
    resBody.error = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: String(err),
    };
  }
  return resBody;
}
export async function resetPassword(payload: TResetPasswordSchema) {
  const resBody = new ApiResponseBody<any>();
  try {
    const token = await prisma.resetPasswordToken.findUnique({
      where: {
        token: payload.token,
      },
      include: {
        user: true,
      },
    });

    if (!token) {
      resBody.error = {
        code: HttpStatusCode.FORBIDDEN,
        message: 'Invalid or expired token',
      };
      return resBody;
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
  } catch (err) {
    logger.error(err);
    resBody.error = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: String(err),
    };
  }
  return resBody;
}
export async function updatePassword(payload: TUpdatePasswordSchema) {
  const resBody = new ApiResponseBody<any>();
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
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
      resBody.error = {
        code: HttpStatusCode.UNAUTHORIZED,
        message: 'Invalid old password',
      };
      return resBody;
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    await prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    resBody.data = {
      status: true,
    };
  } catch (err) {
    logger.error(err);
    resBody.error = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: String(err),
    };
  }
  return resBody;
}
export async function verifyUser(payload: TValidateUserSchema) {
  const resBody = new ApiResponseBody<any>();
  try {
    const token = await prisma.verifyEmailToken.findUnique({
      where: {
        token: payload.token,
      },
      include: {
        user: true,
      },
    });

    if (!token) {
      resBody.error = {
        code: HttpStatusCode.NOT_FOUND,
        message: 'Invalid or expired token',
      };
      return resBody;
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
  } catch (err) {
    logger.error(err);
    resBody.error = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: String(err),
    };
  }
  return resBody;
}
