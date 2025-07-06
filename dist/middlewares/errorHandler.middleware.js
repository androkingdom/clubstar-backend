"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const SendError_1 = __importDefault(require("../utils/SendError"));
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    if (err instanceof zod_1.ZodError) {
        const formatted = err.flatten();
        res.status(400).json({
            message: "Validation Failed",
            errors: formatted.fieldErrors,
            statusCode: 400,
            success: false,
        });
        return;
    }
    if (err instanceof SendError_1.default) {
        res.status(err.statusCode).json({
            message: err.message,
            statusCode: err.statusCode,
            success: false,
        });
        return;
    }
    res.status(500).json({
        message: "Internal Server Error",
        statusCode: 500,
        success: false,
    });
};
exports.default = errorHandler;
