import mailConfig from '@/config/mail.config';
import nodemailer from 'nodemailer';

/**
 * Initialize Nodemailer service.
 */
const transporter = nodemailer.createTransport({
  host: mailConfig.mailHost,
  port: mailConfig.mailPort,
  // secure: true,
  auth: {
    user: mailConfig.mailUser,
    pass: mailConfig.mailPass,
  },
});

/**
 * Email Sender
 * @param payload The email payload. { receivers: string[]; subject: string; html: string }
 * @returns the email sent info
 */
export async function sendEmail(payload: {
  receivers: string[];
  subject: string;
  html: string;
  text?: string;
}) {
  const info = await transporter.sendMail({
    from: `"${mailConfig.mailFromName}" <${mailConfig.mailFromEmail}>`,
    to: payload.receivers.join(', '),
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
  return info;
}
