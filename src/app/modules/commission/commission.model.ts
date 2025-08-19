import { Schema, model } from "mongoose";
import { IAgentCommissionHistory } from "./commission.interface";

const AgentCommissionHistorySchema = new Schema<IAgentCommissionHistory>(
  {
    agent_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // transaction_id: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    // },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey:false
  }
);

export const AgentCommissionHistoryModel = model<IAgentCommissionHistory>(
  "AgentCommissionHistory",
  AgentCommissionHistorySchema
);
