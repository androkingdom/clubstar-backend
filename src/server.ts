import connectDB from "./config/db";
import { API_URI } from "./constants";
import envConfig from "./config/env";
import app from "./app";

try {
  connectDB().then(() => {
    app.listen(envConfig.PORT, () => {
      console.log(`Server is running http://localhost:${envConfig.PORT}${API_URI}`);
    });
  });
} catch (error) {
  console.error("Error connecting to the database:", error);
  process.exit(1);
}
