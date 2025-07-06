"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_TYPE = exports.API_URI = exports.DB_NAME = void 0;
const DB_NAME = "clubstar";
exports.DB_NAME = DB_NAME;
const API_URI = "/api/v1";
exports.API_URI = API_URI;
var TOKEN_TYPE;
(function (TOKEN_TYPE) {
    TOKEN_TYPE["ACCESS"] = "access";
    TOKEN_TYPE["REFRESH"] = "refresh";
})(TOKEN_TYPE || (exports.TOKEN_TYPE = TOKEN_TYPE = {}));
