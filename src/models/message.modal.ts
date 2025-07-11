import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface IMessage extends Document {
  sender: Schema.Types.ObjectId;
  club: Schema.Types.ObjectId;
  message: string;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    club: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.plugin(mongooseAggregatePaginate);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
