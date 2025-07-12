import connectDB from "./config/db";
import { API_URI } from "./constants";
import envConfig from "./config/env";
import { createServer } from "http";
import { initSocket } from "./socket";
import app from "./app";

const server = createServer(app);
initSocket(server);

try {
  connectDB().then(() => {
    server.listen(envConfig.PORT, () => {
      console.log(
        `Server is running http://localhost:${envConfig.PORT}${API_URI}`
      );
    });
  });
} catch (error) {
  console.error("Error connecting to the database:", error);
  process.exit(1);
}
