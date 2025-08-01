import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export type TransactionType = "add"|"withdraw"|"transfer"|"cashin"| "cashout" | "RECEIVE";
export type TransactionStatus = "success" | "failed";

export interface ITransaction {
  amount: number;
  from?: Types.ObjectId | IUser; 
  to?: Types.ObjectId | IUser; 
  type: TransactionType;
  status: TransactionStatus;
  timestamp?: Date;
}


