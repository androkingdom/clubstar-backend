"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./config/db"));
const constants_1 = require("./constants");
const env_1 = __importDefault(require("./config/env"));
const app_1 = __importDefault(require("./app"));
try {
    (0, db_1.default)().then(() => {
        app_1.default.listen(env_1.default.PORT, () => {
            console.log(`Server is running http://localhost:${env_1.default.PORT}${constants_1.API_URI}`);
        });
    });
}
catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
}
