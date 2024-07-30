import { AuthFacade } from '@/facades/auth.facade';
import { sendEmail } from '@/services/mail.service';
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

      const bodyHTML = `<h1>Confirm deleting profile</h1>
        <p>Confirm deleting your profile. The link expires after <strong>1 hour</strong>.</p>
        <a id="token-link" href="${process.env.DELETE_PROFILE_UI_URL}/${token}">Confirm delete profile</a><br>
        or copy this link: <br>
        <span>${process.env.DELETE_PROFILE_UI_URL}/${token}</span>`;

      sendEmail({
        receivers: [user.email],
        subject: 'Confirm deleting profile',
        html: bodyHTML,
      });
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
