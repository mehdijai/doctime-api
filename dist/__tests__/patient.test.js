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
const mailerUtils_1 = require("@/utils/mailerUtils");
describe('Test patients api', () => {
    const authBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/auth';
    const patientsBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/patients';
    const doctorsBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/doctors';
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, truncateDB_1.truncateAllTables)();
    }));
    const doctorUserPayload = {
        name: 'Mehdi Jai',
        phone: '+212610010830',
        email: 'mjai@doctime.ma',
        password: '12345678',
        type: 'DOCTOR',
    };
    const patientUserPayload = {
        name: 'Patient',
        phone: '+212610910830',
        email: 'hjai@doctime.ma',
        password: '12345678',
        type: 'PATIENT',
    };
    const patientInvalidUserPayload = {
        name: 'John Doe',
        phone: '+212616910830',
        email: 'jdoe@doctime.ma',
        password: '12345678',
        type: 'DOCTOR',
    };
    const doctorPayload = {
        address: 'some address',
        specialty: 'Urology',
        mapPosition: {
            lat: 34.8870549,
            lng: -2.5195691,
        },
    };
    const patientPayload = {
        birthDate: new Date(),
        gender: 'Male',
        address: 'Some address',
        occupation: 'Dev',
        emergencyContactName: 'Emergency',
        emergencyContactNumber: '+212810910830',
        primaryPhysician: 'Dr. x',
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
    test('Test Create Invalid Patient User', () => __awaiter(void 0, void 0, void 0, function* () {
        app_config_1.default.requireVerifyEmail = false;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/register')
            .send(patientInvalidUserPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toEqual(patientInvalidUserPayload.email);
        expect(response.body.data.userType).toEqual(patientInvalidUserPayload.type);
        patientInvalidUserPayload.userId = response.body.data.id;
    }));
    test('Test Login Invalid patient user', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: patientInvalidUserPayload.email,
            password: patientInvalidUserPayload.password,
            type: patientInvalidUserPayload.type,
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
        expect(response.body.data.user.id).toEqual(patientInvalidUserPayload.userId);
        expect(response.body.data.user.email).toEqual(patientInvalidUserPayload.email);
        expect(response.body.data.user.userType).toEqual(patientInvalidUserPayload.type);
        patientInvalidUserPayload.accessToken = response.body.data.accessToken.token;
        patientInvalidUserPayload.refreshToken = response.body.data.accessToken.refreshToken;
    }));
    test('Test create patient of invalid user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(patientsBaseRoute + '/')
            .send(patientPayload)
            .set('Authorization', 'Bearer ' + patientInvalidUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.FORBIDDEN);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.FORBIDDEN);
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
    test('Test create patient -- unauthenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(patientsBaseRoute + '/')
            .send(patientPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
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
    test('Test create patient in user with existing patient', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(patientsBaseRoute + '/')
            .send({
            birthDate: new Date(),
            gender: 'Male',
            address: 'Some x address',
            occupation: 'Barber',
            emergencyContactName: 'John doe',
            emergencyContactNumber: '+212816910830',
            primaryPhysician: 'Dr. Aouad',
            privacyConsent: true,
        })
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.FORBIDDEN);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.FORBIDDEN);
    }));
    test('Test list patients -- Doctor not linked', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(patientsBaseRoute + '/')
            .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(0);
    }));
    test('Test link patient to doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(patientsBaseRoute + '/add-doctor')
            .send({ doctorId: doctorPayload.id })
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.doctors).toBeDefined();
        expect(response.body.data.doctors.length).toEqual(1);
        expect(response.body.data.doctors[0].id).toEqual(doctorPayload.id);
    }));
    test('Test list patients -- Doctor is linked', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(patientsBaseRoute + '/')
            .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(1);
        expect('emergencyContactName' in response.body.data[0]).toEqual(false);
    }));
    test('Test search patients -- Search Name', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(patientsBaseRoute + '/')
            .query({ name: 'Hassan' })
            .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(0);
    }));
    test('Test get patient', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(patientsBaseRoute + '/' + patientPayload.id)
            .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toEqual(patientPayload.id);
        expect('emergencyContactName' in response.body.data).toEqual(true);
    }));
    test('Test unlink patient to doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(patientsBaseRoute + '/remove-doctor')
            .send({ doctorId: doctorPayload.id })
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.doctors).toBeDefined();
        expect(response.body.data.doctors.length).toEqual(0);
    }));
    test('Test get patient -- Unlinked doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(patientsBaseRoute + '/' + patientPayload.id)
            .set('Authorization', 'Bearer ' + doctorUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.NOT_FOUND);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.NOT_FOUND);
    }));
    test('Test get patient profile', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(patientsBaseRoute + '/me')
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toEqual(patientPayload.id);
        expect('emergencyContactName' in response.body.data).toEqual(true);
    }));
    test('Test update patient', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatePayload = {
            id: patientPayload.id,
            address: 'some other address',
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(patientsBaseRoute + '/')
            .send(updatePayload)
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.address).toEqual(updatePayload.address);
        const patient = yield prisma_service_1.default.patient.findUnique({
            where: { id: patientPayload.id },
        });
        expect(patient).toBeDefined();
        expect(patient === null || patient === void 0 ? void 0 : patient.address).toEqual(updatePayload.address);
    }));
    test('Test delete patient', () => __awaiter(void 0, void 0, void 0, function* () {
        const deletePayload = {
            id: patientPayload.id,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(patientsBaseRoute + '/')
            .send(deletePayload)
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.status).toEqual(true);
        patientUserPayload.deleteConfirmationToken = (0, mailerUtils_1.testEmails)('Confirm deleting profile');
        const patient = yield prisma_service_1.default.patient.findUnique({
            where: { id: patientPayload.id },
        });
        expect(patient).toBeDefined();
    }));
    test('Test confirm delete patient', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(patientsBaseRoute + '/confirm-delete')
            .send({
            token: patientUserPayload.deleteConfirmationToken,
        })
            .set('Authorization', 'Bearer ' + patientUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.status).toEqual(true);
        const patient = yield prisma_service_1.default.patient.findUnique({
            where: { id: patientPayload.id },
        });
        expect(patient).toBeNull();
        const user = yield prisma_service_1.default.user.findUnique({
            where: { id: patientUserPayload.userId },
        });
        expect(user).toBeNull();
    }));
});
