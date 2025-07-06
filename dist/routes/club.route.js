"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const club_controller_1 = require("../controllers/club.controller");
const access_middleware_1 = require("../middlewares/access.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
exports.router = router;
router.route("/create").post(access_middleware_1.isAuthenticated, upload_middleware_1.upload.single("clubIcon"), // 👈 FIRST: parse the FormData
club_controller_1.createClub);
router.route("/me").get(access_middleware_1.isAuthenticated, club_controller_1.getCurrentUserClub);
router.route("/:slug").get(access_middleware_1.isAuthenticated, club_controller_1.getSingleClub);
router.route("/clubs").get(access_middleware_1.isAuthenticated, club_controller_1.getClubs);
router.route("/delete").delete(access_middleware_1.isAuthenticated, club_controller_1.deleteClub);
router.route("/update").put(access_middleware_1.isAuthenticated, club_controller_1.updateClub);
