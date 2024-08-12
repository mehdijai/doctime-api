import AppInstance from './app';
import { config } from 'dotenv';

config();

AppInstance.listen();
