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
const helpers_1 = __importDefault(require("@/utils/helpers"));
const prisma_service_1 = __importDefault(require("@/services/prisma.service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const mailerUtils_1 = require("@/utils/mailerUtils");
describe('Test Auth system', () => {
    const baseRoute = (0, app_config_1.parseAPIVersion)(1) + '/auth';
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
    test('Test Create User', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/register')
            .send(userPayload)
            .set('Accept', 'application/json');
        userPayload.verificationToken = (0, mailerUtils_1.testEmails)('Verify Email');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.email).toEqual(userPayload.email);
        expect(response.body.data.userType).toEqual(userPayload.type);
        userPayload.userId = response.body.data.id;
    }));
    test('Test Create User email conflict', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/register')
            .send({
            name: userPayload.name,
            phone: userPayload.phone,
            email: userPayload.email,
            password: userPayload.password,
            type: userPayload.type,
        })
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.CONFLICT);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.CONFLICT);
    }));
    test('Test verify User', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/verify-user')
            .send({
            token: userPayload.verificationToken,
        })
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.status).toEqual(true);
        const user = yield prisma_service_1.default.user.findUnique({
            where: {
                id: userPayload.userId,
            },
        });
        expect(user).toBeDefined();
        expect(user === null || user === void 0 ? void 0 : user.verifiedEmail).toEqual(true);
    }));
    test('Test Login', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: userPayload.email,
            password: userPayload.password,
            type: userPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/login')
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
    test('Test Login none existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: 'other-mail@mail.com',
            password: userPayload.password,
            type: userPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/login')
            .send(loginPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual('Credentials Error');
    }));
    test('Test Login wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: userPayload.email,
            password: userPayload.password + '78',
            type: userPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/login')
            .send(loginPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual('Password not match');
    }));
    test('Test unauthenticated user -- invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get((0, app_config_1.parseAPIVersion)(1) + '/protected')
            .set('Authorization', 'Bearer ' + 'some-token')
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.FORBIDDEN);
    }));
    test('Test unauthenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get((0, app_config_1.parseAPIVersion)(1) + '/protected')
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
    }));
    test('Test authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get((0, app_config_1.parseAPIVersion)(1) + '/protected')
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body.protected).toEqual(true);
    }));
    test('Test refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            refreshToken: userPayload.refreshToken,
        };
        app_config_1.default.jwt.expiresIn = '2s';
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/refresh-token')
            .send(payload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
        userPayload.newAccessToken = response.body.data.accessToken;
        userPayload.newRefreshToken = response.body.data.refreshToken;
    }));
    test('Test new token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get((0, app_config_1.parseAPIVersion)(1) + '/protected')
            .set('Authorization', 'Bearer ' + userPayload.newAccessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body.protected).toEqual(true);
    }));
    test('Test token expiration', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, helpers_1.default)(3000);
        const response = yield (0, supertest_1.default)(app_1.default)
            .get((0, app_config_1.parseAPIVersion)(1) + '/protected')
            .set('Authorization', 'Bearer ' + userPayload.newAccessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
    }));
    test('Test forget password', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/forget-password')
            .send({
            email: userPayload.email,
            type: userPayload.type,
        })
            .set('Accept', 'application/json');
        userPayload.forgotPasswordToken = (0, mailerUtils_1.testEmails)('Reset Password');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.status).toEqual(true);
    }));
    test('Test forget password wrong email', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/forget-password')
            .send({
            email: 'fake-' + userPayload.email,
            type: userPayload.type,
        })
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.NOT_FOUND);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.NOT_FOUND);
    }));
    test('Test reset password wrong token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/reset-password')
            .send({
            newPassword: userPayload.password,
            token: (0, uuid_1.v4)(),
        })
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.FORBIDDEN);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.FORBIDDEN);
        expect(response.body.error.message).toEqual('Invalid or expired token');
    }));
    test('Test reset password', () => __awaiter(void 0, void 0, void 0, function* () {
        userPayload.oldPassword = userPayload.password;
        userPayload.password = '123456789';
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/reset-password')
            .send({
            newPassword: userPayload.password,
            token: userPayload.forgotPasswordToken,
        })
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.status).toEqual(true);
        const user = yield prisma_service_1.default.user.findUnique({
            where: {
                id: userPayload.userId,
            },
        });
        expect(user).toBeDefined();
        if (user) {
            const isValidPassword = yield bcryptjs_1.default.compare(userPayload.password, user.password);
            expect(isValidPassword).toEqual(true);
        }
    }));
    test('Test old password', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: userPayload.email,
            password: userPayload.oldPassword,
            type: userPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/login')
            .send(loginPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual('Password not match');
    }));
    test('Test new password', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginPayload = {
            email: userPayload.email,
            password: userPayload.password,
            type: userPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/login')
            .send(loginPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
    }));
    test('Test update password -- Wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatePasswordPayload = {
            oldPassword: userPayload.oldPassword,
            newPassword: userPayload.password,
            type: userPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/update-password')
            .send(updatePasswordPayload)
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.UNAUTHORIZED);
        expect(response.body.error.message).toEqual('Invalid old password');
    }));
    test('Test update password -- password characters not enough', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatePasswordPayload = {
            oldPassword: userPayload.password,
            newPassword: '1234',
            type: userPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/update-password')
            .send(updatePasswordPayload)
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNPROCESSABLE_ENTITY);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.UNPROCESSABLE_ENTITY);
    }));
    test('Test update password -- unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatePasswordPayload = {
            oldPassword: userPayload.password,
            newPassword: userPayload.oldPassword,
            type: userPayload.type,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/update-password')
            .send(updatePasswordPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.UNAUTHORIZED);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(HTTPStatusCodes_1.default.UNAUTHORIZED);
    }));
    test('Test direct update password', () => __awaiter(void 0, void 0, void 0, function* () {
        app_config_1.default.updatePasswordRequireVerification = false;
        const updatePasswordPayload = {
            oldPassword: userPayload.password,
            newPassword: userPayload.oldPassword,
            type: userPayload.type,
        };
        userPayload.password = userPayload.oldPassword;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/update-password')
            .send(updatePasswordPayload)
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.status).toEqual(true);
        const user = yield prisma_service_1.default.user.findUnique({
            where: {
                id: userPayload.userId,
            },
        });
        expect(user).toBeDefined();
        if (user) {
            const isValidPassword = yield bcryptjs_1.default.compare(userPayload.password, user.password);
            expect(isValidPassword).toEqual(true);
        }
    }));
    test('Test confirming update password', () => __awaiter(void 0, void 0, void 0, function* () {
        app_config_1.default.updatePasswordRequireVerification = true;
        const updatePasswordPayload = {
            oldPassword: userPayload.password,
            newPassword: userPayload.oldPassword,
            type: userPayload.type,
        };
        userPayload.password = userPayload.oldPassword;
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/update-password')
            .send(updatePasswordPayload)
            .set('Authorization', 'Bearer ' + userPayload.accessToken)
            .set('Accept', 'application/json');
        userPayload.updatePasswordToken = (0, mailerUtils_1.testEmails)('Update Password');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.status).toEqual(true);
    }));
    test('Test confirm update password', () => __awaiter(void 0, void 0, void 0, function* () {
        const confirmUpdatePasswordPayload = {
            token: userPayload.updatePasswordToken,
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(baseRoute + '/confirm-update-password')
            .send(confirmUpdatePasswordPayload)
            .set('Accept', 'application/json');
        expect(response.status).toBe(HTTPStatusCodes_1.default.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.error).toBeUndefined();
        expect(response.body.data.status).toEqual(true);
        const user = yield prisma_service_1.default.user.findUnique({
            where: {
                id: userPayload.userId,
            },
        });
        expect(user).toBeDefined();
        if (user) {
            const isValidPassword = yield bcryptjs_1.default.compare(userPayload.password, user.password);
            expect(isValidPassword).toEqual(true);
        }
    }));
});
