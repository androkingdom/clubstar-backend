"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./constants");
const errorHandler_middleware_1 = __importDefault(require("./middlewares/errorHandler.middleware"));
const env_1 = __importDefault(require("./config/env"));
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.default.CORS_ORIGIN,
    credentials: true,
}));
app.get(`${constants_1.API_URI}/health`, (req, res) => {
    try {
        res.status(200).json({ message: "OK" });
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
        throw new Error(error);
    }
});
// Import routers
const auth_route_1 = require("./routes/auth.route");
const club_route_1 = require("./routes/club.route");
// Mount routers
app.use(`${constants_1.API_URI}/auth`, auth_route_1.router);
app.use(`${constants_1.API_URI}/club`, club_route_1.router);
app.use(errorHandler_middleware_1.default);
exports.default = app;
