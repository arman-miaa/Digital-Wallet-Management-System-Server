/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { WalletService } from "./wallet.service";
import { JwtUserPayload } from "../../interfaces/JwtUserPayload.types";
import { JwtPayload } from "jsonwebtoken";

const getMylWallet = catchAsync(async (req: Request, res: Response) => {
  const { userId: user_id } = req.user as JwtUserPayload;
  const result = await WalletService.getMylWallet(user_id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your Wallet Retrieved Successfully",
    data: result,
  });
});
const getAllWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.getAllWallet();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Transaction Retrieved Successfully",
    data: result,
  });
});

const addMoney = catchAsync(async (req: Request, res: Response) => {
  const { userId: agent_id } = req.user as JwtUserPayload;
  const { user_id, amount } = req.body;
  const result = await WalletService.addMoney(agent_id, user_id, amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Money added successfully",
    data: result,
  });
});
const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { userId: user_id } = req.user as JwtUserPayload;
  const { agent_id, amount } = req.body;
  const result = await WalletService.withdrawMoney(user_id, agent_id, amount);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Money withdraw successfully",
    data: result,
  });
});

const transferMoney = catchAsync(async (req: Request, res: Response) => {
  const { userId: sender_id } = req.user as JwtUserPayload;
  const { receiver_id, amount } = req.body;
  const result = await WalletService.transferMoney(
    sender_id,
    receiver_id,
    amount
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Money transfer successfully",
    data: result,
  });
});

const updateWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;
  const result = await WalletService.updateWallet(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet Updated Successfully",
    data: result,
  });
});

export const WalletControllers = {
  addMoney,
  withdrawMoney,
  getMylWallet,
  getAllWallet,
  transferMoney,
  updateWallet,
};
