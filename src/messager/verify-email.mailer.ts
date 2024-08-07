import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMessager } from './index.mailer';

export class VerifyEmailMailer extends InternalMessager {
  constructor(protected receivers: string[]) {
    super(receivers, 'Verify Email');
  }

  async generate(body: { name: string; verificationLink: string }) {
    await this.generateMail(HBSTemplates.VERIFY_EMAIL, body);
    return this;
  }
}
