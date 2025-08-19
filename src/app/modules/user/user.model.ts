import { Schema, model } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const AuthProviderSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ["google", "credentials"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    profile_photo: { type: String },
    short_bio: { type: String },
    auths: [AuthProviderSchema],
    is_active: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    is_verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey:false,
  }
);

export const UserModel = model<IUser>("User", UserSchema);
