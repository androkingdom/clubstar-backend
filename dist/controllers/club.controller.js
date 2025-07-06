"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserClub = exports.getSingleClub = exports.getClubs = exports.deleteClub = exports.updateClub = exports.createClub = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const SendError_1 = __importDefault(require("../utils/SendError"));
const SendRes_1 = __importDefault(require("../utils/SendRes"));
const club_model_1 = require("../models/club.model");
const imagekit_1 = __importDefault(require("../utils/imagekit"));
const club_1 = require("../validation/club");
const clubMember_model_1 = require("../models/clubMember.model");
const createClub = (0, asyncHandler_1.default)(async (req, res) => {
    // get club data from request body
    const parsed = club_1.CreateClubSchema.parse(req.body);
    const { name, slug, description } = parsed;
    const clubIcon = req.file;
    // get user from req.user => authentic user
    const { userId } = req.user;
    if (!userId) {
        throw SendError_1.default.unauthorized("User not found.");
    }
    // check if image is given
    if (!clubIcon) {
        throw SendError_1.default.badRequest("Image is required.");
    }
    // check if club already exists
    const clubExists = await club_model_1.Club.findOne({ name, slug });
    if (clubExists) {
        throw SendError_1.default.custom({
            statusCode: 409,
            message: "Club already exists with this name.",
        });
    }
    // upload image if exists
    const clubIconDetails = await imagekit_1.default.upload({
        file: clubIcon.buffer,
        fileName: clubIcon.originalname,
        folder: "/Clubstar",
    });
    if (!clubIconDetails) {
        throw SendError_1.default.internal("Failed to upload image. Please try again later.");
    }
    // create club
    const newClub = await club_model_1.Club.create({
        name,
        slug,
        description,
        owner: userId,
        clubIconId: clubIconDetails.fileId,
        clubIconUrl: clubIconDetails.url,
    });
    // create member
    const newClubMember = await clubMember_model_1.ClubMember.create({
        user: userId,
        club: newClub._id,
        role: "owner",
    });
    if (!newClub && !newClubMember) {
        throw SendError_1.default.internal("Failed to create club.");
    }
    // send response
    return res.status(200).json(SendRes_1.default.created({
        club: {
            name: newClub.name,
            slug: newClub.slug,
            description: newClub.description,
            clubIconId: newClub.clubIconId,
            clubIconUrl: newClub.clubIconUrl,
        },
    }, "Club created."));
});
exports.createClub = createClub;
const deleteClub = (0, asyncHandler_1.default)(async (req, res) => {
    // get club data from request body
    const parsed = club_1.DeleteClubSchema.parse(req.body);
    const { slug } = parsed;
    // get userId from req.user
    const { userId } = req.user;
    if (!userId) {
        throw SendError_1.default.unauthorized("No user found.");
    }
    // find club with userId = owner verify
    const clubExistsWithOwner = await club_model_1.Club.findOne({
        slug,
        owner: userId,
    });
    if (!clubExistsWithOwner) {
        throw SendError_1.default.forbidden("You are not the club owner.");
    }
    // if exists, delete club
    const deletedClub = await club_model_1.Club.findByIdAndDelete(clubExistsWithOwner._id);
    if (!deletedClub) {
        throw SendError_1.default.internal("Failed to delete club. Please try again later.");
    }
    // logo cleanup
    if (deletedClub.clubIconId) {
        await imagekit_1.default.deleteFile(deletedClub.clubIconId);
    }
    return res
        .status(200)
        .json(SendRes_1.default.ok({ club: deletedClub }, "Club deleted."));
});
exports.deleteClub = deleteClub;
const getCurrentUserClub = (0, asyncHandler_1.default)(async (req, res) => {
    const { userId } = req.user;
    if (!userId) {
        throw SendError_1.default.unauthorized("No user found.");
    }
});
exports.getCurrentUserClub = getCurrentUserClub;
const getSingleClub = (0, asyncHandler_1.default)(async (req, res) => {
    const { slug } = req.params;
});
exports.getSingleClub = getSingleClub;
const getClubs = (0, asyncHandler_1.default)(async (req, res) => { });
exports.getClubs = getClubs;
const updateClub = (0, asyncHandler_1.default)(async (req, res) => { });
exports.updateClub = updateClub;
