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
exports.AuthRepository = void 0;
const mail_service_1 = require("@/services/mail.service");
const HTTPStatusCodes_1 = __importDefault(require("@/utils/HTTPStatusCodes"));
const jwtHandler_1 = require("@/utils/jwtHandler");
const responseHandler_1 = require("@/utils/responseHandler");
const winston_1 = require("@/utils/winston");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const prisma_service_1 = __importDefault(require("@/services/prisma.service"));
const app_config_1 = __importDefault(require("@/config/app.config"));
const helpers_1 = require("@/utils/helpers");
const api_decorator_1 = require("@/decorators/api.decorator");
const auth_decorator_1 = require("@/decorators/auth.decorator");
class AuthRepository extends auth_decorator_1.AuthClass {
    static loginUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const user = yield prisma_service_1.default.user.findUnique({
                where: {
                    email: payload.email,
                },
            });
            if (!user) {
                return responseHandler_1.ResponseHandler.Unauthorized('Credentials Error');
            }
            const isValidPassword = yield bcryptjs_1.default.compare(payload.password, user.password);
            if (isValidPassword) {
                const token = (0, jwtHandler_1.generateAccessToken)(user.id);
                const refreshToken = (0, jwtHandler_1.generateRefreshToken)();
                yield prisma_service_1.default.refreshToken.create({
                    data: {
                        token: refreshToken,
                        userId: user.id,
                        expiresAt: (0, helpers_1.addTime)(30, 'd'),
                    },
                });
                const accessToken = {
                    token: token,
                    refreshToken: refreshToken,
                };
                const responseData = {
                    accessToken: accessToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        phone: user.phone,
                        name: user.name,
                        verifiedEmail: user.verifiedEmail,
                        userType: user.userType,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    },
                };
                resBody.data = responseData;
                return resBody;
            }
            else {
                return responseHandler_1.ResponseHandler.Unauthorized('Password not match');
            }
        });
    }
    static refreshToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ refreshToken, }) {
            const resBody = this.getResBody();
            const storedToken = yield prisma_service_1.default.refreshToken.findUnique({
                where: { token: refreshToken },
            });
            if (!storedToken || new Date() > storedToken.expiresAt) {
                return responseHandler_1.ResponseHandler.Unauthorized('Invalid or expired refresh token');
            }
            const newAccessToken = (0, jwtHandler_1.generateAccessToken)(storedToken.userId);
            const newRefreshToken = (0, jwtHandler_1.generateRefreshToken)();
            yield prisma_service_1.default.refreshToken.update({
                where: { token: refreshToken },
                data: {
                    token: newRefreshToken,
                    expiresAt: (0, helpers_1.addTime)(30, 'd'),
                },
            });
            resBody.data = { accessToken: newAccessToken, refreshToken: newRefreshToken };
            return resBody;
        });
    }
    static createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const user = yield prisma_service_1.default.user.create({
                data: {
                    email: payload.email,
                    phone: payload.phone,
                    name: payload.name,
                    password: bcryptjs_1.default.hashSync(payload.password, 10),
                    userType: payload.type,
                },
            });
            resBody.data = {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                verifiedEmail: user.verifiedEmail,
                userType: user.userType,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            if (app_config_1.default.requireVerifyEmail) {
                yield this.sendEmailVerification(user);
            }
            return resBody;
        });
    }
    static forgotPassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const user = yield prisma_service_1.default.user.findUnique({
                where: {
                    email: payload.email,
                    userType: payload.type,
                },
            });
            if (!user) {
                return responseHandler_1.ResponseHandler.NotFound('User not found');
            }
            const token = (0, uuid_1.v4)();
            yield prisma_service_1.default.resetPasswordToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt: (0, helpers_1.addTime)(30, 'm'),
                },
            });
            const bodyHTML = `<h1>Reset Password</h1>
      <p>Click here to reset your password:</p>
      <a id="token-link" href="${process.env.RESET_PASSWORD_UI_URL}/${token}">Reset Password</a><br>
        or copy this link: <br>
        <span>${process.env.RESET_PASSWORD_UI_URL}/${token}</span>`;
            if (user) {
                (0, mail_service_1.sendEmail)({
                    receivers: [user.email],
                    subject: 'Reset Password',
                    html: bodyHTML,
                });
            }
            resBody.data = {
                status: true,
            };
            return resBody;
        });
    }
    static resetPassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const token = yield prisma_service_1.default.resetPasswordToken.findUnique({
                where: {
                    token: payload.token,
                    expiresAt: {
                        gte: new Date(),
                    },
                },
                include: {
                    user: true,
                },
            });
            if (!token) {
                return responseHandler_1.ResponseHandler.Forbidden('Invalid or expired token');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, 10);
            yield prisma_service_1.default.user.update({
                where: {
                    id: token.userId,
                },
                data: {
                    password: hashedPassword,
                },
            });
            yield prisma_service_1.default.resetPasswordToken.delete({
                where: {
                    token: payload.token,
                },
            });
            resBody.data = {
                status: true,
            };
            return resBody;
        });
    }
    static updatePassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.USER.userId;
            const resBody = this.getResBody();
            const user = yield prisma_service_1.default.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                resBody.error = {
                    code: HTTPStatusCodes_1.default.NOT_FOUND,
                    message: 'User not found',
                };
                return resBody;
            }
            const isValidPassword = yield bcryptjs_1.default.compare(payload.oldPassword, user.password);
            if (!isValidPassword) {
                return responseHandler_1.ResponseHandler.Unauthorized('Invalid old password');
            }
            if (app_config_1.default.updatePasswordRequireVerification) {
                yield this.sendConfirmPasswordUpdate(user, payload.newPassword);
            }
            else {
                const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, 10);
                yield prisma_service_1.default.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        password: hashedPassword,
                    },
                });
            }
            resBody.data = {
                status: true,
            };
            return resBody;
        });
    }
    static confirmUpdatePassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const token = yield prisma_service_1.default.updatePasswordToken.findUnique({
                where: {
                    token: payload.token,
                },
            });
            if (!token) {
                return responseHandler_1.ResponseHandler.Forbidden('Invalid or expired token');
            }
            yield prisma_service_1.default.user.update({
                where: {
                    id: token.userId,
                },
                data: {
                    password: token.newPassword,
                },
            });
            yield prisma_service_1.default.updatePasswordToken.delete({
                where: {
                    token: payload.token,
                },
            });
            resBody.data = {
                status: true,
            };
            return resBody;
        });
    }
    static verifyUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBody = this.getResBody();
            const token = yield prisma_service_1.default.verifyEmailToken.findUnique({
                where: {
                    token: payload.token,
                    expiresAt: {
                        gte: new Date(),
                    },
                },
                include: {
                    user: true,
                },
            });
            if (!token) {
                return responseHandler_1.ResponseHandler.Forbidden('Invalid or expired token');
            }
            yield prisma_service_1.default.user.update({
                where: {
                    id: token.userId,
                },
                data: {
                    verifiedEmail: true,
                },
            });
            yield prisma_service_1.default.verifyEmailToken.delete({
                where: {
                    token: payload.token,
                },
            });
            resBody.data = {
                status: true,
            };
            return resBody;
        });
    }
    static sendEmailVerification(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, uuid_1.v4)();
                yield prisma_service_1.default.verifyEmailToken.create({
                    data: {
                        token,
                        userId: user.id,
                        expiresAt: (0, helpers_1.addTime)(1, 'h'),
                    },
                });
                const bodyHTML = `<h1>Verify Your Email</h1>
        <p>Verify your email. The link expires after <strong>1 hour</strong>.</p>
        <a id="token-link" href="${process.env.VERIFY_EMAIL_UI_URL}/${token}">Confirm Email</a><br>
        or copy this link: <br>
        <span>${process.env.VERIFY_EMAIL_UI_URL}/${token}</span>`;
                (0, mail_service_1.sendEmail)({
                    receivers: [user.email],
                    subject: 'Verify Email',
                    html: bodyHTML,
                });
            }
            catch (err) {
                winston_1.logger.error({ message: 'Send Email Verification Error:', error: err });
            }
        });
    }
    static sendConfirmPasswordUpdate(user, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, uuid_1.v4)();
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                yield prisma_service_1.default.updatePasswordToken.create({
                    data: {
                        token,
                        newPassword: hashedPassword,
                        userId: user.id,
                        expiresAt: (0, helpers_1.addTime)(1, 'h'),
                    },
                });
                const bodyHTML = `<h1>Confirm password update</h1>
        <p>Confirm updating password. The link expires after <strong>1 hour</strong>.</p>
        <a id="token-link" href="${process.env.CONFIRM_UPDATE_PASSWORD_EMAIL_UI_URL}/${token}">Confirm password</a><br>
        or copy this link: <br>
        <span>${process.env.CONFIRM_UPDATE_PASSWORD_EMAIL_UI_URL}/${token}</span>`;
                (0, mail_service_1.sendEmail)({
                    receivers: [user.email],
                    subject: 'Update Password',
                    html: bodyHTML,
                });
            }
            catch (err) {
                winston_1.logger.error({ message: 'Send password update Email Error:', error: err });
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRepository, "loginUser", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRepository, "refreshToken", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRepository, "createUser", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRepository, "forgotPassword", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRepository, "resetPassword", null);
__decorate([
    auth_decorator_1.Auth,
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRepository, "updatePassword", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRepository, "confirmUpdatePassword", null);
__decorate([
    (0, api_decorator_1.apiMethod)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthRepository, "verifyUser", null);
