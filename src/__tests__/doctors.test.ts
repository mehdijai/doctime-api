import request from 'supertest';
import app from '@/app';
import appConfig, { parseAPIVersion } from '@/config/app.config';
import { truncateAllTables } from '@/utils/truncateDB';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import prisma from '@/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { testEmails } from '@/utils/mailerUtils';

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
  const invalidUserPayload: any = {
    name: 'John Doe',
    phone: '+212610090830',
    email: 'jdoe@doctime.ma',
    password: '12345678',
    type: 'PATIENT',
  };
  const doctorPayload: any = {
    address: 'some address',
    specialty: 'Urology',
    mapPosition: {
      lat: 34.8870549,
      lng: -2.5195691,
    },
  };

  test('Test Create the invalid User', async () => {
    appConfig.requireVerifyEmail = false;
    const response = await request(app)
      .post(authBaseRoute + '/register')
      .send(invalidUserPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(invalidUserPayload.email);
    expect(response.body.data.userType).toEqual(invalidUserPayload.type);
    invalidUserPayload.userId = response.body.data.id;
  });

  test('Test Login the invalid user', async () => {
    const loginPayload = {
      email: invalidUserPayload.email,
      password: invalidUserPayload.password,
      type: invalidUserPayload.type,
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
    expect(response.body.data.user.id).toEqual(invalidUserPayload.userId);
    expect(response.body.data.user.email).toEqual(invalidUserPayload.email);
    expect(response.body.data.user.userType).toEqual(invalidUserPayload.type);
    invalidUserPayload.accessToken = response.body.data.accessToken.token;
    invalidUserPayload.refreshToken = response.body.data.accessToken.refreshToken;
  });

  test('Test create doctor of invalid user', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/')
      .send(doctorPayload)
      .set('Authorization', 'Bearer ' + invalidUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.FORBIDDEN);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.FORBIDDEN);
  });

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

    doctorPayload.id = response.body.data.id;

    // Test in Prisma
    const storedDoctor = await prisma.doctor.findUnique({
      where: { id: response.body.data.id },
    });

    expect(storedDoctor).toBeDefined();
  });

  test('Test create doctor in user with existing doctor', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/')
      .send({
        address: 'some x address',
        specialty: 'Urology',
      })
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.FORBIDDEN);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.FORBIDDEN);
  });

  test('Test list doctors', async () => {
    const response = await request(app)
      .get(doctorsBaseRoute + '/')
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toEqual(1);
    expect(response.body.data[0].id).toEqual(doctorPayload.id);
  });

  test('Test search doctors -- Search Name', async () => {
    const response = await request(app)
      .get(doctorsBaseRoute + '/')
      .query({ name: 'Hassan' })
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toEqual(0);
  });

  test('Test search doctors -- Near me', async () => {
    const response = await request(app)
      .get(doctorsBaseRoute + '/')
      .query({
        nearMe: {
          lat: 34.89054894126703,
          lng: -2.516329371111121,
        },
      })
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toEqual(1);
  });

  test('Test search doctors -- NOT Near me', async () => {
    const response = await request(app)
      .get(doctorsBaseRoute + '/')
      .query({
        nearMe: {
          lat: 34.87021040967859,
          lng: -2.3564429284624344,
        },
      })
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toEqual(0);
  });

  test('Test get doctor', async () => {
    const response = await request(app)
      .get(doctorsBaseRoute + '/' + doctorPayload.id)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toEqual(doctorPayload.id);
  });

  test('Test get doctor -- non existing', async () => {
    const response = await request(app)
      .get(doctorsBaseRoute + '/' + uuidv4())
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.NOT_FOUND);
  });

  test('Test update doctor', async () => {
    const updatePayload = {
      id: doctorPayload.id,
      address: 'some other address',
    };
    const response = await request(app)
      .put(doctorsBaseRoute + '/')
      .send(updatePayload)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.address).toEqual(updatePayload.address);

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorPayload.id },
    });

    expect(doctor).toBeDefined();
    expect(doctor?.address).toEqual(updatePayload.address);
  });

  test('Test delete doctor', async () => {
    const deletePayload = {
      id: doctorPayload.id,
    };
    const response = await request(app)
      .delete(doctorsBaseRoute + '/')
      .send(deletePayload)
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.status).toEqual(true);

    userPayload.deleteConfirmationToken = testEmails('Confirm deleting profile');

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorPayload.id },
    });

    expect(doctor).toBeDefined();
  });

  test('Test confirm delete doctor', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/confirm-delete')
      .send({
        token: userPayload.deleteConfirmationToken,
      })
      .set('Authorization', 'Bearer ' + userPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.status).toEqual(true);

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorPayload.id },
    });

    expect(doctor).toBeNull();

    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    expect(user).toBeNull();
  });
});
