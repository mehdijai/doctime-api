import app from './app';
import { config } from 'dotenv';
import { logger } from './utils/winston';

config();

app.listen(process.env.PORT, () => {
  logger.info(`Listening to port ${process.env.PORT}`);
});
