import { authenticateJWT } from '@/middlewares/jwt.middleware';
import { validate } from '@/middlewares/validateRequest.middleware';
import { PatientRepository } from '@/repositories/patient.repo';
import { PatientZODSchema } from '@/schemas/patient/patient.schema';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { NextFunction, Request, Response, Router } from 'express';

const PatientsRoutes = Router();

PatientsRoutes.post(
  '/',
  authenticateJWT,
  validate(PatientZODSchema.createPatientSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TCreatePatientSchema = req.body;
      const resBody = await PatientRepository.createPatient(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
PatientsRoutes.get(
  '/',
  authenticateJWT,
  validate(PatientZODSchema.searchPatientSchema, true),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TSearchPatientSchema = req.query;
      const resBody = await PatientRepository.getPatients(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
PatientsRoutes.get(
  '/me',
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resBody = await PatientRepository.getPatient();
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
PatientsRoutes.get(
  '/:patientId',
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId: string = req.params.patientId;
      const resBody = await PatientRepository.getPatient(patientId);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
PatientsRoutes.put(
  '/',
  authenticateJWT,
  validate(PatientZODSchema.updatePatientSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TUpdatePatientSchema = req.body;
      const resBody = await PatientRepository.updatePatient(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);
PatientsRoutes.delete(
  '/',
  authenticateJWT,
  validate(PatientZODSchema.deletePatientSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TDeletePatientSchema = req.body;
      const resBody = await PatientRepository.deletePatient(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

PatientsRoutes.post(
  '/confirm-delete',
  authenticateJWT,
  validate(PatientZODSchema.validateDeleteSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TValidateDeleteSchema = req.body;
      const resBody = await PatientRepository.confirmDeletePatient(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

PatientsRoutes.post(
  '/add-doctor',
  authenticateJWT,
  validate(PatientZODSchema.addDoctorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TAddDoctorSchema = req.body;
      const resBody = await PatientRepository.addDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

PatientsRoutes.post(
  '/remove-doctor',
  authenticateJWT,
  validate(PatientZODSchema.addDoctorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: TAddDoctorSchema = req.body;
      const resBody = await PatientRepository.removeDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
);

export default PatientsRoutes;
