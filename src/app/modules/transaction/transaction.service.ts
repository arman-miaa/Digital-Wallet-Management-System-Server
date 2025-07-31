import { Transaction } from "./transaction.model";
import { ITransaction } from "./transaction.interface";

const createTransaction = async (data: ITransaction) => {
  const transaction = await Transaction.create(data);
  return transaction;
};

const getAllTransactions = async () => {
  return Transaction.find().populate("from to", "email role");
};

export const TransactionService = {
  createTransaction,
  getAllTransactions,
};
