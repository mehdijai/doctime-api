"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRepository = void 0;
const responseHandler_1 = require("@/utils/responseHandler");
const api_decorator_1 = require("@/decorators/api.decorator");
const auth_decorator_1 = require("@/decorators/auth.decorator");
const parsers_1 = require("@/utils/parsers");
const prisma_service_1 = __importDefault(require("@/services/prisma.service"));
const moment_1 = __importDefault(require("moment"));
const app_config_1 = __importDefault(require("@/config/app.config"));
class PatientRepository extends auth_decorator_1.AuthClass {
    static getPatientByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const patient = yield prisma_service_1.default.patient.findUnique({
                where: { userId },
            });
            return patient;
        });
    }
    static getPatient(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.USER.userId;
            const isProfile = !patientId;
            if (!patientId) {
                const patient = yield this.getPatientByUser(userId);
                if (!patient) {
                    return responseHandler_1.ResponseHandler.Forbidden('You are not eligible to access this resource');
                }
                else {
                    patientId = patient.id;
                }
            }
            const resBody = this.getResBody();
            const patient = yield prisma_service_1.default.patient.findUnique({
                where: {
                    id: patientId,
                    doctors: !isProfile
                        ? {
                            some: { userId },
                        }
                        : undefined,
                },
                include: {
                    user: true,
                    doctors: isProfile && {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            if (!patient) {
                return responseHandler_1.ResponseHandler.NotFound('Patient not found');
            }
            resBody.data = (0, parsers_1.parsePrivatePatient)(patient);
            return resBody;
        });
    }
    static getPatients(searchPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            const wherePrisma = {};
            if (searchPayload.name) {
                if (!wherePrisma['user']) {
                    wherePrisma['user'] = {};
                }
                wherePrisma['user']['name'] = { contains: searchPayload.name };
            }
            if (searchPayload.email) {
                if (!wherePrisma['user']) {
                    wherePrisma['user'] = {};
                }
                wherePrisma['user']['email'] = searchPayload.email;
            }
            if (searchPayload.phone) {
                if (!wherePrisma['user']) {
                    wherePrisma['user'] = {};
                }
                wherePrisma['user']['phone'] = searchPayload.phone;
            }
            if (searchPayload.birthDate) {
                wherePrisma['birthDate'] = {
                    lte: (0, moment_1.default)(searchPayload.birthDate).startOf('D'),
                    gte: (0, moment_1.default)(searchPayload.birthDate).endOf('D'),
                };
            }
            if (searchPayload.gender) {
                wherePrisma['gender'] = searchPayload.gender;
            }
            if (searchPayload.address) {
                wherePrisma['address'] = {
                    contains: searchPayload.address,
                };
            }
            const patients = yield prisma_service_1.default.patient.findMany({
                where: Object.assign({ doctors: {
                        some: { userId },
                    } }, wherePrisma),
                include: {
                    user: true,
                },
            });
            resBody.data = patients.map((patient) => (0, parsers_1.parsePublicPatient)(patient));
            return resBody;
        });
    }
    static createPatient(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            if (!(yield this.isValidUser(userId, 'PATIENT'))) {
                return responseHandler_1.ResponseHandler.Forbidden('This user is not allowed to perform this action');
            }
            const patient = yield prisma_service_1.default.patient.create({
                data: Object.assign(Object.assign({}, payload), { gender: payload.gender, user: {
                        connect: {
                            id: userId,
                        },
                    } }),
                include: {
                    user: true,
                },
            });
            resBody.data = (0, parsers_1.parsePrivatePatient)(patient);
            return resBody;
        });
    }
    static updatePatient(_a) {
        return __awaiter(this, void 0, void 0, function* () {
            var { id } = _a, payload = __rest(_a, ["id"]);
            const resBody = this.getResBody();
            const patient = yield prisma_service_1.default.patient.update({
                where: { id },
                data: Object.assign(Object.assign({}, payload), { gender: payload.gender && payload.gender }),
                include: {
                    user: true,
                },
            });
            resBody.data = (0, parsers_1.parsePrivatePatient)(patient);
            return resBody;
        });
    }
    static deletePatient(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, }) {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            const user = yield prisma_service_1.default.user.findUnique({
                where: { id: userId },
            });
            if (user && app_config_1.default.deleteProfileRequireVerification) {
                yield this.sendConfirmDeletionToken(user);
            }
            else {
                const patient = yield prisma_service_1.default.patient.delete({
                    where: { id },
                });
                yield prisma_service_1.default.user.delete({
                    where: { id: patient.userId },
                });
            }
            resBody.data = { status: true };
            return resBody;
        });
    }
    static confirmDeletePatient(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const resBody = this.getResBody();
            const token = yield prisma_service_1.default.confirmDeletionToken.findUnique({
                where: {
                    token: payload.token,
                    user: {
                        userType: 'PATIENT',
                        patient: {
                            NOT: undefined,
                        },
                    },
                    expiresAt: {
                        gte: new Date(),
                    },
                },
                include: {
                    user: {
                        include: {
                            patient: true,
                        },
                    },
                },
            });
            if (!token) {
                return responseHandler_1.ResponseHandler.Forbidden('Invalid or expired token');
            }
            yield prisma_service_1.default.confirmDeletionToken.delete({
                where: {
                    id: token.id,
                },
            });
            yield prisma_service_1.default.patient.delete({
                where: {
                    id: (_a = token.user.patient) === null || _a === void 0 ? void 0 : _a.id,
                },
            });
            yield prisma_service_1.default.user.delete({
                where: {
                    id: token.userId,
                },
            });
            resBody.data = {
                status: true,
            };
            return resBody;
        });
    }
    static addDoctor(_a) {
        return __awaiter(this, arguments, void 0, function* ({ doctorId, }) {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            const patient = yield prisma_service_1.default.patient.update({
                where: { userId },
                data: {
                    doctors: {
                        connect: {
                            id: doctorId,
                        },
                    },
                },
                include: {
                    user: true,
                    doctors: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            resBody.data = (0, parsers_1.parsePrivatePatient)(patient);
            return resBody;
        });
    }
    static removeDoctor(_a) {
        return __awaiter(this, arguments, void 0, function* ({ doctorId, }) {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            const patient = yield prisma_service_1.default.patient.update({
                where: { userId },
                data: {
                    doctors: {
                        disconnect: {
                            id: doctorId,
                        },
                    },
                },
                include: {
                    user: true,
                    doctors: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            resBody.data = (0, parsers_1.parsePrivatePatient)(patient);
            return resBody;
        });
    }
}
exports.PatientRepository = PatientRepository;
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientRepository, "getPatient", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientRepository, "getPatients", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientRepository, "createPatient", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientRepository, "updatePatient", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientRepository, "deletePatient", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientRepository, "confirmDeletePatient", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientRepository, "addDoctor", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientRepository, "removeDoctor", null);
