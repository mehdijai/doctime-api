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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const responseHandler_1 = require("@/utils/responseHandler");
const app_config_1 = __importDefault(require("@/config/app.config"));
const auth_facade_1 = require("@/facades/auth.facade");
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, app_config_1.default.jwt.secret, (err, user) => {
            if (err || !user) {
                if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                    const resBody = responseHandler_1.ResponseHandler.Unauthorized('Unauthenticated');
                    res.status(resBody.error.code).json(resBody);
                }
                else {
                    const resBody = responseHandler_1.ResponseHandler.Forbidden('Access forbidden: Invalid token');
                    res.status(resBody.error.code).json(resBody);
                }
                return;
            }
            auth_facade_1.AuthFacade.set(user.userId, user.timestamp);
            next();
        });
    }
    else {
        const resBody = responseHandler_1.ResponseHandler.Unauthorized('Access denied: No token provided');
        res.status(resBody.error.code).json(resBody);
    }
}
