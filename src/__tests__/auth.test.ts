import request from 'supertest';
import app from '@/app';
import appConfig, { parseAPIVersion } from '@/config/app.config';
import { truncateAllTables } from '@/utils/truncateDB';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import wait from '@/utils/helpers';
import * as nodemailer from 'nodemailer';
import { NodemailerMock } from 'nodemailer-mock';
import { getTokenFromMail } from '@/utils/mailerUtils';
const { mock } = nodemailer as unknown as NodemailerMock;
import prisma from '@/services/prisma.service';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

describe('Test Auth system', () => {
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

    const sentEmails = mock.getSentMail();

    const verifyEmail = sentEmails.find((email) => email.subject === 'Verify Email');
    expect(verifyEmail).toBeDefined();
    userPayload.verificationToken = getTokenFromMail(verifyEmail.html.toString());

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(userPayload.email);
    expect(response.body.data.userType).toEqual(userPayload.type);
    userPayload.userId = response.body.data.id;
  });

  test('Test verify User', async () => {
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
    expect(user.verifiedEmail).toEqual(true);
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
    // TODO: Test Doctor entity
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.id).toEqual(userPayload.userId);
    expect(response.body.data.user.email).toEqual(userPayload.email);
    expect(response.body.data.user.userType).toEqual(userPayload.type);
    userPayload.accessToken = response.body.data.accessToken.token;
    userPayload.refreshToken = response.body.data.accessToken.refreshToken;
  });

  test('Test Login none existing email', async () => {
    const loginPayload = {
      email: 'other-mail@mail.com',
      password: userPayload.password,
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/login')
      .send(loginPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toEqual('Credentials Error');
  });

  test('Test Login wrong password', async () => {
    const loginPayload = {
      email: userPayload.email,
      password: userPayload.password + '78',
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/login')
      .send(loginPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toEqual('Password not match');
  });

  test('Test unauthenticated user', async () => {
    const response = await request(app)
      .get(parseAPIVersion(1) + '/protected')
      .set('Accept', 'application/json');
    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  test('Test authenticated user', async () => {
    const response = await request(app)
      .get(parseAPIVersion(1) + '/protected')
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.protected).toEqual(true);
  });

  test('Test refresh token', async () => {
    const payload = {
      refreshToken: userPayload.refreshToken,
    };

    appConfig.jwt.expiresIn = '1s';

    const response = await request(app)
      .post(baseRoute + '/refresh-token')
      .send(payload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();

    userPayload.newAccessToken = response.body.data.accessToken;
    userPayload.newRefreshToken = response.body.data.refreshToken;
  });

  test('Test new token', async () => {
    const response = await request(app)
      .get(parseAPIVersion(1) + '/protected')
      .set('Authorization', 'Bearer ' + userPayload.newAccessToken)
      .set('Accept', 'application/json');
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.protected).toEqual(true);
  });

  test('Test token expiration', async () => {
    await wait(1000);
    const response = await request(app)
      .get(parseAPIVersion(1) + '/protected')
      .set('Authorization', 'Bearer ' + userPayload.newAccessToken)
      .set('Accept', 'application/json');
    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  test('Test forget password', async () => {
    const response = await request(app)
      .post(baseRoute + '/forget-password')
      .send({
        email: userPayload.email,
        type: userPayload.type,
      })
      .set('Accept', 'application/json');

    const sentEmails = mock.getSentMail();
    const resetPassword = sentEmails.find((email) => email.subject === 'Reset Password');
    expect(resetPassword).toBeDefined();
    userPayload.forgotPasswordToken = getTokenFromMail(resetPassword.html.toString());
    expect(userPayload.forgotPasswordToken).toBeDefined();
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.status).toEqual(true);
  });

  test('Test forget password wrong email', async () => {
    const response = await request(app)
      .post(baseRoute + '/forget-password')
      .send({
        email: 'fake-' + userPayload.email,
        type: userPayload.type,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.NOT_FOUND);
  });

  test('Test reset password wrong token', async () => {
    const response = await request(app)
      .post(baseRoute + '/reset-password')
      .send({
        newPassword: userPayload.password,
        token: uuidv4(),
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.FORBIDDEN);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.FORBIDDEN);
    expect(response.body.error.message).toEqual('Invalid or expired token');
  });

  test('Test reset password', async () => {
    userPayload.oldPassword = userPayload.password;
    userPayload.password = '123456789';
    const response = await request(app)
      .post(baseRoute + '/reset-password')
      .send({
        newPassword: userPayload.password,
        token: userPayload.forgotPasswordToken,
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
    const isValidPassword = await bcrypt.compare(userPayload.password, user.password);
    expect(isValidPassword).toEqual(true);
  });

  test('Test old password', async () => {
    const loginPayload = {
      email: userPayload.email,
      password: userPayload.oldPassword,
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/login')
      .send(loginPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toEqual('Password not match');
  });

  test('Test new password', async () => {
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
  });

  test('Test update password -- Wrong user', async () => {
    const updatePasswordPayload = {
      userId: uuidv4(),
      oldPassword: userPayload.oldPassword,
      newPassword: userPayload.password,
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/update-password')
      .send(updatePasswordPayload)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.NOT_FOUND);
  });

  test('Test update password -- Wrong password', async () => {
    const updatePasswordPayload = {
      userId: userPayload.userId,
      oldPassword: userPayload.oldPassword,
      newPassword: userPayload.password,
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/update-password')
      .send(updatePasswordPayload)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.UNAUTHORIZED);
    expect(response.body.error.message).toEqual('Invalid old password');
  });

  test('Test update password -- password characters not enough', async () => {
    const updatePasswordPayload = {
      userId: userPayload.userId,
      oldPassword: userPayload.password,
      newPassword: '1234',
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/update-password')
      .send(updatePasswordPayload)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.UNPROCESSABLE_ENTITY);
  });

  test('Test update password -- unauthorized', async () => {
    const updatePasswordPayload = {
      userId: userPayload.userId,
      oldPassword: userPayload.password,
      newPassword: userPayload.oldPassword,
      type: userPayload.type,
    };

    const response = await request(app)
      .post(baseRoute + '/update-password')
      .send(updatePasswordPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.UNAUTHORIZED);
  });

  test('Test direct update password', async () => {
    appConfig.updatePasswordRequireVerification = false;
    const updatePasswordPayload = {
      userId: userPayload.userId,
      oldPassword: userPayload.password,
      newPassword: userPayload.oldPassword,
      type: userPayload.type,
    };

    userPayload.password = userPayload.oldPassword;

    const response = await request(app)
      .post(baseRoute + '/update-password')
      .send(updatePasswordPayload)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
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
    const isValidPassword = await bcrypt.compare(userPayload.password, user.password);
    expect(isValidPassword).toEqual(true);
  });

  test('Test confirming update password', async () => {
    appConfig.updatePasswordRequireVerification = true;
    const updatePasswordPayload = {
      userId: userPayload.userId,
      oldPassword: userPayload.password,
      newPassword: userPayload.oldPassword,
      type: userPayload.type,
    };

    userPayload.password = userPayload.oldPassword;

    const response = await request(app)
      .post(baseRoute + '/update-password')
      .send(updatePasswordPayload)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    const sentEmails = mock.getSentMail();
    const updatePasswordEmail = sentEmails.find((email) => email.subject === 'Update Password');
    expect(updatePasswordEmail).toBeDefined();
    userPayload.updatePasswordToken = getTokenFromMail(updatePasswordEmail.html.toString());
    expect(userPayload.updatePasswordToken).toBeDefined();

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.status).toEqual(true);
  });

  test('Test confirm update password', async () => {
    appConfig.updatePasswordRequireVerification = true;
    const confirmUpdatePasswordPayload = {
      token: userPayload.updatePasswordToken,
    };

    const response = await request(app)
      .post(baseRoute + '/confirm-update-password')
      .send(confirmUpdatePasswordPayload)
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
    const isValidPassword = await bcrypt.compare(userPayload.password, user.password);
    expect(isValidPassword).toEqual(true);
  });
});
