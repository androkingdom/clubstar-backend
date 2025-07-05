import envConfig from "../config/env";
import { CookieOptions } from "express";
import { TOKEN_TYPE } from "../constants";

const MAX_AGE_MAP: Record<TOKEN_TYPE, number> = {
  [TOKEN_TYPE.ACCESS]: 60 * 60 * 1000, // 1h
  [TOKEN_TYPE.REFRESH]: 7 * 24 * 60 * 60 * 1000, // 7d
};

const getMaxAge = (tokenType: TOKEN_TYPE): number => {
  const age = MAX_AGE_MAP[tokenType];
  if (!age) throw new Error(`Invalid token type: ${tokenType}`);
  return age;
};

export const getCookie = (tokenType: TOKEN_TYPE): CookieOptions => {
  const isProd = envConfig.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: getMaxAge(tokenType),
  };
};
