/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";



const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserServices.createUser(req.body);
    


    //   res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user,
    //   });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);



// function => req-res function

export const UserControllers = {
  createUser,


};

// route matching -> controller -> service -> mdole  -> DB
