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
exports.AuthClass = void 0;
exports.Auth = Auth;
const auth_facade_1 = require("@/facades/auth.facade");
const mail_service_1 = require("@/services/mail.service");
const prisma_service_1 = __importDefault(require("@/services/prisma.service"));
const helpers_1 = require("@/utils/helpers");
const winston_1 = require("@/utils/winston");
const uuid_1 = require("uuid");
class AuthClass {
    static isValidUser(userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_service_1.default.user.findUnique({
                where: { id: userId },
                include: {
                    patient: true,
                    doctor: true,
                },
            });
            if ((user === null || user === void 0 ? void 0 : user.patient) || (user === null || user === void 0 ? void 0 : user.doctor)) {
                return false;
            }
            return (user === null || user === void 0 ? void 0 : user.userType) === type;
        });
    }
    static sendConfirmDeletionToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, uuid_1.v4)();
                yield prisma_service_1.default.confirmDeletionToken.create({
                    data: {
                        token,
                        userId: user.id,
                        expiresAt: (0, helpers_1.addTime)(1, 'h'),
                    },
                });
                const bodyHTML = `<h1>Confirm deleting profile</h1>
        <p>Confirm deleting your profile. The link expires after <strong>1 hour</strong>.</p>
        <a id="token-link" href="${process.env.DELETE_PROFILE_UI_URL}/${token}">Confirm delete profile</a><br>
        or copy this link: <br>
        <span>${process.env.DELETE_PROFILE_UI_URL}/${token}</span>`;
                (0, mail_service_1.sendEmail)({
                    receivers: [user.email],
                    subject: 'Confirm deleting profile',
                    html: bodyHTML,
                });
            }
            catch (err) {
                winston_1.logger.error({ message: 'Send Email Verification Error:', error: err });
            }
        });
    }
}
exports.AuthClass = AuthClass;
function Auth(_, __, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const user = auth_facade_1.AuthFacade.get();
        if (!user) {
            throw new Error('User not found');
        }
        this.USER = user;
        return originalMethod.apply(this, args);
    };
    return descriptor;
}
