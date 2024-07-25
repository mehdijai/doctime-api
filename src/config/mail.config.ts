import { config } from 'dotenv';
config();

const mailConfig = {
  mailFromEmail: process.env.MAIL_FROM_EMAIL!,
  mailFromName: process.env.MAIL_FROM_NAME!,
  mailHost: process.env.MAIL_HOST!,
  mailPort: Number(process.env.MAIL_PORT!),
  mailUser: process.env.MAIL_USER!,
  mailPass: process.env.MAIL_PASS!,
};

export default mailConfig;
