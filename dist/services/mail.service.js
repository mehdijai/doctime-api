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
exports.sendEmail = sendEmail;
const mail_config_1 = __importDefault(require("@/config/mail.config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: mail_config_1.default.mailHost,
    port: mail_config_1.default.mailPort,
    // secure: true,
    auth: {
        user: mail_config_1.default.mailUser,
        pass: mail_config_1.default.mailPass,
    },
});
function sendEmail(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield transporter.sendMail({
            from: `"${mail_config_1.default.mailFromName}" <${mail_config_1.default.mailFromEmail}>`,
            to: payload.receivers.join(', '),
            subject: payload.subject,
            html: payload.html,
        });
        return info;
    });
}
