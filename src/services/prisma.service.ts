import { logger } from '@/utils/winston';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Singleton Service
 * Initialize Prisma and Handle Test DB
 */
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else if (process.env.STAGE === 'TEST') {
    prisma = new PrismaClient({
      datasourceUrl: process.env.TEST_DATABASE_URL,
    });
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
} catch (err) {
  logger.error(err);
}

// @ts-ignore
export default prisma;
