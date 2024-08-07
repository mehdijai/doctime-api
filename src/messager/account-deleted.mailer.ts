import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMessager } from './index.mailer';

export class AccountDeletedMailer extends InternalMessager {
  constructor(protected receivers: string[]) {
    super(receivers, 'Profile deleted!');
  }

  async generate(body: Record<string, string>) {
    await this.generateMail(HBSTemplates.ACCOUNT_DELETED, body);
    return this;
  }
}
