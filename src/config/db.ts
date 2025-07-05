import mongoose from "mongoose";
import envConfig from "../config/env";
import { DB_NAME } from "../constants";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(`${envConfig.DB_URL}/${DB_NAME}`);
    console.log("MongoDB connected successfully:", con.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
