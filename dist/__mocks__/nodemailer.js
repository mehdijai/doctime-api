"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// pass it in when creating the mock using getMockFor()
const nodemailermock = require('nodemailer-mock').getMockFor(nodemailer_1.default);
// export the mocked module
module.exports = nodemailermock;
