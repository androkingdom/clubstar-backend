"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "owner";
    UserRole["ADMIN"] = "admin";
    UserRole["MODERATOR"] = "moderator";
    UserRole["Member"] = "member";
})(UserRole || (UserRole = {}));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensure usernames are unique
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensure email addresses are unique
    },
    password: {
        type: String,
        required: true,
        select: false, // Exclude password from queries by default
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.Member,
    },
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true,
});
// Password hashing
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt_1.default.hash(this.password, 10);
    }
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const result = await bcrypt_1.default.compare(candidatePassword, this.password);
        console.log("Password comparison result:", result);
        return result;
    }
    catch (error) {
        console.error("Error comparing passwords:", error);
        throw new Error("Password comparison failed");
    }
};
exports.User = (0, mongoose_1.model)("User", userSchema);
