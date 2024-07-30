"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const patients_route_1 = __importDefault(require("./patients.route"));
const doctors_route_1 = __importDefault(require("./doctors.route"));
const appointments_route_1 = __importDefault(require("./appointments.route"));
const app_config_1 = __importDefault(require("@/config/app.config"));
const jwt_middleware_1 = require("@/middlewares/jwt.middleware");
const HTTPStatusCodes_1 = __importDefault(require("@/utils/HTTPStatusCodes"));
const routes = (0, express_1.Router)();
routes.get('/', (_, res, next) => {
    res.status(HTTPStatusCodes_1.default.OK).json({
        name: app_config_1.default.apiName,
        version: app_config_1.default.apiVersion,
        dateTime: new Date().toISOString(),
        status: 'RUNNING',
    });
    next();
});
routes.get('/protected', jwt_middleware_1.authenticateJWT, (_, res, next) => {
    res.status(HTTPStatusCodes_1.default.OK).json({
        name: app_config_1.default.apiName,
        version: app_config_1.default.apiVersion,
        dateTime: new Date().toISOString(),
        status: 'RUNNING',
        protected: true,
    });
    next();
});
routes.use('/auth', auth_route_1.default);
routes.use('/patients', patients_route_1.default);
routes.use('/doctors', doctors_route_1.default);
routes.use('/appointments', appointments_route_1.default);
exports.default = routes;
