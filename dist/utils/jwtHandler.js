"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const app_config_1 = __importDefault(require("@/config/app.config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({
        userId,
        timestamp: Date.now(),
    }, app_config_1.default.jwt.secret, { expiresIn: app_config_1.default.jwt.expiresIn });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = () => {
    return (0, uuid_1.v4)();
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, app_config_1.default.jwt.secret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, app_config_1.default.jwt.refreshSecretKey);
};
exports.verifyRefreshToken = verifyRefreshToken;
