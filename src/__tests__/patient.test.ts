import request from 'supertest';
import app from '@/app';
import appConfig, { parseAPIVersion } from '@/config/app.config';
import { truncateAllTables } from '@/utils/truncateDB';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import prisma from '@/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('Test patients api', () => {
  const authBaseRoute = parseAPIVersion(1) + '/auth';
  const patientsBaseRoute = parseAPIVersion(1) + '/patients';
  const doctorsBaseRoute = parseAPIVersion(1) + '/doctors';

  afterAll(async () => {
    await truncateAllTables();
  });
  const doctorUserPayload: any = {
    name: 'Mehdi Jai',
    phone: '+212610010830',
    email: 'mjai@doctime.ma',
    password: '12345678',
    type: 'DOCTOR',
  };
  const patientUserPayload: any = {
    name: 'Hossam Jai',
    phone: '+212610910830',
    email: 'hjai@doctime.ma',
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
  const patientPayload: any = {
    birthDate: new Date(),
    gender: 'Male',
    address: 'Some address',
    occupation: 'Dev',
    emergencyContactName: 'Mustapha Jai',
    emergencyContactNumber: '+212810910830',
    primaryPhysician: 'Dr. Aouad',
    privacyConsent: true,
  };

  test('Create Doctor User', async () => {
    appConfig.requireVerifyEmail = false;
    const response = await request(app)
      .post(authBaseRoute + '/register')
      .send(doctorUserPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(doctorUserPayload.email);
    expect(response.body.data.userType).toEqual(doctorUserPayload.type);
    doctorUserPayload.userId = response.body.data.id;
  });

  test('Test Login doctor', async () => {
    const loginPayload = {
      email: doctorUserPayload.email,
      password: doctorUserPayload.password,
      type: doctorUserPayload.type,
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
    expect(response.body.data.user.id).toEqual(doctorUserPayload.userId);
    expect(response.body.data.user.email).toEqual(doctorUserPayload.email);
    expect(response.body.data.user.userType).toEqual(doctorUserPayload.type);
    doctorUserPayload.accessToken = response.body.data.accessToken.token;
    doctorUserPayload.refreshToken = response.body.data.accessToken.refreshToken;
  });

  test('Create doctor', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/')
      .send(doctorPayload)
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

    doctorPayload.id = response.body.data.id;

    // Test in Prisma
    const storedDoctor = await prisma.doctor.findUnique({
      where: { id: response.body.data.id },
    });

    expect(storedDoctor).toBeDefined();
  });

  test('Test Patient User', async () => {
    appConfig.requireVerifyEmail = false;
    const response = await request(app)
      .post(authBaseRoute + '/register')
      .send(patientUserPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(patientUserPayload.email);
    expect(response.body.data.userType).toEqual(patientUserPayload.type);
    patientUserPayload.userId = response.body.data.id;
  });

  test('Test Login', async () => {
    const loginPayload = {
      email: patientUserPayload.email,
      password: patientUserPayload.password,
      type: patientUserPayload.type,
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
    expect(response.body.data.user.id).toEqual(patientUserPayload.userId);
    expect(response.body.data.user.email).toEqual(patientUserPayload.email);
    expect(response.body.data.user.userType).toEqual(patientUserPayload.type);
    patientUserPayload.accessToken = response.body.data.accessToken.token;
    patientUserPayload.refreshToken = response.body.data.accessToken.refreshToken;
  });

  test('Test create patient -- unauthenticated', async () => {
    const response = await request(app)
      .post(patientsBaseRoute + '/')
      .send(patientPayload)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  test('Test create patient', async () => {
    const response = await request(app)
      .post(patientsBaseRoute + '/')
      .send(patientPayload)
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.id).toEqual(patientUserPayload.userId);

    patientPayload.id = response.body.data.id;

    // Test in Prisma
    const storedPatient = await prisma.patient.findUnique({
      where: { id: response.body.data.id },
    });

    expect(storedPatient).toBeDefined();
  });

  test('Test list patients -- Doctor not linked', async () => {
    const response = await request(app)
      .get(patientsBaseRoute + '/')
      .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toEqual(0);
  });

  test('Test link patient to doctor', async () => {
    const response = await request(app)
      .post(patientsBaseRoute + '/add-doctor')
      .send({ doctorId: doctorPayload.id })
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.doctors).toBeDefined();
    expect(response.body.data.doctors.length).toEqual(1);
    expect(response.body.data.doctors[0].id).toEqual(doctorPayload.id);
  });

  test('Test list patients -- Doctor is linked', async () => {
    const response = await request(app)
      .get(patientsBaseRoute + '/')
      .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toEqual(1);
    expect("emergencyContactName" in response.body.data[0]).toEqual(false)
  });

  test('Test search patients -- Search Name', async () => {
    const response = await request(app)
      .get(patientsBaseRoute + '/')
      .query({ name: 'Hassan' })
      .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toEqual(0);
  });

  test('Test get patient', async () => {
    const response = await request(app)
      .get(patientsBaseRoute + '/' + patientPayload.id)
      .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toEqual(patientPayload.id);
    expect("emergencyContactName" in response.body.data).toEqual(true)
  });

  test('Test unlink patient to doctor', async () => {
    const response = await request(app)
      .post(patientsBaseRoute + '/remove-doctor')
      .send({ doctorId: doctorPayload.id })
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.doctors).toBeDefined();
    expect(response.body.data.doctors.length).toEqual(0);
  });

  test('Test get patient -- Unlinked doctor', async () => {
    const response = await request(app)
      .get(patientsBaseRoute + '/' + patientPayload.id)
      .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.NOT_FOUND);
  });

  //   test('Test get patient -- non existing', async () => {
  //     const response = await request(app)
  //       .get(patientsBaseRoute + '/' + uuidv4())
  //       .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
  //       .set('Accept', 'application/json');

  //     expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
  //     expect(response.body).toBeDefined();
  //     expect(response.body.data).toBeUndefined();
  //     expect(response.body.error).toBeDefined();
  //     expect(response.body.error.code).toEqual(HttpStatusCode.NOT_FOUND);
  //   });

  //   test('Test update patient', async () => {
  //     const updatePayload = {
  //       id: patientPayload.id,
  //       address: 'some other address',
  //     };
  //     const response = await request(app)
  //       .put(patientsBaseRoute + '/')
  //       .send(updatePayload)
  //       .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
  //       .set('Accept', 'application/json');

  //     expect(response.status).toBe(HttpStatusCode.OK);
  //     expect(response.body).toBeDefined();
  //     expect(response.body.error).toBeUndefined();
  //     expect(response.body.data).toBeDefined();
  //     expect(response.body.data.address).toEqual(updatePayload.address);

  //     const patient = await prisma.patient.findUnique({
  //       where: { id: patientPayload.id },
  //     });

  //     expect(patient).toBeDefined();
  //     expect(patient?.address).toEqual(updatePayload.address);
  //   });

  //   test('Test delete patient', async () => {
  //     const deletePayload = {
  //       id: patientPayload.id,
  //     };
  //     const response = await request(app)
  //       .delete(patientsBaseRoute + '/')
  //       .send(deletePayload)
  //       .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
  //       .set('Accept', 'application/json');

  //     expect(response.status).toBe(HttpStatusCode.OK);
  //     expect(response.body).toBeDefined();
  //     expect(response.body.error).toBeUndefined();
  //     expect(response.body.data).toBeDefined();
  //     expect(response.body.data.status).toEqual(true);

  //     const patient = await prisma.patient.findUnique({
  //       where: { id: patientPayload.id },
  //     });

  //     expect(patient).toBeNull();
  //   });
});
