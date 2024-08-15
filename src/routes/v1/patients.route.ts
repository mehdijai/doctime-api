import { checkPermission } from '@/middlewares/permission.middleware';
import { PatientRepository } from '@/repositories/patient.repo';
import { PatientZODSchema } from '@/schemas/patient/patient.schema';
import { PermissionModel, PermissionVerb } from '@/services/permissions.service';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { NextFunction, Request, Response } from 'express';
import {
  AuthGuard,
  Delete,
  Get,
  Middlewares,
  Post,
  Put,
  RequestBody,
} from '@/decorators/router.decorator';
import { MainRouter } from '../router';
import { parseAPIVersion } from '@/config/app.config';

class PatientsRouter extends MainRouter {
  constructor(prefix: string) {
    super(prefix, 'Patients');
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.CREATE)])
  @RequestBody(PatientZODSchema.createPatientSchema, 'createPatientSchema')
  @Post('/')
  async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TCreatePatientSchema = req.body;
      const resBody = await PatientRepository.createPatient(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.READ)])
  @RequestBody(PatientZODSchema.searchPatientSchema, 'searchPatientSchema')
  @Get('/')
  async getPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TSearchPatientSchema = req.body;
      const resBody = await PatientRepository.getPatients(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.READ)])
  @Get('/me')
  async getPatientProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const resBody = await PatientRepository.getPatient();
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.READ)])
  @Get('/:patientId')
  async getPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId: string = req.params.patientId;
      const resBody = await PatientRepository.getPatient(patientId);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.UPDATE)])
  @RequestBody(PatientZODSchema.updatePatientSchema, 'updatePatientSchema')
  @Put('/')
  async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TUpdatePatientSchema = req.body;
      const resBody = await PatientRepository.updatePatient(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.DELETE)])
  @RequestBody(PatientZODSchema.deletePatientSchema, 'deletePatientSchema')
  @Delete('/')
  async deletePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TDeletePatientSchema = req.body;
      const resBody = await PatientRepository.deletePatient(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.DELETE)])
  @RequestBody(PatientZODSchema.validateDeleteSchema, 'validateDeleteSchema')
  @Post('/confirm-delete')
  async confirmDeletePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TValidateDeleteSchema = req.body;
      const resBody = await PatientRepository.confirmDeletePatient(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.UPDATE)])
  @RequestBody(PatientZODSchema.addDoctorSchema, 'addDoctorSchema')
  @Post('/add-doctor')
  async addDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TAddDoctorSchema = req.body;
      const resBody = await PatientRepository.addDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.PATIENT, PermissionVerb.UPDATE)])
  @RequestBody(PatientZODSchema.addDoctorSchema, 'addDoctorSchema')
  @Post('/remove-doctor')
  async removeDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TAddDoctorSchema = req.body;
      const resBody = await PatientRepository.removeDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
}

const patientsRoute = new PatientsRouter(parseAPIVersion(1) + '/patients');
export const patientsRoutes = patientsRoute.getRoute(patientsRoute);
