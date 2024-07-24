import request from 'supertest';
import app from '@/app';
import { parseAPIVersion } from '@/config/app.config';
import { logger } from '@/utils/winston';
import { truncateAllTables } from '@/utils/truncateDB';

describe('Test Auth system', () => {
  const baseRoute = parseAPIVersion(1) + '/auth';
  afterAll(async () => {
    await truncateAllTables();
  });
  test('Test Create User', async () => {
    const payload = {
      name: 'Mehdi Jai',
      phone: '+212612113830',
      email: 'mjai@doctime.ma',
      password: '12345678',
      type: 'DOCTOR',
    };

    const response = await request(app)
      .post(baseRoute + '/register')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(payload.email);
    expect(response.body.data.userType).toEqual(payload.type);
  });
});
