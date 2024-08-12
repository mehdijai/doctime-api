import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';
import { OpenAPIDocInstance } from '@/utils/openAPIGenerator';
import {
  ZodType,
  ZodObject,
  ZodString,
  ZodEnum,
  ZodNumber,
  ZodBoolean,
  ZodArray,
  ZodOptional,
  z,
} from 'zod';
import { AuthZODSchema } from '@/schemas/auth/auth.schema';
import { DoctorZODSchema } from '@/schemas/doctor/doctor.schema';
import { PatientZODSchema } from '@/schemas/patient/patient.schema';
import { AppointmentZODSchema } from '@/schemas/appointment/appointment.schema';

export class SwaggerService {
  constructor(private app: Application) {}

  setupSwagger(): void {
    const instance = OpenAPIDocInstance.getInstance();

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(instance));

    this.app.get('/swagger.json', (_: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(instance);
    });
  }

  static initializeSchemas() {
    const instance = OpenAPIDocInstance.getInstance();

    const schemas = [AuthZODSchema, DoctorZODSchema, PatientZODSchema, AppointmentZODSchema];

    schemas.forEach((schema) => {
      Object.entries(schema).forEach(([key, value]) => {
        if (value instanceof ZodObject) {
          instance.addSchema(
            key,
            this.zodToOpenAPISchema(AuthZODSchema[key as keyof typeof AuthZODSchema] as ZodType)
          );
        }
      });
    });
  }

  static zodToOpenAPISchema(schema: ZodType): any {
    if (schema instanceof ZodString) {
      const result: any = { type: 'string' };
      if (schema._def.checks) {
        schema._def.checks.forEach((check: any) => {
          if (check.kind === 'uuid') {
            result.format = 'uuid';
          } else if (check.kind === 'min') {
            result.minLength = check.value;
          } else if (check.kind === 'max') {
            result.maxLength = check.value;
          } else if (check.kind === 'email') {
            result.format = 'email';
          }
          // Add more checks as needed
        });
      }
      return result;
    } else if (schema instanceof ZodNumber) {
      const result: any = { type: 'number' };
      if (schema._def.checks) {
        schema._def.checks.forEach((check: any) => {
          if (check.kind === 'min') {
            result.minimum = check.value;
          } else if (check.kind === 'max') {
            result.maximum = check.value;
          }
          // Add more checks as needed
        });
      }
      return result;
    } else if (schema instanceof ZodBoolean) {
      return { type: 'boolean' };
    } else if (schema instanceof ZodEnum) {
      return {
        type: 'string',
        enum: schema._def.values as string[],
      };
    } else if (schema instanceof ZodArray) {
      return {
        type: 'array',
        items: this.zodToOpenAPISchema(schema._def.type),
      };
    } else if (schema instanceof ZodObject) {
      const properties: any = {};
      const required: string[] = [];
      Object.entries(schema.shape).forEach(([key, value]) => {
        properties[key] = this.zodToOpenAPISchema(value as ZodType);
        if (!(value instanceof ZodOptional)) {
          required.push(key);
        }
      });
      return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
      };
    } else if (schema instanceof ZodOptional) {
      return this.zodToOpenAPISchema(schema._def.innerType);
    }
    return { type: 'object' };
  }
}
