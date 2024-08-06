import { config } from 'dotenv';
config();

export enum ProvidersList {
  SES = 'SES',
  SMTP = 'SMTP',
}
const mailConfig = {
  selectedProvider: process.env.STAGE === 'TEST' ? ProvidersList.SMTP : ProvidersList.SES,
  providers: {
    SES: {
      emailSource: process.env.AWS_SES_EMAIL_SOURCE,
    },
    SMTP: {
      mailFromEmail: process.env.MAIL_FROM_EMAIL!,
      mailFromName: process.env.MAIL_FROM_NAME!,
      mailHost: process.env.MAIL_HOST!,
      mailPort: Number(process.env.MAIL_PORT!),
      mailUser: process.env.MAIL_USER!,
      mailPass: process.env.MAIL_PASS!,
    },
  },
};

export default mailConfig;
