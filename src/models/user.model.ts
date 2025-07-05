import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

enum UserRole {
  OWNER = "owner",
  ADMIN = "admin",
  MODERATOR = "moderator",
  Member = "member",
}

interface IUserMethods {
  comparePassword(candidatePassword: string): boolean;
}

interface IUser {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  // Optional fields for user creation and updates
  username: string;
  email: string;
  password: any; // Password will be hashed, so it can be any type
  role: UserRole;
  // Optional fields for token management
  refreshToken?: string;
}

export type UserDoc = IUser & Document & IUserMethods;

const userSchema = new Schema<UserDoc>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensure usernames are unique
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensure email addresses are unique
    },
    password: {
      type: String,
      required: true,
      select: false, // Exclude password from queries by default
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Member,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing
userSchema.pre<UserDoc>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password comparison result:", result);
    return result;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};

export const User = model<UserDoc>("User", userSchema);
