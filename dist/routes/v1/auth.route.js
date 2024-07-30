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
const express_1 = require("express");
const validateRequest_middleware_1 = require("@/middlewares/validateRequest.middleware");
const auth_repo_1 = require("@/repositories/auth.repo");
const jwt_middleware_1 = require("@/middlewares/jwt.middleware");
const HTTPStatusCodes_1 = __importDefault(require("@/utils/HTTPStatusCodes"));
const auth_schema_1 = require("@/schemas/auth/auth.schema");
const AuthRoutes = (0, express_1.Router)();
AuthRoutes.post('/login', (0, validateRequest_middleware_1.validate)(auth_schema_1.AuthZODSchema.authSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield auth_repo_1.AuthRepository.loginUser(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AuthRoutes.post('/refresh-token', (0, validateRequest_middleware_1.validate)(auth_schema_1.AuthZODSchema.refreshTokenSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield auth_repo_1.AuthRepository.refreshToken(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AuthRoutes.post('/register', (0, validateRequest_middleware_1.validate)(auth_schema_1.AuthZODSchema.registerSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield auth_repo_1.AuthRepository.createUser(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AuthRoutes.post('/forget-password', (0, validateRequest_middleware_1.validate)(auth_schema_1.AuthZODSchema.forgetPasswordSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield auth_repo_1.AuthRepository.forgotPassword(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AuthRoutes.post('/reset-password', (0, validateRequest_middleware_1.validate)(auth_schema_1.AuthZODSchema.resetPasswordSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield auth_repo_1.AuthRepository.resetPassword(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AuthRoutes.post('/update-password', jwt_middleware_1.authenticateJWT, (0, validateRequest_middleware_1.validate)(auth_schema_1.AuthZODSchema.updatePasswordSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield auth_repo_1.AuthRepository.updatePassword(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AuthRoutes.post('/confirm-update-password', (0, validateRequest_middleware_1.validate)(auth_schema_1.AuthZODSchema.validateUserSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield auth_repo_1.AuthRepository.confirmUpdatePassword(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
AuthRoutes.post('/verify-user', (0, validateRequest_middleware_1.validate)(auth_schema_1.AuthZODSchema.validateUserSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const resBody = yield auth_repo_1.AuthRepository.verifyUser(body);
        res.status(resBody.error ? resBody.error.code : HTTPStatusCodes_1.default.OK).json(resBody);
        next();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = AuthRoutes;
