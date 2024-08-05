import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMailer } from './index.mailer';

export class ResetPasswordMailer extends InternalMailer {
  constructor(protected receivers: string[]) {
    super(receivers, 'Reset Password');
  }

  async generate(body: Record<string, string>) {
    await this.generateMail(HBSTemplates.RESET_PASSWORD, body);
    return this;
  }
}
