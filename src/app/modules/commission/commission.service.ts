import { CapitalModel } from "../capital/capital.model";
import { AgentCommissionHistoryModel } from "../commission/commission.model";
export const WithdrawCommission = async (agentId: string, amount: number) => {
  let feeUnit: number;
  let transactionFee: number;

  if (amount >= 1000) {
    feeUnit = Math.floor(amount / 1000);
    transactionFee = feeUnit * 20;
  } else {
    feeUnit = 0.5;
    transactionFee = feeUnit * 20;
  }

  const agentCommission = feeUnit * 10;
  const ownerCommission = transactionFee - agentCommission;

  if (agentId && agentCommission > 0) {
    await AgentCommissionHistoryModel.create({
      agent_id: agentId,
      amount: agentCommission,
    });
  }

  if (ownerCommission > 0) {
    await CapitalModel.findByIdAndUpdate(
      "capital_wallet",
      { $inc: { balance: ownerCommission } },
      { upsert: true, new: true }
    );
  }

  return { transaction_fee: transactionFee, agent_commission: agentCommission };
};
export const TransferFee = async (amount: number) => {
  const transactionFee = amount <= 10000 ? 5 : 10;

  if (transactionFee > 0) {
    await CapitalModel.findByIdAndUpdate(
      "capital_wallet",
      { $inc: { balance: transactionFee } },
      { upsert: true, new: true }
    );
  }

  return { transaction_fee: transactionFee };
};

import mongoose from "mongoose";

const getAllCommissionByUserID = async (user_id: string) => {
  const agentObjectId = new mongoose.Types.ObjectId(user_id);

  const transactions = await AgentCommissionHistoryModel.find({
    agent_id: agentObjectId,
  }).sort({ createdAt: -1 });

  const totalCommission = await AgentCommissionHistoryModel.countDocuments({
    agent_id: agentObjectId,
  });

  const totalAmount = await AgentCommissionHistoryModel.aggregate([
    { $match: { agent_id: agentObjectId } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return {
    data: transactions,
    meta: {
      total: totalCommission,
      totalCommissionAmount: totalAmount[0]?.total || 0,
    },
  };
};

const getAllCommission = async () => {
  const transactions = await AgentCommissionHistoryModel.find({}).sort({
    createdAt: -1,
  });
  const totalTransaction = await AgentCommissionHistoryModel.countDocuments();
  return {
    data: transactions,
    meta: {
      total: totalTransaction,
    },
  };
};
export const CommissionService = {
  getAllCommission,
  getAllCommissionByUserID,
};
