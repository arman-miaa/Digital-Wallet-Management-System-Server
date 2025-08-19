/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TransactionService } from "./transaction.service";
import { JwtUserPayload } from "../../interfaces/JwtUserPayload.types";

const getAllTransactionByUserID = catchAsync(
  async (req: Request, res: Response) => {
    const { userId: user_id } = req.user as JwtUserPayload;
    const result = await TransactionService.getAllTransactionByUserID(user_id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Transaction Retrieved Successfully",
      data: result,
    });
  }
);
const getAllTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getAllTransaction();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Transaction Retrieved Successfully",
    data: result,
  });
});

export const transactionControllers = {
  getAllTransaction,
  getAllTransactionByUserID
};
