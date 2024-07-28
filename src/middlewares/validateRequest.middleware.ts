import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ResponseHandler } from '@/utils/responseHandler';

function parseZodErrors(errors: ZodError) {
  return errors.errors.map((err) => `${err.path.join(', ')}: ${err.message}`);
}

export function validate(schema: ZodSchema, query = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (query) {
        schema.parse(req.query);
      } else {
        schema.parse(req.body);
      }
      next();
    } catch (error: any) {
      const resBody = ResponseHandler.InvalidBody({
        message: 'Validation Error',
        errors: parseZodErrors(error),
      });

      res.status(resBody.error!.code).json(resBody);
    }
  };
}
