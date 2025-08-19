/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtUserPayload } from "../../interfaces/JwtUserPayload.types";
import { CommissionService } from "./commission.service";

const getAllCommissionByUserID = catchAsync(
  async (req: Request, res: Response) => {
    const { userId: user_id } = req.user as JwtUserPayload;
    const result = await CommissionService.getAllCommissionByUserID(user_id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Commission Retrieved Successfully",
      data: result,
    });
  }
);
const getAllCommission = catchAsync(async (req: Request, res: Response) => {
  const result = await CommissionService.getAllCommission();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Commission Retrieved Successfully",
    data: result,
  });
});

export const commissionControllers = {
  getAllCommissionByUserID,
  getAllCommission,
};
