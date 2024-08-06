import { authenticateJWT } from '@/middlewares/jwt.middleware';
import { validate } from '@/middlewares/validateRequest.middleware';
import { AppointmentRepository } from '@/repositories/appointment.repo';
import { AppointmentZODSchema } from '@/schemas/appointment/appointment.schema';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { NextFunction, Request, Response, Router } from 'express';

const AppointmentsRoutes = Router();

AppointmentsRoutes.post(
  '/',
  authenticateJWT,
  validate(AppointmentZODSchema.createAppointmentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TCreateAppointmentSchema = req.body;
      const resBody = await AppointmentRepository.createAppointment(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
AppointmentsRoutes.get(
  '/',
  authenticateJWT,
  validate(AppointmentZODSchema.searchAppointmentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TSearchAppointmentSchema = req.body;
      const resBody = await AppointmentRepository.getAppointments(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
AppointmentsRoutes.get(
  '/:id',
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const resBody = await AppointmentRepository.getAppointment(id);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
AppointmentsRoutes.put(
  '/',
  authenticateJWT,
  validate(AppointmentZODSchema.updateAppointmentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TUpdateAppointmentSchema = req.body;
      const resBody = await AppointmentRepository.updateAppointment(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
AppointmentsRoutes.delete(
  '/',
  authenticateJWT,
  validate(AppointmentZODSchema.deleteAppointmentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TDeleteAppointmentSchema = req.body;
      const resBody = await AppointmentRepository.deleteAppointment(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default AppointmentsRoutes;
