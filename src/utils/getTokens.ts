import jwt, { SignOptions } from "jsonwebtoken";
import envConfig from "../config/env";
import { TOKEN_PAYLOAD } from "../types";
import { TOKEN_TYPE } from "../constants";

export const getAccessTokens = (payload: TOKEN_PAYLOAD) => {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET, {
    expiresIn: envConfig.JWT_ACCESS_EXPIRATION,
  } as SignOptions);
};

export const getRefreshTokens = (payload: TOKEN_PAYLOAD) => {
  return jwt.sign(payload, envConfig.JWT_REFRESH_SECRET, {
    expiresIn: envConfig.JWT_REFRESH_EXPIRATION,
  } as SignOptions);
};

export const getTokens = (payload: TOKEN_PAYLOAD) => {
  const accessToken = getAccessTokens(payload);
  const refreshToken = getRefreshTokens(payload);
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, tokenType: TOKEN_TYPE) => {
  let JWT_SECRET;
  switch (tokenType) {
    case TOKEN_TYPE.ACCESS:
      JWT_SECRET = envConfig.JWT_ACCESS_SECRET;
      break;
    case TOKEN_TYPE.REFRESH:
      JWT_SECRET = envConfig.JWT_REFRESH_SECRET;
      break;
    default:
      throw new Error("Invalid Token Type!");
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log("Error in token verification", error);
  }
};
