"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendRes {
    constructor({ statusCode = 200, message = "Success", data = null, }) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode >= 200 && statusCode < 300;
    }
    // 🌟 .ok()
    static ok(data, message = "Success") {
        return new SendRes({ statusCode: 200, message, data });
    }
    // 🌟 .created()
    static created(data, message = "Created successfully") {
        return new SendRes({ statusCode: 201, message, data });
    }
    // 🌟 .custom()
    static custom(statusCode, message, data) {
        return new SendRes({ statusCode, message, data });
    }
}
exports.default = SendRes;
