import request from 'supertest';
import app from '@/app';
import appConfig, { parseAPIVersion } from '@/config/app.config';
import { truncateAllTables } from '@/utils/truncateDB';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import wait from '@/utils/helpers';
import prisma from '@/services/prisma.service';
import { testEmails } from '@/utils/mailerUtils';

describe('Test Multi-factor Authentication System', () => {
  const baseRoute = parseAPIVersion(1) + '/auth';
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
  test('Test Create User', async () => {
    const response = await request(app)
      .post(baseRoute + '/register')
      .send(userPayload)
      .set('Accept', 'application/json');

    await wait(1000);
    userPayload.verificationToken = testEmails('Verify Email');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(userPayload.email);
    expect(response.body.data.userType).toEqual(userPayload.type);
    userPayload.userId = response.body.data.id;
  });

  test('Test Login', async () => {
    const loginPayload = {
      email: userPayload.email,
      password: userPayload.password,
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/login')
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

  test('Test verify User email', async () => {
    const response = await request(app)
      .post(baseRoute + '/verify-user')
      .send({
        token: userPayload.verificationToken,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.status).toEqual(true);

    const user = await prisma.user.findUnique({
      where: {
        id: userPayload.userId,
      },
    });

    expect(user).toBeDefined();
    expect(user?.verifiedEmail).toEqual(true);
  });

  test('Test verify User phone number', async () => {
    const response = await request(app)
      .post(baseRoute + '/verify-phone-number')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userPayload.accessToken);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.status).toEqual(true);
    expect(response.body.data.otp).toBeDefined();
    userPayload.otp = response.body.data.otp;
  });

  test('Test confirm User phone number', async () => {
    const response = await request(app)
      .post(baseRoute + '/confirm-phone-number')
      .send({
        otp: userPayload.otp,
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userPayload.accessToken);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.status).toEqual(true);

    const user = await prisma.user.findUnique({
      where: {
        id: userPayload.userId,
      },
    });

    expect(user).toBeDefined();
    expect(user?.verifiedPhoneNumber).toEqual(true);

    delete userPayload.otp;
  });

  test('Test Enable MFA', async () => {
    const response = await request(app)
      .post(baseRoute + '/enable-mfa')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + userPayload.accessToken);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.status).toEqual(true);

    const user = await prisma.user.findUnique({
      where: {
        id: userPayload.userId,
      },
    });

    expect(user).toBeDefined();
    expect(user?.enableMFA).toEqual(true);

    delete userPayload.accessToken;
    delete userPayload.refreshToken;
  });

  test('Test Login', async () => {
    const loginPayload = {
      email: userPayload.email,
      password: userPayload.password,
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/login')
      .send(loginPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.mfa).toEqual(true);
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.id).toEqual(userPayload.userId);
    expect(response.body.data.user.email).toEqual(userPayload.email);
    expect(response.body.data.user.userType).toEqual(userPayload.type);
  });

  test('Test send MFA request', async () => {
    const requestMFAPayload = {
      userId: userPayload.userId,
      method: 'email',
    };

    const response = await request(app)
      .post(baseRoute + '/send-mfa-request')
      .send(requestMFAPayload)
      .set('Accept', 'application/json');

    await wait(1000);
    userPayload.verificationOtp = testEmails(
      `Your One-Time Password (OTP) for Secure Access to ${appConfig.appName}`,
      true
    );

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.status).toEqual(true);
  });

  test('Test confirm MFA request', async () => {
    const requestMFAPayload = {
      userId: userPayload.userId,
      otp: userPayload.verificationOtp,
    };

    const response = await request(app)
      .post(baseRoute + '/confirm-mfa-request')
      .send(requestMFAPayload)
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
});
