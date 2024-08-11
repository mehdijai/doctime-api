import request from 'supertest';
import app from '@/app';
import { parseAPIVersion } from '@/config/app.config';
import { truncateAllTables } from '@/utils/truncateDB';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import wait from '@/utils/helpers';
import prisma from '@/services/prisma.service';
import { testEmails } from '@/utils/mailerUtils';
import { seedPermissions } from '@/utils/seeders/permissions';

describe('Test Permissions and Guards', () => {
  const baseRoute = parseAPIVersion(1) + '/auth';
  const doctorsBaseRoute = parseAPIVersion(1) + '/doctors';

  beforeAll(async () => {
    await seedPermissions();
  });
  afterAll(async () => {
    await truncateAllTables();
  });
  const adminUserPayload: any = {
    name: 'Mehdi Jai',
    phone: '+212610010830',
    email: 'mjai@doctime.ma',
    password: '12345678',
    type: 'ADMIN',
  };
  const doctorUserPayload: any = {
    name: 'Dr X',
    phone: '+212810010830',
    email: 'mjai.doctor@doctime.ma',
    password: '12345678',
    type: 'DOCTOR',
  };
  const patientUserPayload: any = {
    name: 'Patient X',
    phone: '+212820010830',
    email: 'mjai.patient@doctime.ma',
    password: '12345678',
    type: 'PATIENT',
  };

  // ! ADMIN

  test('Test Create Admin User', async () => {
    const response = await request(app)
      .post(baseRoute + '/register')
      .send(adminUserPayload)
      .set('Accept', 'application/json');

    await wait(1000);
    adminUserPayload.verificationToken = testEmails('Verify Email');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(adminUserPayload.email);
    expect(response.body.data.userType).toEqual(adminUserPayload.type);
    adminUserPayload.userId = response.body.data.id;

    await prisma.user.update({
      where: {
        id: adminUserPayload.userId,
      },
      data: {
        verifiedEmail: true,
        verifiedPhoneNumber: true,
      },
    });
  });

  test('Test Login Admin', async () => {
    const loginPayload = {
      email: adminUserPayload.email,
      password: adminUserPayload.password,
      type: adminUserPayload.type,
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
    adminUserPayload.accessToken = response.body.data.accessToken.token;
    adminUserPayload.refreshToken = response.body.data.accessToken.refreshToken;
  });

  // ! Doctor

  test('Test Create Doctor User', async () => {
    const response = await request(app)
      .post(baseRoute + '/register')
      .send(doctorUserPayload)
      .set('Accept', 'application/json');

    await wait(1000);
    doctorUserPayload.verificationToken = testEmails('Verify Email');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(doctorUserPayload.email);
    expect(response.body.data.userType).toEqual(doctorUserPayload.type);
    doctorUserPayload.userId = response.body.data.id;

    await prisma.user.update({
      where: {
        id: doctorUserPayload.userId,
      },
      data: {
        verifiedEmail: true,
        verifiedPhoneNumber: true,
      },
    });
  });

  test('Test Login Doctor', async () => {
    const loginPayload = {
      email: doctorUserPayload.email,
      password: doctorUserPayload.password,
      type: doctorUserPayload.type,
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
    doctorUserPayload.accessToken = response.body.data.accessToken.token;
    doctorUserPayload.refreshToken = response.body.data.accessToken.refreshToken;
  });

  // ! Patient

  test('Test Create Patient User', async () => {
    const response = await request(app)
      .post(baseRoute + '/register')
      .send(patientUserPayload)
      .set('Accept', 'application/json');

    await wait(1000);
    patientUserPayload.verificationToken = testEmails('Verify Email');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(patientUserPayload.email);
    expect(response.body.data.userType).toEqual(patientUserPayload.type);
    patientUserPayload.userId = response.body.data.id;

    await prisma.user.update({
      where: {
        id: patientUserPayload.userId,
      },
      data: {
        verifiedEmail: true,
        verifiedPhoneNumber: true,
      },
    });
  });

  test('Test Login Doctor', async () => {
    const loginPayload = {
      email: patientUserPayload.email,
      password: patientUserPayload.password,
      type: patientUserPayload.type,
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
    patientUserPayload.accessToken = response.body.data.accessToken.token;
    patientUserPayload.refreshToken = response.body.data.accessToken.refreshToken;
  });

  test('Test create doctor by patient', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/')
      .send({
        address: 'some address',
        specialty: 'Urology',
        mapPosition: {
          lat: 34.8870549,
          lng: -2.5195691,
        },
      })
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.FORBIDDEN);
  });

  test('Test create doctor', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/')
      .send({
        address: 'some address',
        specialty: 'Urology',
        mapPosition: {
          lat: 34.8870549,
          lng: -2.5195691,
        },
      })
      .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.id).toEqual(doctorUserPayload.userId);

    doctorUserPayload.id = response.body.data.id;

    // Test in Prisma
    const storedDoctor = await prisma.doctor.findUnique({
      where: { id: response.body.data.id },
    });

    expect(storedDoctor).toBeDefined();
  });
});
