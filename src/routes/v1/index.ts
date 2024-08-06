import { Request, Response, Router } from 'express';
import AuthRoutes from './auth.route';
import PatientsRoutes from './patients.route';
import DoctorsRoutes from './doctors.route';
import AppointmentsRoutes from './appointments.route';
import appConfig from '@/config/app.config';
import { authenticateJWT } from '@/middlewares/jwt.middleware';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { HBSTemplates } from '@/services/handlebars.service';
import { AccountDeletedMailer } from '@/mailers/account-deleted.mailer';
import { InternalMailer } from '@/mailers/index.mailer';
import { ConfirmDeleteMailer } from '@/mailers/confirm-deleting.mailer';
import { VerifyEmailMailer } from '@/mailers/verify-email.mailer';
import { PasswordUpdatedMailer } from '@/mailers/password-updated.mailer';
import { ResetPasswordMailer } from '@/mailers/reset-password.mailer';
import { UpdatePasswordMailer } from '@/mailers/update-password.mailer';
const routes = Router();

routes.get('/mailer/:type', async (req: Request, res: Response, next) => {
  const mailType: HBSTemplates = req.params.type as HBSTemplates;
  const contentType = req.header('accept');

  let content = '';
  let _mailer: InternalMailer;

  switch (mailType) {
    case HBSTemplates.ACCOUNT_DELETED:
      _mailer = await new AccountDeletedMailer(['user@mail.com']).generate({});
      break;
    case HBSTemplates.CONFIRM_DELETING:
      _mailer = await new ConfirmDeleteMailer(['user@mail.com']).generate({});
      break;
    case HBSTemplates.VERIFY_EMAIL:
      _mailer = await new VerifyEmailMailer(['user@mail.com']).generate({
        verificationLink: '',
        name: '',
      });
      break;
    case HBSTemplates.PASSWORD_UPDATED:
      _mailer = await new PasswordUpdatedMailer(['user@mail.com']).generate({});
      break;
    case HBSTemplates.RESET_PASSWORD:
      _mailer = await new ResetPasswordMailer(['user@mail.com']).generate({});
      break;
    case HBSTemplates.UPDATE_PASSWORD:
      _mailer = await new UpdatePasswordMailer(['user@mail.com']).generate({});
      break;
  }

  if (contentType === 'text/plain') {
    content = _mailer.getTEXT();
  } else {
    content = _mailer.getHTML();
  }

  res.status(HttpStatusCode.OK).send(content);
  next();
});

routes.get('/', (_, res: Response, next) => {
  res.status(HttpStatusCode.OK).json({
    name: appConfig.apiName,
    version: appConfig.apiVersion,
    dateTime: new Date().toISOString(),
    status: 'RUNNING',
  });
  next();
});

routes.get('/protected', authenticateJWT, (_, res: Response, next) => {
  res.status(HttpStatusCode.OK).json({
    name: appConfig.apiName,
    version: appConfig.apiVersion,
    dateTime: new Date().toISOString(),
    status: 'RUNNING',
    protected: true,
  });
  next();
});

routes.use('/auth', AuthRoutes);
routes.use('/patients', PatientsRoutes);
routes.use('/doctors', DoctorsRoutes);
routes.use('/appointments', AppointmentsRoutes);

export default routes;
