const DB_NAME: string = "clubstar";

const API_URI: string = "/api/v1";

interface TOKEN_PAYLOAD {
  userId: string;
  username: string;
  email: string;
  role: string;
}

enum TOKEN_TYPE {
  ACCESS = "access",
  REFRESH = "refresh",
}

interface responseUserData {
  userId: string;
  username: string;
  email: string;
  role: string;
}

type MyClubDTO = {
  _id: string;
  name: string;
  slug: string;
  clubIconUrl: string;
  visibility: "public" | "private" | "hidden";
  role: "owner" | "admin" | "mod" | "member";
  joinedAt: Date;
};

export {
  DB_NAME,
  API_URI,
  TOKEN_PAYLOAD,
  TOKEN_TYPE,
  responseUserData,
  MyClubDTO,
};
