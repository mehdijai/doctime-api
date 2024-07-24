import appConfig from '@/config/app.config';
import winston from 'winston';

export const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: appConfig.logRootPath + '/error.log', level: 'warn' }),
    new winston.transports.File({ filename: appConfig.logRootPath + '/app.log' }),
  ],
});
