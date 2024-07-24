import appConfig from '@/config/app.config';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiresIn });
};

export const generateRefreshToken = () => {
  return uuidv4();
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, appConfig.jwt.secret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, appConfig.jwt.refreshSecretKey);
};
