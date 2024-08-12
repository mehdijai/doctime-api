import request from 'supertest';
import AppInstance from '@/app';
import appConfig, { parseAPIVersion } from '@/config/app.config';
import { truncateAllTables } from '@/utils/truncateDB';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import prisma from '@/services/prisma.service';
import moment from 'moment';

const app = AppInstance.app;

describe('Test patients api', () => {
  const authBaseRoute = parseAPIVersion(1) + '/auth';
  const patientsBaseRoute = parseAPIVersion(1) + '/patients';
  const doctorsBaseRoute = parseAPIVersion(1) + '/doctors';
  const appointmentsBaseRoute = parseAPIVersion(1) + '/appointments';

  afterAll(async () => {
    await truncateAllTables();
  });
  const doctorUserPayload: any = {
    name: 'Doctor',
    phone: '+212610010830',
    email: 'doc@doctime.ma',
    password: '12345678',
    type: 'DOCTOR',
  };
  const doctorPayload: any = {
    address: 'some address',
    specialty: 'Urology',
  };
  const doctorUserPayload2: any = {
    name: 'Doctor 2',
    phone: '+212618010830',
    email: 'doc2@doctime.ma',
    password: '12345678',
    type: 'DOCTOR',
  };
  const doctorPayload2: any = {
    address: 'some 2 address',
    specialty: 'Urology',
  };
  const patientUserPayload: any = {
    name: 'Patient',
    phone: '+212610910830',
    email: 'patient@doctime.ma',
    password: '12345678',
    type: 'PATIENT',
  };
  const patientPayload: any = {
    birthDate: new Date(),
    gender: 'Male',
    address: 'Some address',
    occupation: 'Dev',
    emergencyContactName: 'Emergency',
    emergencyContactNumber: '+212810910830',
    primaryPhysician: 'Dr. X',
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

  test('Create Doctor 2 User', async () => {
    appConfig.requireVerifyEmail = false;
    const response = await request(app)
      .post(authBaseRoute + '/register')
      .send(doctorUserPayload2)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.email).toEqual(doctorUserPayload2.email);
    expect(response.body.data.userType).toEqual(doctorUserPayload2.type);
    doctorUserPayload2.userId = response.body.data.id;
  });

  test('Test Login doctor 2', async () => {
    const loginPayload = {
      email: doctorUserPayload2.email,
      password: doctorUserPayload2.password,
      type: doctorUserPayload2.type,
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
    expect(response.body.data.user.id).toEqual(doctorUserPayload2.userId);
    expect(response.body.data.user.email).toEqual(doctorUserPayload2.email);
    expect(response.body.data.user.userType).toEqual(doctorUserPayload2.type);
    doctorUserPayload2.accessToken = response.body.data.accessToken.token;
    doctorUserPayload2.refreshToken = response.body.data.accessToken.refreshToken;
  });

  test('Create doctor 2', async () => {
    const response = await request(app)
      .post(doctorsBaseRoute + '/')
      .send(doctorPayload2)
      .set('Authorization', 'Bearer ' + doctorUserPayload2.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.id).toEqual(doctorUserPayload2.userId);

    doctorPayload2.id = response.body.data.id;

    // Test in Prisma
    const storedDoctor = await prisma.doctor.findUnique({
      where: { id: response.body.data.id },
    });

    expect(storedDoctor).toBeDefined();
  });

  test('Test Create Patient User', async () => {
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

  test('Test Login patient user', async () => {
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

  const appointmentPayload: any = {
    patientId: '',
    doctorId: '',
    schedule: moment().add(3, 'd').toDate(),
    reason: 'Testing reason',
  };
  const createAppointmentPayload: TCreateAppointmentSchema = {
    ...appointmentPayload,
  };

  test('Test create appointment', async () => {
    createAppointmentPayload.patientId = patientPayload.id;
    createAppointmentPayload.doctorId = doctorPayload.id;

    const response = await request(app)
      .post(appointmentsBaseRoute + '/')
      .send(createAppointmentPayload)
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.doctor.id).toEqual(createAppointmentPayload.doctorId);
    expect(response.body.data.patient.id).toEqual(createAppointmentPayload.patientId);

    appointmentPayload.id = response.body.data.id;
  });

  test('Test search appointments -- empty', async () => {
    const response = await request(app)
      .get(appointmentsBaseRoute + '/')
      .send({
        status: 'CANCELLED',
      })
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.items.length).toEqual(0);
  });

  test('Test search appointments -- Pagination', async () => {
    const response = await request(app)
      .get(appointmentsBaseRoute + '/')
      .send({
        take: 0,
      })
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();

    expect(response.body.data.items.length).toEqual(0);
    expect(response.body.data.total).toEqual(1);
  });

  test('Test search appointments -- all', async () => {
    const response = await request(app)
      .get(appointmentsBaseRoute + '/')
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.items.length).toEqual(1);
  });

  test('Test search appointments -- external user', async () => {
    const response = await request(app)
      .get(appointmentsBaseRoute + '/')
      .set('Authorization', 'Bearer ' + doctorUserPayload2.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.items.length).toEqual(0);
  });

  test('Test get appointment', async () => {
    const response = await request(app)
      .get(appointmentsBaseRoute + '/' + appointmentPayload.id)
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toEqual(appointmentPayload.id);
    expect(response.body.data.doctor.id).toEqual(createAppointmentPayload.doctorId);
    expect(response.body.data.patient.id).toEqual(createAppointmentPayload.patientId);
  });

  test('Test get appointment -- external user', async () => {
    const response = await request(app)
      .get(appointmentsBaseRoute + '/' + appointmentPayload.id)
      .set('Authorization', 'Bearer ' + doctorUserPayload2.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error.code).toEqual(HttpStatusCode.NOT_FOUND);
  });

  test('Test update appointments', async () => {
    const response = await request(app)
      .put(appointmentsBaseRoute + '/')
      .send({
        id: appointmentPayload.id,
        status: 'SCHEDULED',
      })
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.status).toEqual('SCHEDULED');

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentPayload.id },
    });

    expect(appointment?.status).toEqual('SCHEDULED');
  });

  test('Test delete appointments', async () => {
    const response = await request(app)
      .delete(appointmentsBaseRoute + '/')
      .send({
        id: appointmentPayload.id,
      })
      .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
      .set('Accept', 'application/json');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.status).toEqual(true);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentPayload.id },
    });

    expect(appointment).toBeNull();
  });
});
