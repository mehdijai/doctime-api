/// <reference path="./schemas/auth/auth.schema.d.ts" />
/// <reference path="./schemas/patient/patient.schema.d.ts" />
/// <reference path="./schemas/doctor/doctor.schema.d.ts" />
/// <reference path="./schemas/appointment/appointment.schema.d.ts" />
/// <reference path="./types/auth.d.ts" />
/// <reference path="./types/patient.d.ts" />
/// <reference path="./types/appointment.d.ts" />
/// <reference path="./types/doctor.d.ts" />

import { Request as ExpressRequest } from 'express';

declare global {
  interface IRequest extends ExpressRequest {
    user?: any;
  }
  declare interface ICoordinates {
    lat: number;
    lng: number;
  }
}
