import request from 'supertest';
import app from '@/app';
import appConfig, { parseAPIVersion } from '@/config/app.config';
import { truncateAllTables } from '@/utils/truncateDB';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import prisma from '@/services/prisma.service';

describe('Test doctors api', () => {
  const authBaseRoute = parseAPIVersion(1) + '/auth';
  const doctorsBaseRoute = parseAPIVersion(1) + '/doctors';
  afterAll(async () => {
    await truncateAllTables();
  });
  const userPayload: any = {
    name: 'Mehdi Jai',
    phone: '+212610010830',
    email: 'mjai@doctime.ma',
    password: '12345678',
    type: 'DOCTOR',
  };
  const doctorPayload = {
    userId: '',
    address: 'some address',
    specialty: 'Urology',
    mapPosition: {
      lat: 34.8870549,
      lng: -2.5195691,
    },
  };
  test('Test Create User', async () => {
    appConfig.requireVerifyEmail = false;
    const response = await request(app)
      .post(authBaseRoute + '/register')
      .send(userPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(userPayload.email);
    expect(response.body.data.userType).toEqual(userPayload.type);
    userPayload.userId = response.body.data.id;
    doctorPayload.userId = response.body.data.id;
  });

  test('Test Login', async () => {
    const loginPayload = {
      email: userPayload.email,
      password: userPayload.password,
      type: userPayload.type,
    };

    const response = await request(app)
      .post(authBaseRoute + '/login')
      .send(loginPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.accessToken.token).toBeDefined();
    expect(response.body.data.accessToken.refreshToken).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.id).toEqual(userPayload.userId);
    expect(response.body.data.user.email).toEqual(userPayload.email);
    expect(response.body.data.user.userType).toEqual(userPayload.type);
    userPayload.accessToken = response.body.data.accessToken.token;
    userPayload.refreshToken = response.body.data.accessToken.refreshToken;
  });

  test('Test create doctor -- unauthenticated', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/')
      .send(doctorPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  test('Test create doctor', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/')
      .send(doctorPayload)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.id).toEqual(userPayload.userId);

    // Test in Prisma
    const storedDoctor = await prisma.doctor.findUnique({
      where: { id: response.body.data.id },
    });

    expect(storedDoctor).toBeDefined();
  });
});
