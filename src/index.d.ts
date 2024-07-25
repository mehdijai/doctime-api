import { Request as ExpressRequest } from 'express';

declare global {
  interface IRequest extends ExpressRequest {
    user?: any;
  }
}
