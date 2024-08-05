import { AuthFacade } from '@/facades/auth.facade';
import { ConfirmDeleteMailer } from '@/mailers/confirm-deleting.mailer';
import prisma from '@/services/prisma.service';
import { addTime } from '@/utils/helpers';
import { logger } from '@/utils/winston';
import { $Enums, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class AuthClass {
  static USER: IAuthUser;
  protected static async isValidUser(userId: string, type: $Enums.UserType) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (user?.patient || user?.doctor) {
      return false;
    }

    return user?.userType === type;
  }

  protected static async sendConfirmDeletionToken(user: User) {
    try {
      const token = uuidv4();

      await prisma.confirmDeletionToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: addTime(1, 'h'),
        },
      });
      const _mailer = new ConfirmDeleteMailer([user.email]);
      await _mailer.generate({
        name: user.name,
        verificationLink: `${process.env.DELETE_PROFILE_UI_URL}/${token}`,
      });
      await _mailer.send();
    } catch (err) {
      logger.error({ message: 'Send Email Verification Error:', error: err });
    }
  }
}

export function Auth(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (this: { USER: IAuthUser }, ...args: any[]) {
    const user = AuthFacade.get();
    if (!user) {
      throw new Error('User not found');
    }
    this.USER = user;
    return originalMethod.apply(this, args);
  };

  return descriptor;
}
