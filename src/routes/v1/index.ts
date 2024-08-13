import { Request, Response, NextFunction } from 'express';
import { authRoutes } from './auth.route';
import appConfig, { parseAPIVersion } from '@/config/app.config';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { HBSTemplates } from '@/services/handlebars.service';
import { AccountDeletedMailer } from '@/messager/account-deleted.mailer';
import { InternalMessager } from '@/messager/index.mailer';
import { ConfirmDeleteMailer } from '@/messager/confirm-deleting.mailer';
import { VerifyEmailMailer } from '@/messager/verify-email.mailer';
import { PasswordUpdatedMailer } from '@/messager/password-updated.mailer';
import { ResetPasswordMailer } from '@/messager/reset-password.mailer';
import { UpdatePasswordMailer } from '@/messager/update-password.mailer';
import { requireVerifiedEmail } from '@/middlewares/requireVerifiedEmail.middleware';
import { requireVerifiedPhone } from '@/middlewares/requireVerifiedPhone.middleware';
import mailConfig, { ProvidersList } from '@/config/mail.config';
import { MainRouter } from '../router';
import { AuthGuard, Get, Middlewares } from '@/decorators/router.decorator';
import PatientsRoutes from './patients.route';
import DoctorsRoutes from './doctors.route';
import AppointmentsRoutes from './appointments.route';

class IndexRouter extends MainRouter {
  @Get('/mailer/:type')
  async mailerTests(req: Request, res: Response, next: NextFunction) {
    const mailType: HBSTemplates = req.params.type as HBSTemplates;
    const contentType = req.header('accept');

    let htmlContent = '';
    let txtContent = '';
    let _mailer: InternalMessager;

    mailConfig.selectedProvider = ProvidersList.SMTP;

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
        htmlContent = _mailer.getTEXT();
        txtContent = _mailer.getHTML();
        break;
    }

    mailConfig.selectedProvider = ProvidersList.SES;

    if (contentType === 'text/plain') {
      res.status(HttpStatusCode.OK).send(txtContent);
    } else {
      res.status(HttpStatusCode.OK).send(htmlContent);
    }

    next();
  }

  @Get('/')
  apiStatus(_: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCode.OK).json({
      name: appConfig.apiName,
      version: appConfig.apiVersion,
      dateTime: new Date().toISOString(),
      status: 'RUNNING',
    });
    next();
  }

  @AuthGuard()
  @Get('/protected')
  apiStatusProtected(_: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCode.OK).json({
      name: appConfig.apiName,
      version: appConfig.apiVersion,
      dateTime: new Date().toISOString(),
      status: 'RUNNING',
      protected: true,
    });
    next();
  }

  @Middlewares([requireVerifiedEmail])
  @AuthGuard()
  @Get('/requireVerifiedEmail')
  verifiedEmailRoute(_: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCode.OK).json({
      name: appConfig.apiName,
      version: appConfig.apiVersion,
      dateTime: new Date().toISOString(),
      status: 'RUNNING',
      protected: true,
    });
    next();
  }

  @AuthGuard()
  @Middlewares([requireVerifiedPhone])
  @Get('/requireVerifiedPhone')
  verifiedPhoneRoute(_: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCode.OK).json({
      name: appConfig.apiName,
      version: appConfig.apiVersion,
      dateTime: new Date().toISOString(),
      status: 'RUNNING',
      protected: true,
    });
    next();
  }
}

const v1Router = new IndexRouter(parseAPIVersion(1));
export const v1Routes = v1Router.getRoute(v1Router);

v1Routes.use('/auth', authRoutes);
v1Routes.use('/patients', PatientsRoutes);
v1Routes.use('/doctors', DoctorsRoutes);
v1Routes.use('/appointments', AppointmentsRoutes);
