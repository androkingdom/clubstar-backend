"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteClubSchema = exports.CreateClubSchema = void 0;
const zod_1 = require("zod");
exports.CreateClubSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Name is required"),
    slug: zod_1.z.string().trim().min(1, "Slug is required"),
    description: zod_1.z.string().trim().min(1, "Description is required"),
});
exports.DeleteClubSchema = zod_1.z.object({
    slug: zod_1.z.string().trim().min(1, "Club ID is required"),
});
