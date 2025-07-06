"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenvx_1 = __importDefault(require("@dotenvx/dotenvx"));
dotenvx_1.default.config();
const envConfig = {
    PORT: process.env.PORT || "3001",
    DB_URL: process.env.DB_URL || "mongodb://localhost:27017",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access_secret",
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || "1h",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "30d",
    NODE_ENV: process.env.NODE_ENV || "development",
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || "public_key",
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "private_key",
    CORS_ORIGIN: process.env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN
        : "http://localhost:5000",
};
exports.default = envConfig;
