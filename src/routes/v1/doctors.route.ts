import { authenticateJWT } from '@/middlewares/jwt.middleware';
import { checkPermission } from '@/middlewares/permission.middleware';
import { validate } from '@/middlewares/validateRequest.middleware';
import { DoctorRepository } from '@/repositories/doctor.repo';
import { DoctorZODSchema } from '@/schemas/doctor/doctor.schema';
import { PermissionModel, PermissionVerb } from '@/services/permissions.service';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { NextFunction, Request, Response, Router } from 'express';

const DoctorsRoutes = Router();

DoctorsRoutes.post(
  '/',
  authenticateJWT,
  checkPermission(PermissionModel.DOCTOR, PermissionVerb.CREATE),
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
  checkPermission(PermissionModel.DOCTOR, PermissionVerb.READ),
  validate(DoctorZODSchema.searchDoctorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TSearchDoctorSchema = req.body;
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
  checkPermission(PermissionModel.DOCTOR, PermissionVerb.READ),
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
  checkPermission(PermissionModel.DOCTOR, PermissionVerb.UPDATE),
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
  checkPermission(PermissionModel.DOCTOR, PermissionVerb.DELETE),
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

DoctorsRoutes.post(
  '/confirm-delete',
  authenticateJWT,
  checkPermission(PermissionModel.DOCTOR, PermissionVerb.DELETE),
  validate(DoctorZODSchema.validateDeleteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TValidateDeleteSchema = req.body;
      const resBody = await DoctorRepository.confirmDeleteDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default DoctorsRoutes;
