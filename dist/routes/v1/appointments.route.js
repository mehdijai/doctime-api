"use strict";
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
const jwt_middleware_1 = require("@/middlewares/jwt.middleware");
const validateRequest_middleware_1 = require("@/middlewares/validateRequest.middleware");
const appointment_repo_1 = require("@/repositories/appointment.repo");
const appointment_schema_1 = require("@/schemas/appointment/appointment.schema");
const HTTPStatusCodes_1 = __importDefault(require("@/utils/HTTPStatusCodes"));
const express_1 = require("express");
const AppointmentsRoutes = (0, express_1.Router)();
AppointmentsRoutes.post('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(appointment_schema_1.AppointmentZODSchema.createAppointmentSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield appointment_repo_1.AppointmentRepository.createAppointment(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AppointmentsRoutes.get('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(appointment_schema_1.AppointmentZODSchema.searchAppointmentSchema, true), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.query;
        const resBody = yield appointment_repo_1.AppointmentRepository.getAppointments(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AppointmentsRoutes.get('/:id', jwt_middleware_1.authenticateJWT, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const resBody = yield appointment_repo_1.AppointmentRepository.getAppointment(id);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AppointmentsRoutes.put('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(appointment_schema_1.AppointmentZODSchema.updateAppointmentSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield appointment_repo_1.AppointmentRepository.updateAppointment(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AppointmentsRoutes.delete('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(appointment_schema_1.AppointmentZODSchema.deleteAppointmentSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield appointment_repo_1.AppointmentRepository.deleteAppointment(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = AppointmentsRoutes;
