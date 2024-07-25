import appConfig from '@/config/app.config';
import winston, { transports } from 'winston';

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({
      filename: appConfig.logRootPath + '/errors.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: appConfig.logRootPath + '/warnings.log',
      level: 'warn',
    }),
    new winston.transports.File({ filename: appConfig.logRootPath + '/info.log', level: 'info' }),
    new winston.transports.File({ filename: appConfig.logRootPath + '/debug.log', level: 'debug' }),
    new winston.transports.File({
      filename: appConfig.logRootPath + (process.env.STAGE === 'TEST' ? '/test.log' : '/app.log'),
      level: '',
    }),
  ],
});

logger.exceptions.handle(
  new transports.File({ filename: appConfig.logRootPath + '/exceptions.log' })
);
