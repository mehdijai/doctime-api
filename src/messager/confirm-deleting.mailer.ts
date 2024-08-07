import { HBSTemplates } from '@/services/handlebars.service';
import { InternalMessager } from './index.mailer';

export class ConfirmDeleteMailer extends InternalMessager {
  constructor(protected receivers: string[]) {
    super(receivers, 'Confirm deleting profile');
  }

  async generate(body: Record<string, string>) {
    await this.generateMail(HBSTemplates.CONFIRM_DELETING, body);
    return this;
  }
}
