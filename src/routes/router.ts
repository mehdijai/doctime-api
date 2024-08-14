import { parseAPIVersion } from '@/config/app.config';
import { Route } from '@/decorators/router.decorator';
import { authenticateJWT } from '@/middlewares/jwt.middleware';
import { MetadataService } from '@/services/metadata.service';
import { OpenAPIDocInstance } from '@/utils/openAPIGenerator';
import { Router } from 'express';

export class MainRouter {
  protected routes: Router;

  constructor(
    protected pathPrefix: string,
    protected tag: string
  ) {
    this.routes = Router();
  }

  private _parseDynamicRoute(path: string) {
    if (!path.includes(':')) return path;
    const dynamicParts = path.split('/');
    const newPath = [];
    for (let index = 0; index < dynamicParts.length; index++) {
      let part = dynamicParts[index];
      if (part.includes(':')) {
        part = `{${part.replace(/:/g, '')}}`;
      }
      newPath.push(part);
    }

    return newPath.join('/');
  }

  private _registerOpenApiPath(route: Route) {
    const instance = OpenAPIDocInstance.getInstance();
    const pathElement: PathItemObject = {};

    pathElement[route.method] = {
      summary: route.summary,
      operationId: `${parseAPIVersion(1)}/${route.methodName}`,
      parameters: route.params,
      requestBody: route.requestBody,
      responses: {},
      security: route.middlewares.includes(authenticateJWT) ? [{ bearerAuth: [] }] : [],
      tags: [this.tag],
    };
    const swaggerPath = this._parseDynamicRoute(this.pathPrefix + route.path);
    instance.addPath(swaggerPath, pathElement);
  }

  getRoute(controllerClass: any) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];

    existingRoutes.forEach((route: Route) => {
      if (route.methodName in controllerClass) {
        const handler: Function = controllerClass[route.methodName as keyof typeof controllerClass];
        this.routes[route.method](route.path, ...route.middlewares, handler.bind(controllerClass));
        this._registerOpenApiPath(route);
      }
    });

    return this.routes;
  }
}
