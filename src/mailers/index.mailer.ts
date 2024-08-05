import appConfig from '@/config/app.config';
import { HBSTemplateManager, HBSTemplates } from '@/services/handlebars.service';
import { sendEmail } from '@/services/mail.service';

export class InternalMailer {
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
  async send() {
    return await sendEmail({
      receivers: this.receivers,
      subject: `${appConfig.apiName} | ${this.subject}`,
      html: this.html,
      text: this.text,
    });
  }
}
