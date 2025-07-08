import { z } from "zod";
import { ClubVisibility } from "../models/club.model";

export const CreateClubSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  visibility: z.nativeEnum(ClubVisibility).default(ClubVisibility.PUBLIC),
});
export type CreateClub = z.infer<typeof CreateClubSchema>;

export const DeleteClubSchema = z.object({
  slug: z.string().trim().min(1, "Club ID is required"),
});

export type DeleteClub = z.infer<typeof DeleteClubSchema>;
