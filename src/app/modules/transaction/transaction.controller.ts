import { Request, Response } from "express";

import { TransactionService } from "./transaction.service";
import { catchAsync } from "../../utils/catchAsync";

export const createTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TransactionService.createTransaction(req.body);
    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: result,
    });
  }
);

export const getAllTransactions = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TransactionService.getAllTransactions();
    res.status(200).json({
      success: true,
      message: "All transactions fetched",
      data: result,
    });
  }
);
