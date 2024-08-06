import { config } from 'dotenv';
config();

// Configs
const appConfig = {
  apiURI: '/api/$v',
  requireVerifyEmail: true,
  updatePasswordRequireVerification: true,
  deleteProfileRequireVerification: true,
  supportEmail: 'support@doctime.com',
  apiVersion: '1.0.0',
  apiName: 'DocTime API',
  appName: 'DocTime',
  jwt: {
    secret: process.env.JWT_SECRET_KEY!,
    refreshSecretKey: process.env.REFRESH_SECRET_KEY!,
    expiresIn: '15d',
  },
  logRootPath: '.logs',
  mfa: {
    otp: {
      expirationPeriod: '5m',
      digits: 6,
      throttle: '1m',
    },
  },
};

export default appConfig;

export function parseAPIVersion(version: number) {
  return appConfig.apiURI.replace('$v', `v${version}`);
}

export function parseStrPeriod(timePeriod: string) {
  const regex = /^(\d+)(ms|s|m|h|d)$/;
  const match = timePeriod.match(regex);

  if (!match) {
    throw new Error('Invalid time period format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2] as TimeUnit;

  return { value, unit };
}
