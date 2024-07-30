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
const patient_repo_1 = require("@/repositories/patient.repo");
const patient_schema_1 = require("@/schemas/patient/patient.schema");
const HTTPStatusCodes_1 = __importDefault(require("@/utils/HTTPStatusCodes"));
const express_1 = require("express");
const PatientsRoutes = (0, express_1.Router)();
PatientsRoutes.post('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(patient_schema_1.PatientZODSchema.createPatientSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield patient_repo_1.PatientRepository.createPatient(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
PatientsRoutes.get('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(patient_schema_1.PatientZODSchema.searchPatientSchema, true), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.query;
        const resBody = yield patient_repo_1.PatientRepository.getPatients(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
PatientsRoutes.get('/me', jwt_middleware_1.authenticateJWT, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resBody = yield patient_repo_1.PatientRepository.getPatient();
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
PatientsRoutes.get('/:patientId', jwt_middleware_1.authenticateJWT, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientId = req.params.patientId;
        const resBody = yield patient_repo_1.PatientRepository.getPatient(patientId);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
PatientsRoutes.put('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(patient_schema_1.PatientZODSchema.updatePatientSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield patient_repo_1.PatientRepository.updatePatient(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
PatientsRoutes.delete('/', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(patient_schema_1.PatientZODSchema.deletePatientSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield patient_repo_1.PatientRepository.deletePatient(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
PatientsRoutes.post('/confirm-delete', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(patient_schema_1.PatientZODSchema.validateDeleteSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield patient_repo_1.PatientRepository.confirmDeletePatient(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
PatientsRoutes.post('/add-doctor', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(patient_schema_1.PatientZODSchema.addDoctorSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield patient_repo_1.PatientRepository.addDoctor(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
PatientsRoutes.post('/remove-doctor', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(patient_schema_1.PatientZODSchema.addDoctorSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield patient_repo_1.PatientRepository.removeDoctor(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = PatientsRoutes;
