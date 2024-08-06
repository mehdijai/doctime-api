import crypto from 'crypto';
import prisma from '@/services/prisma.service';
import { addTime } from './helpers';

export class OTPHandler {
  static async generate(userId: string) {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();

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

  static async validateOTP(userId: string, otpValue: string) {
    const otpRecord = await prisma.oTPS.findUnique({
      where: {
        userId,
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
