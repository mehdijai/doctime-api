import { AuthFacade } from '@/facades/auth.facade';

export class AuthClass {
  static USER: IAuthUser;
}

export function Auth(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (this: { USER: IAuthUser }, ...args: any[]) {
    this.USER = AuthFacade.get();
    return originalMethod.apply(this, args);
  };

  return descriptor;
}
