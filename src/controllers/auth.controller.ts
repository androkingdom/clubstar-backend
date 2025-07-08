import { Request, Response } from "express";
import { User } from "../models/user.model";
import {
  UserAuth,
  UserAuthSchema,
  UserRegistration,
  UserRegistrationSchema,
} from "../validation/user";
import { AuthenticatedRequest } from "../middlewares/access.middleware";

import { ResponseUserData, TOKEN_PAYLOAD } from "../types";
import { TOKEN_TYPE } from "../constants";



import asyncHandler from "../utils/asyncHandler";
import SendError from "../utils/SendError";
import SendRes from "../utils/SendRes";
import { getTokens, verifyToken } from "../utils/getTokens";
import { getCookie } from "../utils/getCookies";

// This function handles user registration
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // get user data from request body
  const parsed: UserRegistration = UserRegistrationSchema.parse(req.body);
  const { username, email, password } = parsed;

  // Validate user data
  const userExists = await User.findOne({
    $or: [
      { email: email.toLowerCase().trim() },
      { username: username.toLowerCase().trim() },
    ],
  });

  // check if user already exists
  if (userExists) {
    throw SendError.badRequest(
      "User already exists with this email or username."
    );
  }
  // if not, create a new user
  const newUser = await User.create({
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  if (!newUser) {
    throw SendError.internal("Failed to create user. Please try again later.");
  }

  // create tokens for the new user
  const tokens = getTokens({
    userId: newUser._id.toString(),
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  });

  await User.findOneAndUpdate(
    {
      _id: newUser._id,
    },
    {
      $set: {
        refreshToken: tokens.refreshToken,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  // if user created successfully, send response
  return res
    .status(201)
    .cookie("refreshToken", tokens.refreshToken, getCookie(TOKEN_TYPE.REFRESH))
    .cookie("accessToken", tokens.accessToken, getCookie(TOKEN_TYPE.ACCESS))
    .json(
      SendRes.created(
        {
          user: {
            userId: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          } as ResponseUserData,
          tokens,
        },
        "User created successfully."
      )
    );
});

// This function handles user login
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // get user data from request body
  const parsed: UserAuth = UserAuthSchema.parse(req.body);
  const { email, password } = parsed;

  // find user by email or username
  const userExists = await User.findOne({ email }).select("+password");

  if (!userExists) {
    throw SendError.notFound("User does not exist.");
  }

  // check if password is correct
  const isValidPassword = await userExists.comparePassword(password); // await is used here

  if (!isValidPassword) {
    throw SendError.forbidden("Invalid password.");
  }

  // provide tokens if user exists
  const tokens = getTokens({
    userId: userExists._id.toString(),
    username: userExists.username,
    email: userExists.email,
    role: userExists.role,
  });

  await User.findOneAndUpdate(
    {
      _id: userExists._id,
    },
    {
      $set: {
        refreshToken: tokens.refreshToken,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .cookie("refreshToken", tokens.refreshToken, getCookie(TOKEN_TYPE.REFRESH))
    .cookie("accessToken", tokens.accessToken, getCookie(TOKEN_TYPE.ACCESS))
    .json(
      SendRes.ok(
        {
          user: {
            userId: userExists._id.toString(),
            username: userExists.username,
            email: userExists.email,
            role: userExists.role,
          } as ResponseUserData,
          tokens,
        },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // get userID from req.user => authentic user
    const { userId } = req.user as TOKEN_PAYLOAD;

    if (!userId) {
      throw SendError.unauthorized("User not found.");
    }

    // find user in db
    const userExists = await User.findById(userId).select("+password");

    if (!userExists) {
      throw SendError.notFound("User not found.");
    }

    // clear refresh and access token from db
    await User.findOneAndUpdate(
      {
        _id: userExists._id,
      },
      {
        $set: {
          refreshToken: "",
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("refreshToken", getCookie(TOKEN_TYPE.REFRESH))
      .clearCookie("accessToken", getCookie(TOKEN_TYPE.ACCESS))
      .json(SendRes.ok({}, "User logged out successfully."));
  }
);

const deleteUserAccount = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // authenticate user
    const parsed: UserAuth = UserAuthSchema.parse(req.body);
    const { password } = parsed;

    const { userId } = req.user as TOKEN_PAYLOAD;

    if (!userId) {
      throw SendError.unauthorized("User ID is required.");
    }

    // find user to check if it exists or not
    const userExists = await User.findById(userId).select("+password");
    if (!userExists) {
      throw SendError.notFound("User does not exist.");
    }

    // match password
    const isValidPassword = userExists.comparePassword(password);
    if (!isValidPassword) {
      throw SendError.forbidden("Invalid password.");
    }

    // delete user account
    const data = await User.findByIdAndDelete(userId);
    console.log("User account deleted:", data);

    return res
      .status(200)
      .clearCookie("refreshToken", getCookie(TOKEN_TYPE.REFRESH))
      .clearCookie("accessToken", getCookie(TOKEN_TYPE.ACCESS))
      .json(SendRes.ok({}, "User account deleted successfully."));
  }
);

const getCurrentUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user as TOKEN_PAYLOAD;
    if (!user) {
      throw SendError.unauthorized("No user found.");
    }

    const userProfile = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
    } as ResponseUserData;

    return res
      .status(200)
      .json(SendRes.ok({ user: userProfile }, "User profile."));
  }
);

const tokenRefresh = asyncHandler(async (req: Request, res: Response) => {
  // get refresh token
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    throw SendError.badRequest("No refresh token found.");
  }
  // validate refresh token
  const decoded = verifyToken(
    refreshToken,
    TOKEN_TYPE.REFRESH
  ) as TOKEN_PAYLOAD;

  if (!decoded) {
    throw SendError.forbidden("Invalid refresh token.");
  }

  const user = await User.findOne({ _id: decoded.userId });
  if (!user) {
    throw SendError.notFound("Invalid refresh token.");
  }

  if (user.refreshToken !== refreshToken) {
    throw SendError.forbidden("Refresh token mismatch.");
  }

  const userData: TOKEN_PAYLOAD = {
    userId: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };

  // generate access token & refresh token
  const tokens = getTokens(userData);
  if (!tokens) {
    throw SendError.internal("Failed to generate refresh token.");
  }

  // update refresh token in db
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: {
        refreshToken: tokens.refreshToken,
      },
    },
    {
      new: true,
    }
  );

  const safeUserData = {
    userId: updatedUser?._id.toString(),
    username: updatedUser?.username,
    email: updatedUser?.email,
    role: updatedUser?.role,
  } as ResponseUserData;

  // send response with cookies
  return res
    .status(200)
    .cookie("accessToken", tokens.accessToken, getCookie(TOKEN_TYPE.ACCESS))
    .cookie("refreshToken", tokens.refreshToken, getCookie(TOKEN_TYPE.REFRESH))
    .json(
      SendRes.ok(
        {
          user: safeUserData,
          tokens,
        },
        "Token refreshed successfully."
      )
    );
});

export {
  registerUser,
  loginUser,
  deleteUserAccount,
  getCurrentUserProfile,
  logoutUser,
  tokenRefresh,
};
