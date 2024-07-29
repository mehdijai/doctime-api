import { AuthFacade } from '@/facades/auth.facade';

export class AuthClass {
  static USER: IAuthUser;
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
