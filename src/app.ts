import express, { Express, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { API_URI } from "./constants";
import errorHandler from "./middlewares/errorHandler.middleware";

const app: Express = express();

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.get(`${API_URI}/health`, (req, res) => {
  try {
    res.status(200).json({ message: "OK" });
  } catch (error: any) {
    res.status(500).send("Internal Server Error");
    throw new Error(error);
  }
});

// Import routers
import { router as authRouter } from "./routes/auth.route";
import { router as clubRouter } from "./routes/club.route";

// Mount routers
app.use(`${API_URI}/auth`, authRouter);
app.use(`${API_URI}/club`, clubRouter);

app.use(errorHandler);
export default app;
