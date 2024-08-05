import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMailer } from './index.mailer';

export class ConfirmDeleteMailer extends InternalMailer {
  constructor(protected receivers: string[]) {
    super(receivers, 'Confirm deleting profile');
  }

  async generate(body: Record<string, string>) {
    await this.generateMail(HBSTemplates.CONFIRM_DELETING, body);
    return this;
  }
}
