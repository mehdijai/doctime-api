import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMailer } from './index.mailer';

export class AccountDeletedMailer extends InternalMailer {
  constructor(protected receivers: string[]) {
    super(receivers, 'Profile deleted!');
  }

  async generate(body: Record<string, string>) {
    await this.generateMail(HBSTemplates.ACCOUNT_DELETED, body);
    return this;
  }
}
