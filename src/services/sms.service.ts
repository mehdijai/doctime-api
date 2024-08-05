import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { config } from 'dotenv';

config();

export async function sendSMS({ phoneNumber, message }: { phoneNumber: string; message: string }) {
  const client = new SNSClient({ region: process.env.AWS_REGION });

  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };

  const command = new PublishCommand(params);

  try {
    const data = await client.send(command);
    console.log('Success', data);
  } catch (err) {
    console.error('Error', err);
  }
}
