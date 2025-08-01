import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import { WalletService } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "../user/user.interface";
import AppError from "../../errorhelpers/appError";
import { logTransaction } from "../../utils/logTransaction";



export const getMyWallet = catchAsync(async (req: Request, res: Response) => {

 
    
    const user = req.body;
    

  const result = await WalletService.getMyWallet(user?._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet fetched successfully",
    data: result,
  });
});

export const blockWallet = catchAsync(async (req: Request, res: Response) => {
  const walletId = req.params.id;
  const result = await WalletService.blockWallet(walletId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet status updated successfully",
    data: result,
  });
});


export const depositMoney = catchAsync(async (req: Request, res: Response) => {

  const userId = req.user?.userId; 
  const { amount } = req.body;

 

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }


  const result = await WalletService.deposit(userId, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money deposited successfully",
    data: result,
  });
});


export const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
   const userId = req.user?.userId; 
  const { amount } = req.body;
  const result = await WalletService.withdraw(userId, amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money withdrawn successfully",
    data: result,
  });
});

export const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.user?.userId;
  const { recipientId, amount } = req.body;

  if (!senderId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const result = await WalletService.sendMoney(senderId, recipientId, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money sent successfully",
    data: result,
  });
});


export const cashIn = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.user?.userId;
  const { recipientId, amount } = req.body;
  const result = await WalletService.cashIn(senderId,recipientId, amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash in successful",
    data: result,
  });
});


export const cashOut = catchAsync(async (req: Request, res: Response) => {
  const agent = req.user?.userId;
  console.log("agent..........",req.user);
  const { userId, amount } = req.body;
  const result = await WalletService.cashOut(agent, userId, amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash out successful",
    data: result,
  });
});
