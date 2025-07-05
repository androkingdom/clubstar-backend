import { Router, Request, Response } from "express";

import { isAuthenticated } from "../middlewares/access.middleware";

import {
  registerUser,
  loginUser,
  getCurrentUserProfile,
  deleteUserAccount,
  logoutUser,
  tokenRefresh,
} from "../controllers/auth.controller";

const router = Router();

router.route("/register").post(registerUser);

router.route("/logout").post(isAuthenticated, logoutUser);

router.route("/login").post(loginUser);

router.route("/delete").delete(isAuthenticated, deleteUserAccount);

router.route("/me").get(isAuthenticated, getCurrentUserProfile);

router.route("/refresh").post(tokenRefresh);

export { router };
