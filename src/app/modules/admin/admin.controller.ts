import { Request, Response } from "express";

import { AdminService } from "./admin.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const AdminController = {
  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllUsers();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  }),

  getAllAgents: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllAgents();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Agents fetched successfully",
      data: result,
    });
  }),

  getAllWallets: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllWallets();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Wallets fetched successfully",
      data: result,
    });
  }),

  getAllTransactions: catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllTransactions();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Transactions fetched successfully",
      data: result,
    });
  }),

  blockUnblockWallet: catchAsync(async (req: Request, res: Response) => {
    console.log('body........',req.body);
    const { walletId, isBlocked } = req.body;
    const result = await AdminService.blockUnblockWallet(walletId, isBlocked);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Wallet ${isBlocked ? "blocked" : "unblocked"} successfully`,
      data: result,
    });
  }),

  approveSuspendAgent: catchAsync(async (req: Request, res: Response) => {
    const { agentId, status } = req.body; // status: 'approved' | 'suspended'
    const result = await AdminService.approveSuspendAgent(agentId, status);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Agent ${status} successfully`,
      data: result,
    });
  }),
};
