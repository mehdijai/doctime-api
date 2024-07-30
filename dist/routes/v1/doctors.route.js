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
const doctor_repo_1 = require("@/repositories/doctor.repo");
const doctor_schema_1 = require("@/schemas/doctor/doctor.schema");
const HTTPStatusCodes_1 = __importDefault(require("@/utils/HTTPStatusCodes"));
const express_1 = require("express");
const DoctorsRoutes = (0, express_1.Router)();
DoctorsRoutes.post('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(doctor_schema_1.DoctorZODSchema.createDoctorSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield doctor_repo_1.DoctorRepository.createDoctor(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
DoctorsRoutes.get('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(doctor_schema_1.DoctorZODSchema.searchDoctorSchema, true), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.query;
        const resBody = yield doctor_repo_1.DoctorRepository.getDoctors(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
DoctorsRoutes.get('/:docId', jwt_middleware_1.authenticateJWT, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.docId;
        const resBody = yield doctor_repo_1.DoctorRepository.getDoctor(id);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
DoctorsRoutes.put('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(doctor_schema_1.DoctorZODSchema.updateDoctorSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield doctor_repo_1.DoctorRepository.updateDoctor(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
DoctorsRoutes.delete('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(doctor_schema_1.DoctorZODSchema.deleteDoctorSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield doctor_repo_1.DoctorRepository.deleteDoctor(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
DoctorsRoutes.post('/confirm-delete', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(doctor_schema_1.DoctorZODSchema.validateDeleteSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield doctor_repo_1.DoctorRepository.confirmDeleteDoctor(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = DoctorsRoutes;
