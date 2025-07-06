"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookie = void 0;
const env_1 = __importDefault(require("../config/env"));
const constants_1 = require("../constants");
const MAX_AGE_MAP = {
    [constants_1.TOKEN_TYPE.ACCESS]: 60 * 60 * 1000, // 1h
    [constants_1.TOKEN_TYPE.REFRESH]: 7 * 24 * 60 * 60 * 1000, // 7d
};
const getMaxAge = (tokenType) => {
    const age = MAX_AGE_MAP[tokenType];
    if (!age)
        throw new Error(`Invalid token type: ${tokenType}`);
    return age;
};
const getCookie = (tokenType) => {
    const isProd = env_1.default.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: getMaxAge(tokenType),
    };
};
exports.getCookie = getCookie;
