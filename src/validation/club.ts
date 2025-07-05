import { z } from "zod";

export const CreateClubSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  description: z.string().trim().min(1, "Description is required"),
});
export type CreateClub = z.infer<typeof CreateClubSchema>;

export const DeleteClubSchema = z.object({
  slug: z.string().trim().min(1, "Club ID is required"),
});

export type DeleteClub = z.infer<typeof DeleteClubSchema>;
