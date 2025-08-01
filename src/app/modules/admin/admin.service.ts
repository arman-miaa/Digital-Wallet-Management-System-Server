import httpStatus from "http-status-codes";


import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";
import AppError from "../../errorhelpers/appError";
import { IPopulatedTransaction } from "./admin.interface";


export const AdminService = {
  // View all Users
  getAllUsers: async () => {
    return await User.find({ role: "user" });
  },

  // View all Agents
  getAllAgents: async () => {
    return await User.find({ role: "agent" });
  },

  // View all Wallets (with user info)
  getAllWallets: async () => {
    return await Wallet.find().populate("user");
  },

  // View all Transactions

  getAllTransactions: async (): Promise<IPopulatedTransaction[]> => {
    const transactions = await Transaction.find()
      .populate("from", "name email role")
      .populate("to", "name email role")
      .sort({ timestamp: -1 });

    const formattedTransactions = transactions.map((tx) => ({
      _id: tx._id.toString(),
      amount: tx.amount,
      type: tx.type,
      status: tx.status,
      timestamp: tx.timestamp,
      from:
        tx.from &&
        typeof tx.from === "object" &&
        "name" in tx.from &&
        tx.from._id
          ? {
              _id: tx.from._id.toString(),
              name: tx.from.name,
              email: tx.from.email,
              role: tx.from.role,
            }
          : null,
      to:
        tx.to && typeof tx.to === "object" && "name" in tx.to && tx.to._id
          ? {
              _id: tx.to._id.toString(),
              name: tx.to.name,
              email: tx.to.email,
              role: tx.to.role,
            }
          : null,
    }));

    return formattedTransactions;
  },

  // Block / Unblock Wallet
  blockUnblockWallet: async (walletId: string, isBlocked: boolean) => {
    console.log('walletid........',walletId,isBlocked);
    const wallet = await Wallet.findByIdAndUpdate(
      walletId,
      { isBlocked },
      { new: true }
    );

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    return wallet;
  },

  // Approve / Suspend Agent
  approveSuspendAgent: async (
    agentId: string,
    status: "approved" | "suspended"
  ) => {
    const agent = await User.findById(agentId);

    if (!agent || agent.role !== "agent") {
      throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }

    agent.status = status;
    await agent.save();
    return agent;
  },
};
