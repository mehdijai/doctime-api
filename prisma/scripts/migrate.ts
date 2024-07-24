import { execSync } from 'child_process';
import { logger } from '../../src/utils/winston';

async function runMigrations() {
  try {
    logger.info('Running migrations...');
    execSync(`cross-env DATABASE_URL=${process.env.TEST_DATABASE_URL} npx prisma migrate deploy`, {
      stdio: 'inherit',
    });
    logger.info('Migrations completed successfully.');
  } catch (error) {
    logger.error('Error running migrations:', error);
    process.exit(1);
  }
}
