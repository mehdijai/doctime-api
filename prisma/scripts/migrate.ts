import { execSync } from 'child_process';
import { config } from 'dotenv';
config()

async function runMigrations() {
  try {
    console.log('Running migrations...');
    execSync(`cross-env DATABASE_URL=${process.env.TEST_DATABASE_URL} npx prisma migrate deploy`, {
      stdio: 'inherit',
    });
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations()