import bodyParser from 'body-parser';
import express, { NextFunction, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'x-xss-protection';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import v1Routes from './routes/v1';
import { parseAPIVersion } from './config/app.config';
import HttpStatusCode from './utils/HTTPStatusCodes';
import prisma from '@/services/prisma.service';
import { ResponseHandler } from '@/utils/responseHandler';
import { join } from 'path';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(helmet());
app.use(xss());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.static(join(__dirname, '../public')));

// Handle Routes
app.use(parseAPIVersion(1), v1Routes);

app.all('*', (_, res: Response, next: NextFunction) => {
  const resBody = ResponseHandler.NotFound('Route Not Found');
  res.status(HttpStatusCode.NOT_FOUND).json(resBody);
  next();
});
// interface RouteInfo {
//   path: string;
//   methods: string;
// }
// function cleanPath(regexPath: string): string {
//   return regexPath
//     .replace(/\^\\\//g, '/') // Remove the initial ^\/
//     .replace(/\\\/\?\(\?=\.\*\$\)/g, '') // Remove trailing ?(?=.*$)
//     .replace(/\\\//g, '/') // Replace escaped slashes with regular slashes
//     .replace(/\(\?:\(\[\^\\\/]\+\?\(\?:\\\/\)\?\)\)/g, ':id') // Convert named params like (?:([^\/]+?)(?:\/)?) to :id
//     .replace("/?(?=/|$)", '') // Remove trailing ?(?=.*$)
// }

// function getRoutes(stack: any[], parentPath = ''): RouteInfo[] {
//   const routes: RouteInfo[] = [];
//   stack.forEach((middleware) => {
//     if (middleware.route) {
//       // Routes registered directly on the app
//       const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
//       routes.push({ path: parentPath + middleware.route.path, methods });
//     } else if (middleware.name === 'router') {
//       // Routes added via router middleware
//       const nestedPath = cleanPath(middleware.regexp.source);
//       routes.push(...getRoutes(middleware.handle.stack, parentPath + nestedPath));
//     }
//   });
//   return routes;
// }

// const routes = getRoutes(app._router.stack);
// routes.forEach((route) => {
//   console.log(`${route.methods}: ${route.path}`);
// });

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
