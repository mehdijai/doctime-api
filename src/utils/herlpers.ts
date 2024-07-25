import { logger } from './winston';

export default async function wait(time: number) {
  await new Promise((r) => setTimeout(r, time));
}

export function addTime(value: number, unit: 'ms' | 's' | 'm' | 'h' | 'd', start?: Date) {
  let addedValue = value;

  switch (unit) {
    case 's':
      addedValue *= 1000;
      break;
    case 'm':
      addedValue *= 60 * 1000;
      break;
    case 'h':
      addedValue *= 60 * 60 * 1000;
      break;
    case 'd':
      addedValue *= 24 * 60 * 60 * 1000;
      break;
  }
  const initValue = start ? start.getTime() : Date.now();
  return new Date(initValue + addedValue);
}
