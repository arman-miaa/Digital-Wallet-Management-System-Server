import { Schema, model } from "mongoose";
import { ICapital } from "./capital.interface";

const CapitalSchema = new Schema<ICapital>({
  _id: {
    type: String,
    required: true,
    default: "capital_wallet", // fixed ID for single record
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    versionKey:false
  },
});

export const CapitalModel = model<ICapital>("Capital", CapitalSchema);
