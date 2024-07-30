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
exports.apiMethod = apiMethod;
const HTTPStatusCodes_1 = __importDefault(require("@/utils/HTTPStatusCodes"));
const responseHandler_1 = require("@/utils/responseHandler");
const winston_1 = require("@/utils/winston");
const library_1 = require("@prisma/client/runtime/library");
function apiMethod() {
    return function (_, __, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const resBody = new responseHandler_1.ApiResponseBody();
                try {
                    const getResBody = () => resBody;
                    this.getResBody = getResBody;
                    return yield originalMethod.apply(this, args);
                }
                catch (err) {
                    winston_1.logger.error(err);
                    if (err instanceof library_1.PrismaClientKnownRequestError) {
                        if (err.code === 'P2002' &&
                            ((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target) &&
                            Array.isArray(err.meta.target) &&
                            err.meta.target.includes('email')) {
                            resBody.error = {
                                code: HTTPStatusCodes_1.default.CONFLICT,
                                message: 'Email already exists',
                            };
                        }
                        else {
                            resBody.error = {
                                code: HTTPStatusCodes_1.default.INTERNAL_SERVER_ERROR,
                                message: String(err),
                            };
                        }
                    }
                    else {
                        resBody.error = {
                            code: HTTPStatusCodes_1.default.INTERNAL_SERVER_ERROR,
                            message: String(err),
                        };
                    }
                }
                finally {
                    delete this.getResBody;
                }
                return resBody;
            });
        };
        return descriptor;
    };
}
