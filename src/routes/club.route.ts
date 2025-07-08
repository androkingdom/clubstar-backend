import { Router } from "express";

import {
  createClub,
  updateClub,
  deleteClub,
  getClubs,
  getSingleClub,
  getCurrentUserClub,
} from "../controllers/club.controller";

import { isAuthenticated } from "../middlewares/access.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.route("/create").post(
  isAuthenticated,
  upload.single("clubIcon"), // 👈 FIRST: parse the FormData
  createClub
);

router.route("/me").post(isAuthenticated, getCurrentUserClub);

router.route("/:slug").post(isAuthenticated, getSingleClub);

router.route("/clubs").post(isAuthenticated, getClubs);

router.route("/delete").delete(isAuthenticated, deleteClub);

router.route("/update").put(isAuthenticated, updateClub);

export { router };
