export type ClubRole = "owner" | "admin" | "mod" | "member";
export type ClubVisibility = "public" | "private";

export type MyClubDTO = {
  _id: string;
  name: string;
  slug: string;
  clubIconUrl: string;
  visibility: ClubVisibility;
  role: ClubRole;
  joinedAt: Date;
};
