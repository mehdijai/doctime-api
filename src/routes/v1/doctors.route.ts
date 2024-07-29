import { authenticateJWT } from '@/middlewares/jwt.middleware';
import { validate } from '@/middlewares/validateRequest.middleware';
import { DoctorRepository } from '@/repositories/doctor.repo';
import { DoctorZODSchema } from '@/schemas/doctor/doctor.schema';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { NextFunction, Request, Response, Router } from 'express';

const DoctorsRoutes = Router();

DoctorsRoutes.post(
  '/',
  authenticateJWT,
  validate(DoctorZODSchema.createDoctorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TCreateDoctorSchema = req.body;
      const resBody = await DoctorRepository.createDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
DoctorsRoutes.get(
  '/',
  authenticateJWT,
  validate(DoctorZODSchema.searchDoctorSchema, true),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TSearchDoctorSchema = req.query;
      const resBody = await DoctorRepository.getDoctors(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
DoctorsRoutes.get(
  '/:docId',
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.docId;
      const resBody = await DoctorRepository.getDoctor(id);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
DoctorsRoutes.put(
  '/',
  authenticateJWT,
  validate(DoctorZODSchema.updateDoctorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TUpdateDoctorSchema = req.body;
      const resBody = await DoctorRepository.updateDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
DoctorsRoutes.delete(
  '/',
  authenticateJWT,
  validate(DoctorZODSchema.deleteDoctorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TDeleteDoctorSchema = req.body;
      const resBody = await DoctorRepository.deleteDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default DoctorsRoutes;
