import appConfig from '@/config/app.config';
import winston, { transports } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

// const transportOptions: DailyRotateFile.DailyRotateFileTransportOptions = {
//   datePattern: 'YYYY-MM-DD-HH',
//   zippedArchive: false,
//   maxFiles: '14d',
//   filename: 'errors-%DATE%.log',
//   dirname: appConfig.logRootPath,
// };

// const errorTransport: DailyRotateFile = new DailyRotateFile({
//   ...transportOptions,
//   filename: 'errors-%DATE%.log',
//   level: 'error',
// });
// const warnTransport: DailyRotateFile = new DailyRotateFile({
//   ...transportOptions,
//   level: 'warn',
//   filename: 'warnings-%DATE%.log',
// });
// const infoTransport: DailyRotateFile = new DailyRotateFile({
//   ...transportOptions,
//   level: 'info',
//   filename: 'info-%DATE%.log',
// });
// const debugTransport: DailyRotateFile = new DailyRotateFile({
//   ...transportOptions,
//   level: 'debug',
//   filename: 'debug-%DATE%.log',
// });
// const combinedTransport: DailyRotateFile = new DailyRotateFile({
//   ...transportOptions,
//   filename: 'app-%DATE%.log',
// });

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
    // errorTransport,
    // warnTransport,
    // infoTransport,
    // debugTransport,
    // combinedTransport,
  ],
});

logger.exceptions.handle(
  new transports.File({ filename: appConfig.logRootPath + '/exceptions.log' })
);
