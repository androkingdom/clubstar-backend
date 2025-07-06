import dotenv from "@dotenvx/dotenvx";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  NODE_ENV?: string;
  IMAGEKIT_PUBLIC_KEY: string;
  IMAGEKIT_PRIVATE_KEY: string;
  CORS_ORIGIN?: string;
}

const envConfig: EnvConfig = {
  PORT: process.env.PORT || "3001",
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access_secret",
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || "1h",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "30d",
  NODE_ENV: process.env.NODE_ENV || "development",
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || "public_key",
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "private_key",
  CORS_ORIGIN:
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN
      : "http://localhost:5000",
};

export default envConfig;
