import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {

    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
     
    },
    role: {
      type: String,
      enum: ["admin", "agent", "user"],
      default: "user",
    },
    isActive: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "active",
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
