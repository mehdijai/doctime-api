"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = exports.ApiResponseBody = void 0;
const HTTPStatusCodes_1 = __importDefault(require("./HTTPStatusCodes"));
class ApiResponseBody {
}
exports.ApiResponseBody = ApiResponseBody;
class ResponseHandler {
    static response(message, status) {
        const response = new ApiResponseBody();
        response.error = {
            code: status,
            message: message,
        };
        return response;
    }
    static NoDataResponse(message = 'Operation successful') {
        return this.response(message, HTTPStatusCodes_1.default.OK);
    }
    static NotFound(message = 'Not found') {
        return this.response(message, HTTPStatusCodes_1.default.NOT_FOUND);
    }
    static InvalidBody(message = 'Invalid request body') {
        return this.response(message, HTTPStatusCodes_1.default.UNPROCESSABLE_ENTITY);
    }
    static Unauthorized(message = 'Unauthorized') {
        return this.response(message, HTTPStatusCodes_1.default.UNAUTHORIZED);
    }
    static Forbidden(message = 'Forbidden') {
        return this.response(message, HTTPStatusCodes_1.default.FORBIDDEN);
    }
    static BadRequest(message = 'Bad Request') {
        return this.response(message, HTTPStatusCodes_1.default.BAD_REQUEST);
    }
}
exports.ResponseHandler = ResponseHandler;
