"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imagekit_1 = __importDefault(require("imagekit"));
const env_1 = __importDefault(require("../config/env"));
const imagekit = new imagekit_1.default({
    publicKey: env_1.default.IMAGEKIT_PUBLIC_KEY,
    privateKey: env_1.default.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/andro",
});
exports.default = imagekit;
