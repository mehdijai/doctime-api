"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@/app"));
const app_config_1 = __importStar(require("@/config/app.config"));
const truncateDB_1 = require("@/utils/truncateDB");
const HTTPStatusCodes_1 = __importDefault(require("@/utils/HTTPStatusCodes"));
const prisma_service_1 = __importDefault(require("@/services/prisma.service"));
const moment_1 = __importDefault(require("moment"));
describe('Test patients api', () => {
    const authBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/auth';
    const patientsBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/patients';
    const doctorsBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/doctors';
    const appointmentsBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/appointments';
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, truncateDB_1.truncateAllTables)();
    }));
    const doctorUserPayload = {
        name: 'Doctor',
        phone: '+212610010830',
        email: 'doc@doctime.ma',
        password: '12345678',
        type: 'DOCTOR',
    };
    const doctorPayload = {
        address: 'some address',
        specialty: 'Urology',
    };
    const doctorUserPayload2 = {
        name: 'Doctor 2',
        phone: '+212618010830',
        email: 'doc2@doctime.ma',
        password: '12345678',
        type: 'DOCTOR',
    };
    const doctorPayload2 = {
        address: 'some 2 address',
        specialty: 'Urology',
    };
    const patientUserPayload = {
        name: 'Patient',
        phone: '+212610910830',
        email: 'patient@doctime.ma',
        password: '12345678',
        type: 'PATIENT',
    };
    const patientPayload = {
        birthDate: new Date(),
        gender: 'Male',
        address: 'Some address',
        occupation: 'Dev',
        emergencyContactName: 'Emergency',
        emergencyContactNumber: '+212810910830',
        primaryPhysician: 'Dr. X',
        privacyConsent: true,
    };
    test('Create Doctor User', () => __awaiter(void 0, void 0, void 0, function* () {
        app_config_1.default.requireVerifyEmail = false;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/register')
            .send(doctorUserPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toEqual(doctorUserPayload.email);
        expect(response.body.data.userType).toEqual(doctorUserPayload.type);
        doctorUserPayload.userId = response.body.data.id;
    }));
    test('Test Login doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: doctorUserPayload.email,
            password: doctorUserPayload.password,
            type: doctorUserPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/login')
            .send(loginPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
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
    }));
    test('Create doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(doctorsBaseRoute + '/')
            .send(doctorPayload)
            .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.id).toBeDefined();
        expect(response.body.data.user.id).toEqual(doctorUserPayload.userId);
        doctorPayload.id = response.body.data.id;
        // Test in Prisma
        const storedDoctor = yield prisma_service_1.default.doctor.findUnique({
            where: { id: response.body.data.id },
        });
        expect(storedDoctor).toBeDefined();
    }));
    test('Create Doctor 2 User', () => __awaiter(void 0, void 0, void 0, function* () {
        app_config_1.default.requireVerifyEmail = false;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/register')
            .send(doctorUserPayload2)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toEqual(doctorUserPayload2.email);
        expect(response.body.data.userType).toEqual(doctorUserPayload2.type);
        doctorUserPayload2.userId = response.body.data.id;
    }));
    test('Test Login doctor 2', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: doctorUserPayload2.email,
            password: doctorUserPayload2.password,
            type: doctorUserPayload2.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/login')
            .send(loginPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
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
    }));
    test('Create doctor 2', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(doctorsBaseRoute + '/')
            .send(doctorPayload2)
            .set('Authorization', 'Bearer ' + doctorUserPayload2.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.id).toBeDefined();
        expect(response.body.data.user.id).toEqual(doctorUserPayload2.userId);
        doctorPayload2.id = response.body.data.id;
        // Test in Prisma
        const storedDoctor = yield prisma_service_1.default.doctor.findUnique({
            where: { id: response.body.data.id },
        });
        expect(storedDoctor).toBeDefined();
    }));
    test('Test Create Patient User', () => __awaiter(void 0, void 0, void 0, function* () {
        app_config_1.default.requireVerifyEmail = false;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/register')
            .send(patientUserPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toEqual(patientUserPayload.email);
        expect(response.body.data.userType).toEqual(patientUserPayload.type);
        patientUserPayload.userId = response.body.data.id;
    }));
    test('Test Login patient user', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: patientUserPayload.email,
            password: patientUserPayload.password,
            type: patientUserPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/login')
            .send(loginPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
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
    }));
    test('Test create patient', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(patientsBaseRoute + '/')
            .send(patientPayload)
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.id).toBeDefined();
        expect(response.body.data.user.id).toEqual(patientUserPayload.userId);
        patientPayload.id = response.body.data.id;
        // Test in Prisma
        const storedPatient = yield prisma_service_1.default.patient.findUnique({
            where: { id: response.body.data.id },
        });
        expect(storedPatient).toBeDefined();
    }));
    const appointmentPayload = {
        patientId: '',
        doctorId: '',
        schedule: (0, moment_1.default)().add(3, 'd').toDate(),
        reason: 'Testing reason',
    };
    const createAppointmentPayload = Object.assign({}, appointmentPayload);
    test('Test create appointment', () => __awaiter(void 0, void 0, void 0, function* () {
        createAppointmentPayload.patientId = patientPayload.id;
        createAppointmentPayload.doctorId = doctorPayload.id;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(appointmentsBaseRoute + '/')
            .send(createAppointmentPayload)
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.doctor.id).toEqual(createAppointmentPayload.doctorId);
        expect(response.body.data.patient.id).toEqual(createAppointmentPayload.patientId);
        appointmentPayload.id = response.body.data.id;
    }));
    test('Test search appointments -- empty', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(appointmentsBaseRoute + '/')
            .query({
            status: 'CANCELLED',
        })
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(0);
    }));
    test('Test search appointments -- all', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(appointmentsBaseRoute + '/')
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(1);
    }));
    test('Test search appointments -- external user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(appointmentsBaseRoute + '/')
            .set('Authorization', 'Bearer ' + doctorUserPayload2.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(0);
    }));
    test('Test get appointment', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(appointmentsBaseRoute + '/' + appointmentPayload.id)
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toEqual(appointmentPayload.id);
        expect(response.body.data.doctor.id).toEqual(createAppointmentPayload.doctorId);
        expect(response.body.data.patient.id).toEqual(createAppointmentPayload.patientId);
    }));
    test('Test get appointment -- external user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(appointmentsBaseRoute + '/' + appointmentPayload.id)
            .set('Authorization', 'Bearer ' + doctorUserPayload2.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.NOT_FOUND);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.NOT_FOUND);
    }));
    test('Test update appointments', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(appointmentsBaseRoute + '/')
            .send({
            id: appointmentPayload.id,
            status: 'SCHEDULED',
        })
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.status).toEqual('SCHEDULED');
        const appointment = yield prisma_service_1.default.appointment.findUnique({
            where: { id: appointmentPayload.id },
        });
        expect(appointment === null || appointment === void 0 ? void 0 : appointment.status).toEqual('SCHEDULED');
    }));
    test('Test delete appointments', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(appointmentsBaseRoute + '/')
            .send({
            id: appointmentPayload.id,
        })
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.status).toEqual(true);
        const appointment = yield prisma_service_1.default.appointment.findUnique({
            where: { id: appointmentPayload.id },
        });
        expect(appointment).toBeNull();
    }));
});
