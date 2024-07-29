export class AuthFacade {
  private static authBody: IAuthUser | null = null;

  static set(userId: string, timestamp: number) {
    this.authBody = {
      userId,
      timestamp,
    };
  }
  static get() {
    return this.authBody;
  }
}
