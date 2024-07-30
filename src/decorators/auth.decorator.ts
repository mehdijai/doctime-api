import { AuthFacade } from '@/facades/auth.facade';
import prisma from '@/services/prisma.service';
import { $Enums } from '@prisma/client';

export class AuthClass {
  static USER: IAuthUser;
  protected static async isValidUser(userId: string, type: $Enums.UserType) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user?.userType === type;
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
