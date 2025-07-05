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
import { createClubSchema } from "../validation/club";

const router = Router();

router.route("/create").post(
  isAuthenticated,
  upload.single("clubIcon"), // 👈 FIRST: parse the FormData
  createClub
);

router.route("/me").get(isAuthenticated, getCurrentUserClub);

router.route("/:slug").get(isAuthenticated, getSingleClub);

router.route("/clubs").get(isAuthenticated, getClubs);

router.route("/delete").delete(isAuthenticated, deleteClub);

router.route("/update").put(isAuthenticated, updateClub);

export { router };
