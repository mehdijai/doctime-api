import { config } from 'dotenv';
config();

// Configs
const appConfig = {
  apiURI: '/api/$v',
  requireVerifyEmail: true,
  updatePasswordRequireVerification: true,
  apiVersion: '1.0.0',
  apiName: 'DocTime API',
  jwt: {
    secret: process.env.JWT_SECRET_KEY!,
    refreshSecretKey: process.env.REFRESH_SECRET_KEY!,
    expiresIn: '15d',
  },
  logRootPath: '.logs',
};

export default appConfig;

export function parseAPIVersion(version: number) {
  return appConfig.apiURI.replace('$v', `v${version}`);
}
