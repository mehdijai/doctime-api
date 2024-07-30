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
const uuid_1 = require("uuid");
const mailerUtils_1 = require("@/utils/mailerUtils");
describe('Test doctors api', () => {
    const authBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/auth';
    const doctorsBaseRoute = (0, app_config_1.parseAPIVersion)(1) + '/doctors';
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, truncateDB_1.truncateAllTables)();
    }));
    const userPayload = {
        name: 'Mehdi Jai',
        phone: '+212610010830',
        email: 'mjai@doctime.ma',
        password: '12345678',
        type: 'DOCTOR',
    };
    const invalidUserPayload = {
        name: 'John Doe',
        phone: '+212610090830',
        email: 'jdoe@doctime.ma',
        password: '12345678',
        type: 'PATIENT',
    };
    const doctorPayload = {
        address: 'some address',
        specialty: 'Urology',
        mapPosition: {
            lat: 34.8870549,
            lng: -2.5195691,
        },
    };
    test('Test Create the invalid User', () => __awaiter(void 0, void 0, void 0, function* () {
        app_config_1.default.requireVerifyEmail = false;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/register')
            .send(invalidUserPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toEqual(invalidUserPayload.email);
        expect(response.body.data.userType).toEqual(invalidUserPayload.type);
        invalidUserPayload.userId = response.body.data.id;
    }));
    test('Test Login the invalid user', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: invalidUserPayload.email,
            password: invalidUserPayload.password,
            type: invalidUserPayload.type,
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
        expect(response.body.data.user.id).toEqual(invalidUserPayload.userId);
        expect(response.body.data.user.email).toEqual(invalidUserPayload.email);
        expect(response.body.data.user.userType).toEqual(invalidUserPayload.type);
        invalidUserPayload.accessToken = response.body.data.accessToken.token;
        invalidUserPayload.refreshToken = response.body.data.accessToken.refreshToken;
    }));
    test('Test create doctor of invalid user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(doctorsBaseRoute + '/')
            .send(doctorPayload)
            .set('Authorization', 'Bearer ' + invalidUserPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.FORBIDDEN);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.FORBIDDEN);
    }));
    test('Test Create User', () => __awaiter(void 0, void 0, void 0, function* () {
        app_config_1.default.requireVerifyEmail = false;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(authBaseRoute + '/register')
            .send(userPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toEqual(userPayload.email);
        expect(response.body.data.userType).toEqual(userPayload.type);
        userPayload.userId = response.body.data.id;
    }));
    test('Test Login', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: userPayload.email,
            password: userPayload.password,
            type: userPayload.type,
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
        expect(response.body.data.user.id).toEqual(userPayload.userId);
        expect(response.body.data.user.email).toEqual(userPayload.email);
        expect(response.body.data.user.userType).toEqual(userPayload.type);
        userPayload.accessToken = response.body.data.accessToken.token;
        userPayload.refreshToken = response.body.data.accessToken.refreshToken;
    }));
    test('Test create doctor -- unauthenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(doctorsBaseRoute + '/')
            .send(doctorPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
    }));
    test('Test create doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(doctorsBaseRoute + '/')
            .send(doctorPayload)
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.id).toBeDefined();
        expect(response.body.data.user.id).toEqual(userPayload.userId);
        doctorPayload.id = response.body.data.id;
        // Test in Prisma
        const storedDoctor = yield prisma_service_1.default.doctor.findUnique({
            where: { id: response.body.data.id },
        });
        expect(storedDoctor).toBeDefined();
    }));
    test('Test create doctor in user with existing doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(doctorsBaseRoute + '/')
            .send({
            address: 'some x address',
            specialty: 'Urology',
        })
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.FORBIDDEN);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.FORBIDDEN);
    }));
    test('Test list doctors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(doctorsBaseRoute + '/')
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].id).toEqual(doctorPayload.id);
    }));
    test('Test search doctors -- Search Name', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(doctorsBaseRoute + '/')
            .query({ name: 'Hassan' })
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(0);
    }));
    test('Test search doctors -- Near me', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(doctorsBaseRoute + '/')
            .query({
            nearMe: {
                lat: 34.89054894126703,
                lng: -2.516329371111121,
            },
        })
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(1);
    }));
    test('Test search doctors -- NOT Near me', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(doctorsBaseRoute + '/')
            .query({
            nearMe: {
                lat: 34.87021040967859,
                lng: -2.3564429284624344,
            },
        })
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toEqual(0);
    }));
    test('Test get doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(doctorsBaseRoute + '/' + doctorPayload.id)
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toEqual(doctorPayload.id);
    }));
    test('Test get doctor -- non existing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(doctorsBaseRoute + '/' + (0, uuid_1.v4)())
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.NOT_FOUND);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.NOT_FOUND);
    }));
    test('Test update doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatePayload = {
            id: doctorPayload.id,
            address: 'some other address',
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(doctorsBaseRoute + '/')
            .send(updatePayload)
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.address).toEqual(updatePayload.address);
        const doctor = yield prisma_service_1.default.doctor.findUnique({
            where: { id: doctorPayload.id },
        });
        expect(doctor).toBeDefined();
        expect(doctor === null || doctor === void 0 ? void 0 : doctor.address).toEqual(updatePayload.address);
    }));
    test('Test delete doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const deletePayload = {
            id: doctorPayload.id,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(doctorsBaseRoute + '/')
            .send(deletePayload)
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.status).toEqual(true);
        userPayload.deleteConfirmationToken = (0, mailerUtils_1.testEmails)('Confirm deleting profile');
        const doctor = yield prisma_service_1.default.doctor.findUnique({
            where: { id: doctorPayload.id },
        });
        expect(doctor).toBeDefined();
    }));
    test('Test confirm delete doctor', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(doctorsBaseRoute + '/confirm-delete')
            .send({
            token: userPayload.deleteConfirmationToken,
        })
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.status).toEqual(true);
        const doctor = yield prisma_service_1.default.doctor.findUnique({
            where: { id: doctorPayload.id },
        });
        expect(doctor).toBeNull();
        const user = yield prisma_service_1.default.user.findUnique({
            where: { id: userPayload.userId },
        });
        expect(user).toBeNull();
    }));
});
