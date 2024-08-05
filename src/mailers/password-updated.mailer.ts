import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMailer } from './index.mailer';

export class PasswordUpdatedMailer extends InternalMailer {
  constructor(protected receivers: string[]) {
    super(receivers, 'Password Updated!');
  }

  async generate(body: Record<string, string>) {
    await this.generateMail(HBSTemplates.PASSWORD_UPDATED, body);
    return this;
  }
}
