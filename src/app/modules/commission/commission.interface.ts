import { Types } from "mongoose";

export interface IAgentCommissionHistory {
  agent_id: Types.ObjectId;
  // transaction_id: Types.ObjectId;
  amount: number;
}
