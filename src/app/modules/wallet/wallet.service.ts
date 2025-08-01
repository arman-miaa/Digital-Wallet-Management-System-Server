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

export const sendMoney = async (
  senderId: string,
  recipientId: string,
  amount: number
) => {
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  if (senderId === recipientId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot send money to yourself");
  }

  const sender = await Wallet.findOne({ user: senderId });
  if (!sender || sender.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  const recipient = await Wallet.findOne({ user: recipientId });
  if (!recipient) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found");
  }

  // Transaction processing
  sender.balance -= amount;
  recipient.balance += amount;

  await sender.save();
  await recipient.save();

  const senderTxn = await Transaction.create({
    user: sender.user,
    type: "transfer",
    amount,
    to: recipientId,
  });

  const recipientTxn = await Transaction.create({
    user: recipient.user,
    type: "RECEIVE",
    amount,
    from: senderId,
  });

  return { senderTxn, recipientTxn };
};
export const cashIn = async (
  agentId: string,
  userId: string,
  amount: number
) => {
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  if (agentId === userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot cash-in to yourself");
  }

  const agentWallet = await Wallet.findOne({ user: agentId });
  if (!agentWallet || agentWallet.balance < amount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Agent has insufficient balance"
    );
  }

  const userWallet = await Wallet.findOne({ user: userId });
  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
  }

  // টাকা ট্রান্সফার প্রসেসিং
  agentWallet.balance -= amount;
  userWallet.balance += amount;

  await agentWallet.save();
  await userWallet.save();

  // ট্রান্সাকশন লগ
  const agentTxn = await Transaction.create({
    user: agentId,
    type: "cashin",
    amount,
    to: userId,
  });

  const userTxn = await Transaction.create({
    user: userId,
    type: "RECEIVE",
    amount,
    from: agentId,
  });

  return { agentTxn, userTxn };
};

export const cashOut = async (
  userId: string,
  agentId: string,
  amount: number
) => {
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  console.log('now data .......',agentId,userId);

  if (userId === agentId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot cash-out to yourself");
  }

  const userWallet = await Wallet.findOne({ user: userId });
  if (!userWallet || userWallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User wallet not found or is blocked"
    );
  }

  const agentWallet = await Wallet.findOne({ user: agentId });
  if (!agentWallet || agentWallet.isBlocked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Agent wallet not found or is blocked"
    );
  }

  if (userWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient user balance");
  }

  // টাকা ট্রান্সফার প্রসেসিং
  userWallet.balance -= amount;
  agentWallet.balance += amount;

  await userWallet.save();
  await agentWallet.save();

  // ট্রান্সাকশন লগ
  const userTxn = await Transaction.create({
    user: userId,
    type: "cashout",
    amount,
    to: agentId,
  });

  const agentTxn = await Transaction.create({
    user: agentId,
    type: "RECEIVE",
    amount,
    from: userId,
  });

  return { userTxn, agentTxn };
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
