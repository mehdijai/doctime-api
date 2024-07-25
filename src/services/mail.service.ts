import mailConfig from '@/config/mail.config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: mailConfig.mailHost,
  port: mailConfig.mailPort,
  // secure: true,
  auth: {
    user: mailConfig.mailUser,
    pass: mailConfig.mailPass,
  },
});

export async function sendEmail(payload: { receivers: string[]; subject: string; html: string }) {
  const info = await transporter.sendMail({
    from: `"${mailConfig.mailFromName}" <${mailConfig.mailFromEmail}>`,
    to: payload.receivers.join(', '),
    subject: payload.subject,
    html: payload.html,
  });
  return info;
}
