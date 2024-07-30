"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAPIVersion = parseAPIVersion;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Configs
const appConfig = {
    apiURI: '/api/$v',
    requireVerifyEmail: true,
    updatePasswordRequireVerification: true,
    deleteProfileRequireVerification: true,
    apiVersion: '1.0.0',
    apiName: 'DocTime API',
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
        refreshSecretKey: process.env.REFRESH_SECRET_KEY,
        expiresIn: '15d',
    },
    logRootPath: '.logs',
};
exports.default = appConfig;
function parseAPIVersion(version) {
    return appConfig.apiURI.replace('$v', `v${version}`);
}
