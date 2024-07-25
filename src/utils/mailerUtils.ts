import { load } from 'cheerio';

export function getTokenFromMail(html: string) {
  const $ = load(html);
  const link = $('#token-link').attr("href")
  const parts = link.split('/')
  return parts[parts.length - 1]
}
