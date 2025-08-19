import { Schema, model, Types } from "mongoose";

const WalletSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 50 },
    status: { type: String, enum: ["ACTIVE", "BLOCKED"], default: "ACTIVE" },
  },
  { timestamps: true, versionKey: false }
);

export const WalletModel = model("Wallet", WalletSchema);
