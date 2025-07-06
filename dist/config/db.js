"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("../config/env"));
const constants_1 = require("../constants");
const connectDB = async () => {
    try {
        const con = await mongoose_1.default.connect(`${env_1.default.DB_URL}/${constants_1.DB_NAME}`);
        console.log("MongoDB connected successfully:", con.connection.host);
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
