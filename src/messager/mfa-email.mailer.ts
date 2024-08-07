import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMessager } from './index.mailer';
import appConfig from '@/config/app.config';

export class MFAEmailMailer extends InternalMessager {
  constructor(protected receiver: string) {
    super([receiver], `Your One-Time Password (OTP) for Secure Access to ${appConfig.appName}`);
  }

  async generate(body: { name: string; OTP: string; validationPeriod: string }) {
    await this.generateMail(HBSTemplates.MFA_EMAIL, body);
    return this;
  }
}
