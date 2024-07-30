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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRepository = void 0;
const responseHandler_1 = require("@/utils/responseHandler");
const prisma_service_1 = __importDefault(require("@/services/prisma.service"));
const api_decorator_1 = require("@/decorators/api.decorator");
const parsers_1 = require("@/utils/parsers");
const geo_1 = require("@/utils/geo");
const auth_decorator_1 = require("@/decorators/auth.decorator");
const app_config_1 = __importDefault(require("@/config/app.config"));
class DoctorRepository extends auth_decorator_1.AuthClass {
    static getDoctor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const doctor = yield prisma_service_1.default.doctor.findUnique({
                where: { id },
                include: {
                    user: true,
                },
            });
            if (!doctor)
                return responseHandler_1.ResponseHandler.NotFound('Doctor not found');
            resBody.data = (0, parsers_1.parseDoctor)(doctor);
            return resBody;
        });
    }
    static getDoctors(searchPayload) {
        return __awaiter(this, void 0, void 0, function* () {
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
            if (searchPayload.status) {
                wherePrisma['status'] = searchPayload.status;
            }
            if (searchPayload.address) {
                wherePrisma['address'] = {
                    contains: searchPayload.address,
                };
            }
            if (searchPayload.specialty) {
                wherePrisma['specialty'] = searchPayload.specialty;
            }
            const doctors = yield prisma_service_1.default.doctor.findMany({
                where: wherePrisma,
                include: {
                    user: true,
                },
            });
            resBody.data = doctors
                .filter((doctor) => {
                if (!searchPayload.nearMe || !searchPayload.nearMe.lat || !searchPayload.nearMe.lng)
                    return true;
                if (!doctor.mapPosition)
                    return false;
                return (0, geo_1.isNearCoordinates)((0, parsers_1.parseCoords)(searchPayload.nearMe), JSON.parse(doctor.mapPosition), 5);
            })
                .map((doctor) => (0, parsers_1.parseDoctor)(doctor));
            return resBody;
        });
    }
    static createDoctor(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            if (!(yield this.isValidUser(userId, 'DOCTOR'))) {
                return responseHandler_1.ResponseHandler.Forbidden('This user is not allowed to perform this action');
            }
            const doctor = yield prisma_service_1.default.doctor.create({
                data: {
                    address: payload.address,
                    status: 'AVAILABLE',
                    mapPosition: payload.mapPosition ? JSON.stringify(payload.mapPosition) : undefined,
                    specialty: payload.specialty,
                    biography: payload.biography,
                    pictureUrl: payload.pictureUrl,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                include: {
                    user: true,
                },
            });
            resBody.data = (0, parsers_1.parseDoctor)(doctor);
            return resBody;
        });
    }
    static updateDoctor(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const doctor = yield prisma_service_1.default.doctor.update({
                where: {
                    id: payload.id,
                },
                data: {
                    address: payload.address,
                    status: payload.status,
                    mapPosition: payload.mapPosition ? JSON.stringify(payload.mapPosition) : undefined,
                    specialty: payload.specialty,
                    biography: payload.biography,
                    pictureUrl: payload.pictureUrl,
                },
                include: {
                    user: true,
                },
            });
            resBody.data = (0, parsers_1.parseDoctor)(doctor);
            return resBody;
        });
    }
    static deleteDoctor(_a) {
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
                const doctor = yield prisma_service_1.default.doctor.delete({
                    where: { id },
                });
                yield prisma_service_1.default.user.delete({
                    where: { id: doctor.userId },
                });
            }
            resBody.data = { status: true };
            return resBody;
        });
    }
    static confirmDeleteDoctor(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const resBody = this.getResBody();
            const token = yield prisma_service_1.default.confirmDeletionToken.findUnique({
                where: {
                    token: payload.token,
                    user: {
                        userType: 'DOCTOR',
                        doctor: {
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
                            doctor: true,
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
            yield prisma_service_1.default.doctor.delete({
                where: {
                    id: (_a = token.user.doctor) === null || _a === void 0 ? void 0 : _a.id,
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
}
exports.DoctorRepository = DoctorRepository;
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorRepository, "getDoctor", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorRepository, "getDoctors", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorRepository, "createDoctor", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorRepository, "updateDoctor", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorRepository, "deleteDoctor", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorRepository, "confirmDeleteDoctor", null);
