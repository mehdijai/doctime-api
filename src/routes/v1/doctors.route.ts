import { checkPermission } from '@/middlewares/permission.middleware';
import { DoctorRepository } from '@/repositories/doctor.repo';
import { DoctorZODSchema } from '@/schemas/doctor/doctor.schema';
import { PermissionModel, PermissionVerb } from '@/services/permissions.service';
import { NextFunction, Request, Response } from 'express';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
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

class DoctorsRouter extends MainRouter {
  constructor(prefix: string) {
    super(prefix, 'Doctors');
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.DOCTOR, PermissionVerb.CREATE)])
  @RequestBody(DoctorZODSchema.createDoctorSchema, 'createDoctorSchema')
  @Post('/')
  async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TCreateDoctorSchema = req.body;
      const resBody = await DoctorRepository.createDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.DOCTOR, PermissionVerb.READ)])
  @RequestBody(DoctorZODSchema.searchDoctorSchema, 'searchDoctorSchema')
  @Get('/')
  async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TSearchDoctorSchema = req.body;
      const resBody = await DoctorRepository.getDoctors(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.DOCTOR, PermissionVerb.READ)])
  @Get('/:docId')
  async getDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.docId;
      const resBody = await DoctorRepository.getDoctor(id);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.DOCTOR, PermissionVerb.UPDATE)])
  @RequestBody(DoctorZODSchema.updateDoctorSchema, 'updateDoctorSchema')
  @Put('/')
  async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TUpdateDoctorSchema = req.body;
      const resBody = await DoctorRepository.updateDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.DOCTOR, PermissionVerb.DELETE)])
  @RequestBody(DoctorZODSchema.deleteDoctorSchema, 'deleteDoctorSchema')
  @Delete('/')
  async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TDeleteDoctorSchema = req.body;
      const resBody = await DoctorRepository.deleteDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Middlewares([checkPermission(PermissionModel.DOCTOR, PermissionVerb.DELETE)])
  @RequestBody(DoctorZODSchema.validateDeleteSchema, 'validateDeleteSchema')
  @Post('/confirm-delete')
  async conformDeleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const body: TValidateDeleteSchema = req.body;
      const resBody = await DoctorRepository.confirmDeleteDoctor(body);
      res.status(resBody.error ? resBody.error.code : HttpStatusCode.OK).json(resBody);
      next();
    } catch (err) {
      next(err);
    }
  }
}

const doctorsRoute = new DoctorsRouter(parseAPIVersion(1) + '/doctors');
export const doctorsRoutes = doctorsRoute.getRoute(doctorsRoute);
