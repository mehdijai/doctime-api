/// <reference path="./schemas/auth/auth.schema.d.ts" />
/// <reference path="./types/auth.d.ts" />

import { Request as ExpressRequest } from 'express';

declare global {
  interface IRequest extends ExpressRequest {
    user?: any;
  }
}
