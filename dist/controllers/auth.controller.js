"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenRefresh = exports.logoutUser = exports.getCurrentUserProfile = exports.deleteUserAccount = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const user_1 = require("../validation/user");
const constants_1 = require("../constants");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const SendError_1 = __importDefault(require("../utils/SendError"));
const SendRes_1 = __importDefault(require("../utils/SendRes"));
const getTokens_1 = require("../utils/getTokens");
const getCookies_1 = require("../utils/getCookies");
// This function handles user registration
const registerUser = (0, asyncHandler_1.default)(async (req, res) => {
    // get user data from request body
    const parsed = user_1.UserRegistrationSchema.parse(req.body);
    const { username, email, password } = parsed;
    // Validate user data
    const userExists = await user_model_1.User.findOne({
        $or: [
            { email: email.toLowerCase().trim() },
            { username: username.toLowerCase().trim() },
        ],
    });
    // check if user already exists
    if (userExists) {
        throw SendError_1.default.badRequest("User already exists with this email or username.");
    }
    // if not, create a new user
    const newUser = await user_model_1.User.create({
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password,
    });
    if (!newUser) {
        throw SendError_1.default.internal("Failed to create user. Please try again later.");
    }
    // create tokens for the new user
    const tokens = (0, getTokens_1.getTokens)({
        userId: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
    });
    await user_model_1.User.findOneAndUpdate({
        _id: newUser._id,
    }, {
        $set: {
            refreshToken: tokens.refreshToken,
        },
    }, {
        new: true,
    }).select("-password");
    // if user created successfully, send response
    return res
        .status(201)
        .cookie("refreshToken", tokens.refreshToken, (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.REFRESH))
        .cookie("accessToken", tokens.accessToken, (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.ACCESS))
        .json(SendRes_1.default.created({
        user: {
            userId: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        },
        tokens,
    }, "User created successfully."));
});
exports.registerUser = registerUser;
// This function handles user login
const loginUser = (0, asyncHandler_1.default)(async (req, res) => {
    // get user data from request body
    const parsed = user_1.UserAuthSchema.parse(req.body);
    const { email, password } = parsed;
    // find user by email or username
    const userExists = await user_model_1.User.findOne({ email }).select("+password");
    if (!userExists) {
        throw SendError_1.default.notFound("User does not exist.");
    }
    // check if password is correct
    const isValidPassword = await userExists.comparePassword(password); // await is used here
    if (!isValidPassword) {
        throw SendError_1.default.forbidden("Invalid password.");
    }
    // provide tokens if user exists
    const tokens = (0, getTokens_1.getTokens)({
        userId: userExists._id.toString(),
        username: userExists.username,
        email: userExists.email,
        role: userExists.role,
    });
    await user_model_1.User.findOneAndUpdate({
        _id: userExists._id,
    }, {
        $set: {
            refreshToken: tokens.refreshToken,
        },
    }, {
        new: true,
    }).select("-password");
    return res
        .status(200)
        .cookie("refreshToken", tokens.refreshToken, (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.REFRESH))
        .cookie("accessToken", tokens.accessToken, (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.ACCESS))
        .json(SendRes_1.default.ok({
        user: {
            userId: userExists._id.toString(),
            username: userExists.username,
            email: userExists.email,
            role: userExists.role,
        },
        tokens,
    }, "User logged in successfully."));
});
exports.loginUser = loginUser;
const logoutUser = (0, asyncHandler_1.default)(async (req, res) => {
    // get userID from req.user => authentic user
    const { userId } = req.user;
    if (!userId) {
        throw SendError_1.default.unauthorized("User not found.");
    }
    // find user in db
    const userExists = await user_model_1.User.findById(userId).select("+password");
    if (!userExists) {
        throw SendError_1.default.notFound("User not found.");
    }
    // clear refresh and access token from db
    await user_model_1.User.findOneAndUpdate({
        _id: userExists._id,
    }, {
        $set: {
            refreshToken: "",
        },
    }, {
        new: true,
    });
    return res
        .status(200)
        .clearCookie("refreshToken", (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.REFRESH))
        .clearCookie("accessToken", (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.ACCESS))
        .json(SendRes_1.default.ok({}, "User logged out successfully."));
});
exports.logoutUser = logoutUser;
const deleteUserAccount = (0, asyncHandler_1.default)(async (req, res) => {
    // authenticate user
    const parsed = user_1.UserAuthSchema.parse(req.body);
    const { password } = parsed;
    const { userId } = req.user;
    if (!userId) {
        throw SendError_1.default.unauthorized("User ID is required.");
    }
    // find user to check if it exists or not
    const userExists = await user_model_1.User.findById(userId).select("+password");
    if (!userExists) {
        throw SendError_1.default.notFound("User does not exist.");
    }
    // match password
    const isValidPassword = userExists.comparePassword(password);
    if (!isValidPassword) {
        throw SendError_1.default.forbidden("Invalid password.");
    }
    // delete user account
    const data = await user_model_1.User.findByIdAndDelete(userId);
    console.log("User account deleted:", data);
    return res
        .status(200)
        .clearCookie("refreshToken", (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.REFRESH))
        .clearCookie("accessToken", (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.ACCESS))
        .json(SendRes_1.default.ok({}, "User account deleted successfully."));
});
exports.deleteUserAccount = deleteUserAccount;
const getCurrentUserProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw SendError_1.default.unauthorized("No user found.");
    }
    const userProfile = {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
    };
    return res
        .status(200)
        .json(SendRes_1.default.ok({ user: userProfile }, "User profile."));
});
exports.getCurrentUserProfile = getCurrentUserProfile;
const tokenRefresh = (0, asyncHandler_1.default)(async (req, res) => {
    // get refresh token
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
        throw SendError_1.default.badRequest("No refresh token found.");
    }
    // validate refresh token
    const decoded = (0, getTokens_1.verifyToken)(refreshToken, constants_1.TOKEN_TYPE.REFRESH);
    if (!decoded) {
        throw SendError_1.default.forbidden("Invalid refresh token.");
    }
    const user = await user_model_1.User.findOne({ _id: decoded.userId });
    if (!user) {
        throw SendError_1.default.notFound("Invalid refresh token.");
    }
    if (user.refreshToken !== refreshToken) {
        throw SendError_1.default.forbidden("Refresh token mismatch.");
    }
    const userData = {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
    };
    // generate access token & refresh token
    const tokens = (0, getTokens_1.getTokens)(userData);
    if (!tokens) {
        throw SendError_1.default.internal("Failed to generate refresh token.");
    }
    // update refresh token in db
    const updatedUser = await user_model_1.User.findOneAndUpdate({
        _id: user._id,
    }, {
        $set: {
            refreshToken: tokens.refreshToken,
        },
    }, {
        new: true,
    });
    const safeUserData = {
        userId: updatedUser?._id.toString(),
        username: updatedUser?.username,
        email: updatedUser?.email,
        role: updatedUser?.role,
    };
    // send response with cookies
    return res
        .status(200)
        .cookie("accessToken", tokens.accessToken, (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.ACCESS))
        .cookie("refreshToken", tokens.refreshToken, (0, getCookies_1.getCookie)(constants_1.TOKEN_TYPE.REFRESH))
        .json(SendRes_1.default.ok({
        user: safeUserData,
        tokens,
    }, "Token refreshed successfully."));
});
exports.tokenRefresh = tokenRefresh;
