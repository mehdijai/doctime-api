import bcrypt from 'bcryptjs';
import prisma from '@/services/prisma.service';
import { addTime } from './helpers';
import appConfig, { parseStrPeriod } from '@/config/app.config';
import crypto from 'crypto';

export class OTPHandler {
  static async generate(userId: string) {
    const digits = '0123456789';
    let otpValue = '';
    for (let i = 0; i < appConfig.mfa.otp.digits; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otpValue += digits[randomIndex];
    }

    const timePeriod = parseStrPeriod(appConfig.mfa.otp.expirationPeriod);

    await prisma.otps.create({
      data: {
        otp: bcrypt.hashSync(otpValue, 10),
        expiresAt: addTime(timePeriod.value, timePeriod.unit),
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
    const otpRecord = await prisma.otps.findUnique({
      where: {
        userId,
      },
    });

    if (!otpRecord) return false;

    if (otpRecord.expiresAt < new Date()) return false;

    const isValid = bcrypt.compareSync(otpValue, otpRecord.otp);
    if (!isValid) {
      return false;
    }

    await prisma.otps.delete({
      where: {
        id: otpRecord.id,
      },
    });

    return true;
  }
}
