import prisma from '@/services/prisma.service';
import { logger } from './winston';

export async function truncateAllTables() {
  if (process.env.NODE_ENV === 'production' || process.env.STAGE !== 'TEST') {
    throw new Error('This function can only be used in test environment');
  }
  try {
    // Disable triggers
    await prisma.$queryRaw`SET session_replication_role = 'replica';`;

    // Get all table names
    const tables = await prisma.$queryRawUnsafe(`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public';
      `);

    // Truncate each table
    for (const { tablename } of tables as { tablename: string }[]) {
      await prisma.$queryRawUnsafe(`TRUNCATE TABLE ${tablename} CASCADE;`);
    }

    // Re-enable triggers
    await prisma.$queryRawUnsafe(`SET session_replication_role = 'origin';`);

    logger.info('All tables truncated successfully');
  } catch (error) {
    logger.error('Error truncating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}
