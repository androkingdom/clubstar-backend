"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const constants_1 = require("../constants");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const SendError_1 = __importDefault(require("../utils/SendError"));
const user_model_1 = require("../models/user.model");
const getTokens_1 = require("../utils/getTokens");
exports.isAuthenticated = (0, asyncHandler_1.default)(async (req, res, next) => {
    const rawToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!rawToken) {
        throw SendError_1.default.unauthorized();
    }
    const decoded = (0, getTokens_1.verifyToken)(rawToken, constants_1.TOKEN_TYPE.ACCESS);
    console.log("Access token decoded:", decoded);
    const userExists = await user_model_1.User.findById(decoded?.userId);
    if (!userExists) {
        throw SendError_1.default.notFound("User not found");
    }
    req.user = decoded;
    next();
});
