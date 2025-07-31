import { Types } from "mongoose";

import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Wallet } from "./wallet.model";
import { Transaction } from "../transaction/transaction.model";
import AppError from "../../errorhelpers/appError";




export const createInitialWallet = async (userId: string, role: string) => {
  // শুধুমাত্র user বা agent এর জন্য
  if (role === "user" || role === "agent") {
    await Wallet.create({
      user: userId,
      balance: 50,
      role,
    });
  }
};


const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  return wallet;
};

const blockWallet = async (walletId: string) => {
  const wallet = await Wallet.findById(walletId);
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  wallet.isBlocked = !wallet.isBlocked;
  await wallet.save();

  return wallet;
};

const deposit = async (userId: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }
  

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet || wallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Wallet not found or is blocked"
    );
  }

  wallet.balance += amount;
  await wallet.save();

  await Transaction.create({
    type: "add",
    amount,
    from: wallet._id,
    to: wallet._id,
    status: "success",
  });

  return wallet;
};

const withdraw = async (userId: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet || wallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Wallet not found or is blocked"
    );
  }

  if (wallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  wallet.balance -= amount;
  await wallet.save();

  await Transaction.create({
    type: "withdraw",
    amount,
    from: wallet._id,
    to: wallet._id,
    status: "success",
  });

  return wallet;
};

const sendMoney = async (
  senderId: string,
  receiverPhone: string,
  amount: number
) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  const senderUser = await User.findById(senderId);
  const senderWallet = await Wallet.findOne({ user: senderId });
  const receiverUser = await User.findOne({ phone: receiverPhone });
  const receiverWallet = receiverUser
    ? await Wallet.findOne({ user: receiverUser._id })
    : null;

  if (!senderWallet || senderWallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sender wallet not found or is blocked"
    );
  }

  if (!receiverWallet || receiverWallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Receiver wallet not found or is blocked"
    );
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  await Transaction.create({
    type: "transfer",
    amount,
    from: senderWallet._id,
    to: receiverWallet._id,
    status: "success",
  });

  return {
    senderWallet,
    receiverWallet,
  };
};

const cashIn = async (agentId: string, userPhone: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  const agentWallet = await Wallet.findOne({ user: agentId });
  const user = await User.findOne({ phone: userPhone });
  const userWallet = user ? await Wallet.findOne({ user: user._id }) : null;

  if (!agentWallet || agentWallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Agent wallet not found or is blocked"
    );
  }

  if (!userWallet || userWallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User wallet not found or is blocked"
    );
  }

  if (agentWallet.balance < amount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Agent has insufficient balance"
    );
  }

  agentWallet.balance -= amount;
  userWallet.balance += amount;

  await agentWallet.save();
  await userWallet.save();

  await Transaction.create({
    type: "cashin",
    amount,
    from: agentWallet._id,
    to: userWallet._id,
    status: "success",
  });

  return {
    agentWallet,
    userWallet,
  };
};

const cashOut = async (agentId: string, userPhone: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  const agentWallet = await Wallet.findOne({ user: agentId });
  const user = await User.findOne({ phone: userPhone });
  const userWallet = user ? await Wallet.findOne({ user: user._id }) : null;

  if (!agentWallet || agentWallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Agent wallet not found or is blocked"
    );
  }

  if (!userWallet || userWallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User wallet not found or is blocked"
    );
  }

  if (userWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "User has insufficient balance");
  }

  userWallet.balance -= amount;
  agentWallet.balance += amount;

  await agentWallet.save();
  await userWallet.save();

  await Transaction.create({
    type: "cashout",
    amount,
    from: userWallet._id,
    to: agentWallet._id,
    status: "success",
  });

  return {
    agentWallet,
    userWallet,
  };
};

export const WalletService = {
  getMyWallet,
  blockWallet,
  deposit,
  withdraw,
  sendMoney,
  cashIn,
  cashOut,
};
