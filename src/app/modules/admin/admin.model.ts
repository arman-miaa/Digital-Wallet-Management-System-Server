import { Schema, model, Document } from "mongoose";
import { IAgent } from "./admin.interface";



const agentSchema = new Schema<IAgent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["approved", "suspended", "pending"],
      default: "suspended",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AgentModel = model<IAgent>("Agent", agentSchema);
