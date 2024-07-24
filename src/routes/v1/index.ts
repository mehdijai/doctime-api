import { Response, Router } from 'express';
import AuthRoutes from './auth.route';
import PatientsRoutes from './patients.route';
import DoctorsRoutes from './doctors.route';
import AppointmentsRoutes from './appointments.route';
import appConfig from '@/config/app.config';

const routes = Router();

routes.get('/', (_, res: Response, next) => {
  res.status(200).json({
    name: appConfig.apiName,
    version: appConfig.apiVersion,
    dateTime: new Date().toISOString(),
    status: 'RUNNING',
  });
  next();
});

routes.use('/auth', AuthRoutes);
routes.use('/patients', PatientsRoutes);
routes.use('/doctors', DoctorsRoutes);
routes.use('/appointments', AppointmentsRoutes);

export default routes;
