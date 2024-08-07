import appConfig from '@/config/app.config';
import { load } from 'cheerio';
import * as nodemailer from 'nodemailer';
import { NodemailerMock } from 'nodemailer-mock';
const { mock } = nodemailer as unknown as NodemailerMock;

export function getTokenFromMail(html: string, otp = false) {
  const $ = load(html);

  if (otp) {
    return $('#otp').text().trim();
  }

  const link = $('#token-link').attr('href');
  const parts = link?.split('/') ?? [];
  return parts[parts.length - 1];
}

export function testEmails(subject: string, otp = false) {
  const sentEmails = mock.getSentMail();
  const email = sentEmails.find((email) => email.subject === `${appConfig.appName} | ${subject}`);
  expect(email).toBeDefined();
  const token = getTokenFromMail(email?.html?.toString() ?? '', otp);
  expect(token).toBeDefined();
  return token;
}
