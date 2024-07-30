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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromMail = getTokenFromMail;
exports.testEmails = testEmails;
const cheerio_1 = require("cheerio");
const nodemailer = __importStar(require("nodemailer"));
const { mock } = nodemailer;
function getTokenFromMail(html) {
    var _a;
    const $ = (0, cheerio_1.load)(html);
    const link = $('#token-link').attr('href');
    const parts = (_a = link === null || link === void 0 ? void 0 : link.split('/')) !== null && _a !== void 0 ? _a : [];
    return parts[parts.length - 1];
}
function testEmails(subject) {
    var _a, _b;
    const sentEmails = mock.getSentMail();
    const email = sentEmails.find((email) => email.subject === subject);
    expect(email).toBeDefined();
    const token = getTokenFromMail((_b = (_a = email === null || email === void 0 ? void 0 : email.html) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '');
    expect(token).toBeDefined();
    return token;
}
