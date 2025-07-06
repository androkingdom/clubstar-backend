"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendError extends Error {
    constructor({ message = "Something went wrong", statusCode = 500, errors = [], stack, } = {}) {
        super(message);
        this.name = "SendError";
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack || new Error().stack;
        // Optional if you want more consistent trace:
        Error.captureStackTrace?.(this, this.constructor);
    }
    static badRequest(message = "Bad Request", errors = []) {
        return new SendError({ message, statusCode: 400, errors });
    }
    static unauthorized(message = "Unauthorized", errors = []) {
        return new SendError({ message, statusCode: 401, errors });
    }
    static notFound(message = "Not Found", errors = []) {
        return new SendError({ message, statusCode: 404, errors });
    }
    static internal(message = "Internal Server Error", errors = []) {
        return new SendError({ message, statusCode: 500, errors });
    }
    static forbidden(message = "Access Denied", errors = []) {
        return new SendError({ message, statusCode: 403, errors });
    }
    static custom(opts) {
        return new SendError(opts);
    }
}
exports.default = SendError;
