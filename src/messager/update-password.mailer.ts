import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMessager } from './index.mailer';

export class UpdatePasswordMailer extends InternalMessager {
  constructor(protected receivers: string[]) {
    super(receivers, 'Update Password');
  }

  async generate(body: Record<string, string>) {
    await this.generateMail(HBSTemplates.UPDATE_PASSWORD, body);
    return this;
  }
}
