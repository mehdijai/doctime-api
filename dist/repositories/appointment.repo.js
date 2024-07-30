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
exports.AppointmentRepository = void 0;
const responseHandler_1 = require("@/utils/responseHandler");
const api_decorator_1 = require("@/decorators/api.decorator");
const auth_decorator_1 = require("@/decorators/auth.decorator");
const prisma_service_1 = __importDefault(require("@/services/prisma.service"));
const parsers_1 = require("@/utils/parsers");
class AppointmentRepository extends auth_decorator_1.AuthClass {
    static getAppointment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            const appointment = yield prisma_service_1.default.appointment.findUnique({
                where: {
                    id,
                    OR: [
                        {
                            doctor: {
                                userId,
                            },
                        },
                        {
                            patient: {
                                userId,
                            },
                        },
                    ],
                },
                include: {
                    doctor: {
                        include: {
                            user: true,
                        },
                    },
                    patient: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            if (!appointment) {
                return responseHandler_1.ResponseHandler.NotFound('Appointment not found');
            }
            resBody.data = (0, parsers_1.parseAppointment)(appointment);
            return resBody;
        });
    }
    static getAppointments(searchPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            const wherePrisma = {};
            if (searchPayload.patientId) {
                wherePrisma['patientId'] = searchPayload.patientId;
            }
            if (searchPayload.doctorId) {
                wherePrisma['doctorId'] = searchPayload.doctorId;
            }
            if (searchPayload.status) {
                wherePrisma['status'] = searchPayload.status;
            }
            if (searchPayload.reason) {
                wherePrisma['reason'] = {
                    startWith: searchPayload.reason,
                };
            }
            if (searchPayload.note) {
                wherePrisma['note'] = {
                    startWith: searchPayload.note,
                };
            }
            if (searchPayload.cancellationReason) {
                wherePrisma['cancellationReason'] = {
                    startWith: searchPayload.cancellationReason,
                };
            }
            if (searchPayload.scheduleFrom) {
                if (!wherePrisma['schedule']) {
                    wherePrisma['schedule'] = {};
                }
                wherePrisma['schedule']['gte'] = searchPayload.scheduleFrom;
            }
            if (searchPayload.scheduleTo) {
                if (!wherePrisma['schedule']) {
                    wherePrisma['schedule'] = {};
                }
                wherePrisma['schedule']['lte'] = searchPayload.scheduleTo;
            }
            const appointments = yield prisma_service_1.default.appointment.findMany({
                where: Object.assign({ OR: [
                        {
                            doctor: {
                                userId,
                            },
                        },
                        {
                            patient: {
                                userId,
                            },
                        },
                    ] }, wherePrisma),
                include: {
                    doctor: {
                        include: {
                            user: true,
                        },
                    },
                    patient: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            resBody.data = appointments.map((appointment) => (0, parsers_1.parseAppointment)(appointment));
            return resBody;
        });
    }
    static createAppointment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const appointment = yield prisma_service_1.default.appointment.create({
                data: Object.assign(Object.assign({}, payload), { status: 'PENDING' }),
                include: {
                    doctor: {
                        include: {
                            user: true,
                        },
                    },
                    patient: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            resBody.data = (0, parsers_1.parseAppointment)(appointment);
            return resBody;
        });
    }
    static updateAppointment(_a) {
        return __awaiter(this, void 0, void 0, function* () {
            var { id } = _a, payload = __rest(_a, ["id"]);
            const resBody = this.getResBody();
            const appointment = yield prisma_service_1.default.appointment.update({
                where: {
                    id,
                },
                data: payload,
                include: {
                    doctor: {
                        include: {
                            user: true,
                        },
                    },
                    patient: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            resBody.data = (0, parsers_1.parseAppointment)(appointment);
            return resBody;
        });
    }
    static deleteAppointment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            yield prisma_service_1.default.appointment.delete({
                where: {
                    id: payload.id,
                },
            });
            resBody.data = {
                status: true,
            };
            return resBody;
        });
    }
}
exports.AppointmentRepository = AppointmentRepository;
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentRepository, "getAppointment", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentRepository, "getAppointments", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentRepository, "createAppointment", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentRepository, "updateAppointment", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentRepository, "deleteAppointment", null);
