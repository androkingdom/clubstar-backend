import asyncHandler from "../utils/asyncHandler";
import { Request, Response } from "express";
import SendError from "../utils/SendError";
import SendRes from "../utils/SendRes";
import { Club } from "../models/club.model";
import imagekit from "../utils/imagekit";
import { AuthenticatedRequest } from "../middlewares/access.middleware";
import {
  CreateClub,
  CreateClubSchema,
  DeleteClub,
  DeleteClubSchema,
} from "../validation/club";
import { TOKEN_PAYLOAD, MyClubDTO } from "../constants";
import { ClubMember } from "../models/clubMember.model";

const createClub = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // get club data from request body
    const parsed: CreateClub = CreateClubSchema.parse(req.body);
    const { name, slug, description } = parsed;
    const clubIcon = req.file;

    // get user from req.user => authentic user
    const { userId } = req.user as TOKEN_PAYLOAD;
    if (!userId) {
      throw SendError.unauthorized("User not found.");
    }

    // check if image is given
    if (!clubIcon) {
      throw SendError.badRequest("Image is required.");
    }

    // check if club already exists
    const clubExists = await Club.findOne({ name, slug });
    if (clubExists) {
      throw SendError.custom({
        statusCode: 409,
        message: "Club already exists with this name.",
      });
    }

    // upload image if exists
    const clubIconDetails = await imagekit.upload({
      file: clubIcon.buffer,
      fileName: clubIcon.originalname,
      folder: "/Clubstar",
    });

    if (!clubIconDetails) {
      throw SendError.internal(
        "Failed to upload image. Please try again later."
      );
    }

    // create club
    const newClub = await Club.create({
      name,
      slug,
      description,
      owner: userId,
      clubIconId: clubIconDetails.fileId,
      clubIconUrl: clubIconDetails.url,
    });

    // create member
    const newClubMember = await ClubMember.create({
      user: userId,
      club: newClub._id,
      role: "owner",
    });

    if (!newClub && !newClubMember) {
      throw SendError.internal("Failed to create club.");
    }

    // send response
    return res.status(200).json(
      SendRes.created(
        {
          club: {
            name: newClub.name,
            slug: newClub.slug,
            description: newClub.description,
            clubIconId: newClub.clubIconId,
            clubIconUrl: newClub.clubIconUrl,
          },
        },
        "Club created."
      )
    );
  }
);

const deleteClub = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // get club data from request body
    const parsed: DeleteClub = DeleteClubSchema.parse(req.body);
    const { slug } = parsed;

    // get userId from req.user
    const { userId } = req.user as TOKEN_PAYLOAD;
    if (!userId) {
      throw SendError.unauthorized("No user found.");
    }

    // find club with userId = owner verify
    const clubExistsWithOwner = await Club.findOne({
      slug,
      owner: userId,
    });

    if (!clubExistsWithOwner) {
      throw SendError.forbidden("You are not the club owner.");
    }

    // if exists, delete club
    const deletedClub = await Club.findByIdAndDelete(clubExistsWithOwner._id);
    if (!deletedClub) {
      throw SendError.internal(
        "Failed to delete club. Please try again later."
      );
    }

    // logo cleanup
    if (deletedClub.clubIconId) {
      await imagekit.deleteFile(deletedClub.clubIconId);
    }

    return res
      .status(200)
      .json(SendRes.ok({ club: deletedClub }, "Club deleted."));
  }
);

const getCurrentUserClub = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // get userId from req.user
    const { userId } = req.user as TOKEN_PAYLOAD;
    if (!userId) {
      throw SendError.unauthorized("No user found.");
    }

    // find club where member is current user
    const myClub = await ClubMember.findOne({
      user: userId,
    });
    
  }
);

const getSingleClub = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
});

const getClubs = asyncHandler(async (req: Request, res: Response) => {});

const updateClub = asyncHandler(async (req: Request, res: Response) => {});

export {
  createClub,
  updateClub,
  deleteClub,
  getClubs,
  getSingleClub,
  getCurrentUserClub,
};
