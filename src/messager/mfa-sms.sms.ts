import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMessager } from './index.mailer';
import appConfig from '@/config/app.config';

export class MFAMessageMailer extends InternalMessager {
  constructor(protected receiver: string) {
    super([receiver], `Your One-Time Password (OTP) for Secure Access to ${appConfig.appName}`);
  }

  async generate(body: { name: string; OTP: string; validationPeriod: string }) {
    await this.generateMail(HBSTemplates.OTP_SMS, body);
    return this;
  }
}
