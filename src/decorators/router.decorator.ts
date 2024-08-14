import { authenticateJWT } from '@/middlewares/jwt.middleware';
import { validate } from '@/middlewares/validateRequest.middleware';
import { MetadataService } from '@/services/metadata.service';
import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export interface Route {
  path: string;
  methodName: string;
  summary?: string;
  description?: string;
  middlewares: RequestHandler[];
  params?: (ParameterObject | ReferenceObject)[];
  requestBody?: RequestBodyObject;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
  responses?: Record<string, string>;
}

function HTTPMethodDecorator(route: Route) {
  // Get existing routes or create an empty array
  const existingRoutes: Route[] = MetadataService.get('routes') || [];

  // Store the path and method information
  existingRoutes.push(route);

  // Update the metadata with the combined routes
  MetadataService.set('routes', existingRoutes);
}

// Decorator for defining Express GET routes
export function Get(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'get', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function Post(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'post', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function Patch(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'patch', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function Put(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'put', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function Delete(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'delete', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function AuthGuard() {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      match.middlewares.unshift(authenticateJWT);
    }
    MetadataService.set('routes', existingRoutes);
  };
}
export function RequestBody(schema: ZodSchema, ref?: string) {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      match.middlewares.push(validate(schema));
      if (ref) {
        match.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${ref}`,
              },
            },
          },
        };
      }
    }
    MetadataService.set('routes', existingRoutes);
  };
}

export function Middlewares(middlewares: RequestHandler[]) {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      match.middlewares.push(...middlewares);
    }
    MetadataService.set('routes', existingRoutes);
  };
}

// export function Controller(name: string, version?: string, prefix?: string, description?: string) {
//   return function (target: Function) {
//     Reflect.defineMetadata('prefix', prefix ?? '', target);
//     Reflect.defineMetadata('version', version ?? '', target);
//     Reflect.defineMetadata('tag', name ?? '', target);
//     const instance = OpenAPIDocInstance.getInstance();
//     instance.addTag({
//       name,
//       description,
//     });
//   };
// }

// export function Query<T extends ZodRawShape>(obj: ZodObject<T>) {
//   return function (_: Object, propertyKey: string) {
//     const existingRoutes: Route[] = MetadataService.get('routes') || [];
//     const match = existingRoutes.find((route) => route.methodName === propertyKey);

//     if (match) {
//       const typeEntries = Object.entries(obj.shape);
//       typeEntries.forEach((item) => {
//         const param = parseZodObject('query', item[0], item[1]);
//         if (!match.params) {
//           match.params = [];
//         }
//         match.params.push(param);
//       });
//     }
//     MetadataService.set('routes', existingRoutes);
//   };
// }

// export function RequestBody<T extends ZodRawShape>(obj: ZodObject<T>) {
//   return function (_: Object, propertyKey: string) {
//     const existingRoutes: Route[] = MetadataService.get('routes') || [];
//     const match = existingRoutes.find((route) => route.methodName === propertyKey);

//     const val: RequestBodyObject = {
//       required: true,
//       content: {
//         'application/json': {
//           schema: {
//             type: 'object',
//             properties: {},
//           },
//         },
//       },
//     };

//     if (match) {
//       const typeEntries = Object.entries(obj.shape);
//       typeEntries.forEach((item) => {
//         const requestBody = parseZodObjectRequest(item[1]);
//         // @ts-ignore
//         val.content['application/json'].schema.properties[item[0]] = requestBody;
//         match.requestBody = val;
//       });
//     }
//     MetadataService.set('routes', existingRoutes);
//   };
// }

// export function Param(value: { name: string; type: string; description?: string }[]) {
//   return function (_: Object, propertyKey: string) {
//     const existingRoutes: Route[] = MetadataService.get('routes') || [];
//     const match = existingRoutes.find((route) => route.methodName === propertyKey);

//     if (match) {
//       value.forEach((item) => {
//         const param = {
//           name: item.name,
//           in: 'path',
//           description: item.description,
//           required: true,
//           allowEmptyValue: false,
//           schema: {
//             title: item.name,
//             type: item.type,
//             format: 'uuid',
//           },
//         };
//         if (!match.params) {
//           match.params = [];
//         }
//         match.params.push(param);
//       });
//     }
//     MetadataService.set('routes', existingRoutes);
//   };
// }
// export function Responses(value: Record<string, string>) {
//   return function (_: Object, propertyKey: string) {
//     const existingRoutes: Route[] = MetadataService.get('routes') || [];
//     const match = existingRoutes.find((route) => route.methodName === propertyKey);

//     if (match) {
//       match.responses = value;
//     }
//     MetadataService.set('routes', existingRoutes);
//   };
// }

// function parseDynamicRoute(path: string) {
//   if (!path.includes(':')) return path;
//   const dynamicParts = path.split('/');
//   const newPath = [];
//   for (let index = 0; index < dynamicParts.length; index++) {
//     let part = dynamicParts[index];
//     if (part.includes(':')) {
//       part = `{${part.replace(/:/g, '')}}`;
//     }
//     newPath.push(part);
//   }

//   return newPath.join('/');
// }

// function parseResponses(responses?: Record<string, string>, hasAuth = false): ResponsesObject {
//   const result: ResponsesObject = {};
//   if (hasAuth) {
//     result['401'] = {
//       description: 'Unauthorized',
//     };
//   }
//   if (!responses) {
//     result['200'] = {
//       description: '-',
//     };
//     return result;
//   }

//   Object.keys(responses).forEach((key) => {
//     result[key] = {
//       description: responses[key],
//     };
//   });

//   return result;
// }
