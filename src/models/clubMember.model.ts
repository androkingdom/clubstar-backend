import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface IClubMember extends Document {
  user: mongoose.Types.ObjectId;
  club: mongoose.Types.ObjectId;
  role: string;
}

const ClubMemberSchema = new Schema<IClubMember>(
  {
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "moderator", "member"],
      default: "member",
    },
  },
  { timestamps: true }
);

ClubMemberSchema.plugin(mongooseAggregatePaginate);

export const ClubMember = mongoose.model<IClubMember>(
  "ClubMember",
  ClubMemberSchema
);
