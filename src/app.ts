import bodyParser from 'body-parser';
import express, { NextFunction, Response, Express, Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'x-xss-protection';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { parseAPIVersion } from './config/app.config';
import HttpStatusCode from './utils/HTTPStatusCodes';
import prisma from '@/services/prisma.service';
import { ResponseHandler } from '@/utils/responseHandler';
import { join } from 'path';
import { SwaggerService } from './services/swagger.service';
import { v1Routes } from './routes/v1';

export class App {
  app: Application;
  swaggerInstance: SwaggerService;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    SwaggerService.initializeSchemas();
    this.swaggerInstance = new SwaggerService(this.app);
    this.swaggerInstance.setupSwagger();
    this.setupMainApiRoute();
    // this.printRoutes();
  }

  private setupMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      })
    );
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(cookieParser());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    });
    this.app.use(limiter);

    this.app.use(express.static(join(__dirname, '../public')));
  }

  private setupMainApiRoute() {
    this.app.use(parseAPIVersion(1), v1Routes);

    this.app.all('*', (_, res: Response, next: NextFunction) => {
      const resBody = ResponseHandler.NotFound('Route Not Found');
      res.status(HttpStatusCode.NOT_FOUND).json(resBody);
      next();
    });
  }

  private printRoutes() {
    interface RouteInfo {
      path: string;
      methods: string;
    }
    function cleanPath(regexPath: string): string {
      return regexPath
        .replace(/\^\\\//g, '/')
        .replace(/\\\/\?\(\?=\.\*\$\)/g, '')
        .replace(/\\\//g, '/')
        .replace(/\(\?:\(\[\^\\\/]\+\?\(\?:\\\/\)\?\)\)/g, ':id')
        .replace('/?(?=/|$)', '');
    }
    function getRoutes(stack: any[], parentPath = ''): RouteInfo[] {
      const routes: RouteInfo[] = [];
      stack.forEach((middleware) => {
        if (middleware.route) {
          // Routes registered directly on the app
          const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
          routes.push({ path: parentPath + middleware.route.path, methods });
        } else if (middleware.name === 'router') {
          // Routes added via router middleware
          const nestedPath = cleanPath(middleware.regexp.source);
          routes.push(...getRoutes(middleware.handle.stack, parentPath + nestedPath));
        }
      });
      return routes;
    }
    const routes = getRoutes(this.app._router.stack);
    routes.forEach((route) => {
      console.log(`${route.methods}: ${route.path}`);
    });
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Listening to port ${process.env.PORT}`);
    });
  }
}

// Handle Routes

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default new App();
