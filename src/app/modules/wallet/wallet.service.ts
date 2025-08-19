import AppError from "../../errorHelpers/AppError";
import {
  TransferFee,
  WithdrawCommission,
} from "../commission/commission.service";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";
import { TransactionService } from "../transaction/transaction.service";
import { UserModel } from "../user/user.model";
import { WalletModel } from "../wallet/wallet.model";
import { IWallet } from "./wallet.interface";

const getMylWallet = async (user_id: string) => {
  const wallet = await WalletModel.find({ user: user_id }).sort({
    createdAt: -1,
  });
  return {
    data: wallet,
  };
};
const getAllWallet = async () => {
  const transactions = await WalletModel.find({});
  const totalTransaction = await WalletModel.countDocuments();
  return {
    data: transactions,
    meta: {
      total: totalTransaction,
    },
  };
};

const addMoney = async (agent_id: string, user_id: string, amount: number) => {
  if (amount < 100) throw new AppError(400, "Minimum amount 100");
  const userWallet = await WalletModel.findOne({ user: user_id });
  const agentWallet = await WalletModel.findOne({ user: agent_id });
  const userModel = await UserModel.findById(user_id);

  if (!userModel || userModel.role !== "USER")
    throw new AppError(404, "This account is not register as USER");

  if (!userWallet || !agentWallet) throw new AppError(404, "Wallet not found");
  if (userWallet.status === "BLOCKED" || agentWallet.status === "BLOCKED")
    throw new AppError(403, "Wallet is blocked");

  if (agentWallet.balance < amount) {
    throw new AppError(422, "Insufficient Balance");
  }

  agentWallet.balance -= amount;
  userWallet.balance += amount;
  await agentWallet.save();
  await userWallet.save();
  await TransactionService.createTransaction({
    user: user_id,
    agent: agent_id,
    amount,
    type: TransactionType.ADD,
    status: TransactionStatus.COMPLETED,
  });

  return {
    userWallet,
    agentWallet,
  };
};
const withdrawMoney = async (
  user_id: string,
  agent_id: string,
  amount: number
) => {
  if (amount < 100) throw new AppError(400, "Minimum amount 100");

  const userWallet = await WalletModel.findOne({ user: user_id });
  const agentWallet = await WalletModel.findOne({ user: agent_id });
  const agentModel = await UserModel.findById(agent_id);

  if (!agentModel || agentModel.role !== "AGENT")
    throw new AppError(404, "This account is not register as AGENT");

  if (!userWallet || !agentWallet) throw new AppError(404, "Wallet not found");
  if (userWallet.status === "BLOCKED" || agentWallet.status === "BLOCKED")
    throw new AppError(403, "Wallet is blocked");

  const { transaction_fee, agent_commission } = await WithdrawCommission(
    agent_id,
    amount
  );

  const totalDeductionUser = amount + transaction_fee;
  const totalDeductionAgent = amount + agent_commission;
  console.log("agent_commission", agent_commission);
  console.log("totalDeductionAgent", totalDeductionAgent);
  if (userWallet.balance < totalDeductionUser) {
    throw new AppError(422, "Insufficient Balance including transaction fee");
  }

  await TransactionService.createTransaction({
    user: user_id,
    agent: agent_id,
    amount,
    transaction_fee: transaction_fee,
    type: TransactionType.WITHDRAW,
    status: TransactionStatus.COMPLETED,
  });

  agentWallet.balance += totalDeductionAgent;
  userWallet.balance -= totalDeductionUser;

  await agentWallet.save();
  await userWallet.save();

  return {
    userWallet,
    agentWallet,
    withdrawMoney: totalDeductionUser,
    transactionFee: transaction_fee,
  };
};

const transferMoney = async (
  sender_id: string,
  receiver_id: string,
  amount: number
) => {
  if (amount <= 0) throw new AppError(400, "Invalid amount");
  if (sender_id === receiver_id) {
    throw new AppError(404, "You can't send money to your own account");
  }
  const senderWallet = await WalletModel.findOne({ user: sender_id });
  const receiverWallet = await WalletModel.findOne({ user: receiver_id });

  const userModel = await UserModel.findById(receiver_id);

  if (!userModel || userModel.role !== "USER")
    throw new AppError(404, "This account is not register as USER");

  if (!senderWallet || !receiverWallet)
    throw new AppError(404, "Wallet not found");
  if (senderWallet.status === "BLOCKED" || receiverWallet.status === "BLOCKED")
    throw new AppError(403, "Wallet is blocked");

  const { transaction_fee } = await TransferFee(amount);

  const totalDeduction = amount + transaction_fee;
  if (senderWallet.balance < totalDeduction) {
    throw new AppError(422, "Insufficient Balance including transaction fee");
  }

  await TransactionService.createTransaction({
    user: sender_id,
    agent: receiver_id,
    amount,
    transaction_fee: totalDeduction,
    type: TransactionType.TRANSFER,
    status: TransactionStatus.COMPLETED,
  });

  receiverWallet.balance += amount;
  senderWallet.balance -= totalDeduction;

  await receiverWallet.save();
  await senderWallet.save();

  return {
    senderWallet,
    receiverWallet,
    transferMoney: totalDeduction,
    transactionFee: transaction_fee,
  };
};

const updateWallet = async (userId: string, payload: Partial<IWallet>) => {
  const wallet = await WalletModel.findOne({ user: userId });

  if (!wallet) throw new AppError(404, "Wallet not found");

  if (wallet.status === "BLOCKED") {
    const isOnlyStatusUpdate =
      Object.keys(payload).length === 1 && "status" in payload;
    if (!isOnlyStatusUpdate) {
      throw new AppError(
        403,
        "Blocked wallet can only be updated to change status."
      );
    }
  }

  const updatedWallet = await WalletModel.findOneAndUpdate(
    { user: userId },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedWallet;
};

export const WalletService = {
  addMoney,
  getMylWallet,
  getAllWallet,
  withdrawMoney,
  transferMoney,
  updateWallet,
};
