"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.getTokens = exports.getRefreshTokens = exports.getAccessTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const constants_1 = require("../constants");
const getAccessTokens = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.default.JWT_ACCESS_SECRET, {
        expiresIn: env_1.default.JWT_ACCESS_EXPIRATION,
    });
};
exports.getAccessTokens = getAccessTokens;
const getRefreshTokens = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.default.JWT_REFRESH_SECRET, {
        expiresIn: env_1.default.JWT_REFRESH_EXPIRATION,
    });
};
exports.getRefreshTokens = getRefreshTokens;
const getTokens = (payload) => {
    const accessToken = (0, exports.getAccessTokens)(payload);
    const refreshToken = (0, exports.getRefreshTokens)(payload);
    return { accessToken, refreshToken };
};
exports.getTokens = getTokens;
const verifyToken = (token, tokenType) => {
    let JWT_SECRET;
    switch (tokenType) {
        case constants_1.TOKEN_TYPE.ACCESS:
            JWT_SECRET = env_1.default.JWT_ACCESS_SECRET;
            break;
        case constants_1.TOKEN_TYPE.REFRESH:
            JWT_SECRET = env_1.default.JWT_REFRESH_SECRET;
            break;
        default:
            throw new Error("Invalid Token Type!");
    }
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        console.log("Error in token verification", error);
    }
};
exports.verifyToken = verifyToken;
