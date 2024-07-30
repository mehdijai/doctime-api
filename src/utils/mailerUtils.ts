import { load } from 'cheerio';
import * as nodemailer from 'nodemailer';
import { NodemailerMock } from 'nodemailer-mock';
const { mock } = nodemailer as unknown as NodemailerMock;

export function getTokenFromMail(html: string) {
  const $ = load(html);
  const link = $('#token-link').attr('href');
  const parts = link?.split('/') ?? [];
  return parts[parts.length - 1];
}

export function testEmails(subject: string) {
  const sentEmails = mock.getSentMail();
  const email = sentEmails.find((email) => email.subject === subject);
  expect(email).toBeDefined();
  const token = getTokenFromMail(email?.html?.toString() ?? '');
  expect(token).toBeDefined();
  return token;
}
