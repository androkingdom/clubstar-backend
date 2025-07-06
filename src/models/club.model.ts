import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export enum ClubVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface IClub {
  name: string;
  slug: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  clubIconId?: string;
  clubIconUrl?: string;
  visibility?: ClubVisibility;
}

export type IClubDoc = IClub & Document;

const ClubSchema = new Schema<IClubDoc>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clubIconId: { type: String, required: true },
    clubIconUrl: { required: true, type: String },
    visibility: {
      type: String,
      enum: Object.values(ClubVisibility),
      default: ClubVisibility.PUBLIC,
    },
  },
  { timestamps: true }
);

ClubSchema.plugin(mongooseAggregatePaginate);

export const Club = mongoose.model<IClubDoc>("Club", ClubSchema);
