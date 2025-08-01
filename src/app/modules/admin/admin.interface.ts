import { Types } from "mongoose";

export type AgentStatus = "approved" | "suspended" | "pending";

export interface IAgent extends Document {
  userId: Types.ObjectId; 
  status: AgentStatus;

}

import { IUser, IUserRole } from "../user/user.interface";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";


export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
  role?: IUserRole;
}

export interface IPopulatedTransaction {
  _id: string;
  amount: number;
  from?: IUserPublic | null;
  to?: IUserPublic | null;
  type: TransactionType;
  status: TransactionStatus;
  timestamp?: Date;
}


