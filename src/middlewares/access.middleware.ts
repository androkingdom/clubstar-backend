import { TOKEN_PAYLOAD, TOKEN_TYPE } from "../constants";
import asyncHandler from "../utils/asyncHandler";
import SendError from "../utils/SendError";
import { Request, NextFunction } from "express";
import { User } from "../models/user.model";
import { verifyToken } from "../utils/getTokens";

export interface AuthenticatedRequest extends Request {
  user: TOKEN_PAYLOAD;
}

export const isAuthenticated = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const rawToken =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!rawToken) {
      throw SendError.unauthorized();
    }

    const decoded = verifyToken(rawToken, TOKEN_TYPE.ACCESS) as TOKEN_PAYLOAD;
    console.log("Access token decoded:", decoded);
    if (!decoded) {
      throw SendError.unauthorized();
    }

    const userExists = await User.findById(decoded?.userId);

    if (!userExists) {
      throw SendError.notFound("User not found");
    }

    req.user = decoded;

    next();
  }
);
