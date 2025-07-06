"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthSchema = exports.UserRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.UserRegistrationSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(1, "Username is required"),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
        .min(1, "Email is required"),
    password: zod_1.z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters long"),
});
exports.UserAuthSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
        .min(1, "Email is required"),
    password: zod_1.z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters long"),
});
