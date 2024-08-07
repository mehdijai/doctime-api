import appConfig from '@/config/app.config';
import { HBSTemplateManager, HBSTemplates } from '@/services/handlebars.service';
import { MailerService } from '@/services/mail.service';
import { sendSMS } from '@/services/sms.service';
export class InternalMessager {
  protected html: string = '';
  protected text: string = '';

  constructor(
    protected receivers: string[],
    protected subject: string
  ) {}

  protected async generateMail(type: HBSTemplates, body: Record<string, string>) {
    const _template = new HBSTemplateManager(type);
    await _template.parseTemplate(body);
    this.html = _template.getHTMLTemplate() ?? '';
    this.text = _template.getTxtTemplate() ?? '';
  }

  getHTML() {
    return this.html;
  }
  getTEXT() {
    return this.text;
  }
  async sendEmail() {
    return await MailerService.getInstance().sendEmail({
      receivers: this.receivers,
      subject: `${appConfig.appName} | ${this.subject}`,
      html: this.html,
      text: this.text,
    });
  }
  async sendSMS() {
    return sendSMS({
      phoneNumber: this.receivers[0],
      message: this.text,
    });
  }
}
