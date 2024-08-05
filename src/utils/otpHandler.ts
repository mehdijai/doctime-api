import crypto from 'crypto';
import prisma from '@/services/prisma.service';
import { addTime } from './helpers';

export class OTPHandler {
  static async generate(userId: string) {
    const otpValue = crypto.randomBytes(4).toString('hex');

    await prisma.oTPS.create({
      data: {
        otp: otpValue,
        expiresAt: addTime(5, 'm'),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return otpValue;
  }

  static async validateOTP(otpValue: string) {
    const otpRecord = await prisma.oTPS.findUnique({
      where: {
        otp: otpValue,
      },
    });

    if (!otpRecord) return false;

    if (otpRecord.expiresAt < new Date()) return false;

    await prisma.oTPS.delete({
      where: {
        otp: otpValue,
      },
    });

    return true;
  }
}
