
import { Types } from "mongoose";
import { TransactionStatus, TransactionType } from "../modules/transaction/transaction.interface";
import { Transaction } from "../modules/transaction/transaction.model";


export const logTransaction = async ({
  amount,
  from,
  to,
  type,
  status = "success",
}: {
  amount: number;
  from?: Types.ObjectId;
  to?: Types.ObjectId;
  type: TransactionType;
  status?: TransactionStatus;
}) => {
  return Transaction.create({
    amount,
    from,
    to,
    type,
    status,
    timestamp: new Date(),
  });
};
