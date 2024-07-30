"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const responseHandler_1 = require("@/utils/responseHandler");
function parseZodErrors(errors) {
    return errors.errors.map((err) => `${err.path.join(', ')}: ${err.message}`);
}
function validate(schema, query = false) {
    return (req, res, next) => {
        try {
            if (query) {
                schema.parse(req.query);
            }
            else {
                schema.parse(req.body);
            }
            next();
        }
        catch (error) {
            const resBody = responseHandler_1.ResponseHandler.InvalidBody({
                message: 'Validation Error',
                errors: parseZodErrors(error),
            });
            res.status(resBody.error.code).json(resBody);
        }
    };
}
