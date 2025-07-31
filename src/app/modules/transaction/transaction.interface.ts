import { Types } from "mongoose";

export type TransactionType = "add"|"withdraw"|"transfer"|"cashin"| "cashout" | "RECEIVE";
export type TransactionStatus = "success" | "failed";

export interface ITransaction {
  amount: number;
  from?: Types.ObjectId; // optional for "add"
  to?: Types.ObjectId; // optional for "withdraw"
  type: TransactionType;
  status: TransactionStatus;
  timestamp?: Date;
}
