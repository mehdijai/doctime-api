import { AppointmentRepository } from '@/repositories/appointment.repo';
import { AppointmentZODSchema } from '@/schemas/appointment/appointment.schema';
import { NextFunction, Request, Response } from 'express';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { AuthGuard, Delete, Get, Post, Put, RequestBody } from '@/decorators/router.decorator';
import { MainRouter } from '../router';
import { parseAPIVersion } from '@/config/app.config';

class AppointmentsRouter extends MainRouter {
  constructor(prefix: string) {
    super(prefix, 'Appointments');
  }

  @AuthGuard()
  @RequestBody(AppointmentZODSchema.createAppointmentSchema, 'createAppointmentSchema')
  @Post('/')
  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TCreateAppointmentSchema = req.body;
      const resBody = await AppointmentRepository.createAppointment(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @RequestBody(AppointmentZODSchema.searchAppointmentSchema, 'searchAppointmentSchema')
  @Get('/')
  async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TSearchAppointmentSchema = req.body;
      const resBody = await AppointmentRepository.getAppointments(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Get('/:id')
  async getAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.id;
      const resBody = await AppointmentRepository.getAppointment(id);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @RequestBody(AppointmentZODSchema.updateAppointmentSchema, 'updateAppointmentSchema')
  @Put('/')
  async updateAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TUpdateAppointmentSchema = req.body;
      const resBody = await AppointmentRepository.updateAppointment(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @RequestBody(AppointmentZODSchema.deleteAppointmentSchema, 'deleteAppointmentSchema')
  @Delete('/')
  async deleteAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TDeleteAppointmentSchema = req.body;
      const resBody = await AppointmentRepository.deleteAppointment(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
}

const appointmentsRoute = new AppointmentsRouter(parseAPIVersion(1) + '/appointments');
export const appointmentsRoutes = appointmentsRoute.getRoute(appointmentsRoute);
