import mailConfig, { ProvidersList } from '@/config/mail.config';
import { logger } from '@/utils/winston';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';

config();

export interface MailPayload {
  receivers: string[];
  subject: string;
  html: string;
  text?: string;
}

export class MailerService {
  private static instance: MailerService;

  static getInstance() {
    if (!MailerService.instance) {
      MailerService.instance = new MailerService();
    }
    return MailerService.instance;
  }

  private provider: ProvidersList = mailConfig.selectedProvider;
  private transporter: nodemailer.Transporter | undefined;

  constructor() {
    if (this.provider === ProvidersList.SMTP) {
      /**
       * Initialize Nodemailer service.
       */
      this.transporter = nodemailer.createTransport({
        host: mailConfig.providers.SMTP.mailHost,
        port: mailConfig.providers.SMTP.mailPort,
        // secure: true,
        auth: {
          user: mailConfig.providers.SMTP.mailUser,
          pass: mailConfig.providers.SMTP.mailPass,
        },
      });
    }
  }
  async sendEmail(payload: MailPayload) {
    if (this.provider === ProvidersList.SMTP && this.transporter) {
      return await this.handleSMTPMails(payload);
    } else {
      return await this.handleSESMails(payload);
    }
  }

  private async handleSMTPMails(payload: MailPayload) {
    if (!this.transporter) return;
    const info = await this.transporter.sendMail({
      from: `"${mailConfig.providers.SMTP.mailFromName}" <${mailConfig.providers.SMTP.mailFromEmail}>`,
      to: payload.receivers.join(', '),
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    return info;
  }
  private async handleSESMails(payload: MailPayload) {
    const sesClient = new SESClient({ region: process.env.AWS_REGION });

    const sendEmailCommand = new SendEmailCommand({
      Destination: {
        ToAddresses: payload.receivers,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: payload.html,
          },
          Text: {
            Charset: 'UTF-8',
            Data: payload.text,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: payload.subject,
        },
      },
      Source: mailConfig.providers.SES.emailSource,
    });

    try {
      const result = await sesClient.send(sendEmailCommand);
      console.log('result', result);
      return result;
    } catch (caught) {
      if (caught instanceof Error && caught.name === 'MessageRejected') {
        /** @type { import('@aws-sdk/client-ses').MessageRejected} */
        const messageRejectedError = caught;
        logger.debug({ messageRejectedError });
        return messageRejectedError;
      }
      throw caught;
    }
  }
}
