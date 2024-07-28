import app from './app';
import { config } from 'dotenv';

config();

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
