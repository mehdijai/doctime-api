declare interface IUser {
  id: string;
  email: string;
  phone: string;
  name: string;
  verifiedEmail: boolean;
  userType: string;
  createdAt: Date;
  updatedAt: Date;
}

declare interface IAuthResponse {
  accessToken: {
    token: string;
    refreshToken: string;
  };
  user: IUser;
}

declare interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

declare interface IStatusResponse {
  status: boolean;
}
