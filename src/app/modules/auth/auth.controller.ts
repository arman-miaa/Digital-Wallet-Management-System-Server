/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorhelpers/appError";
import { setAuthCookie } from "../../utils/setCookie";
 

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginILnfo = await AuthServices.credentialsLogin(req.body);

    // res.cookie("accessToken", loginILnfo.accessToken, {
    //   httpOnly: true,
    //   secure: false
    // })

    // res.cookie('refreshToken', loginILnfo.refreshToken, {
    //   httpOnly: true,
    //   secure: false
    // })

    setAuthCookie(res, loginILnfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginILnfo,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    // const refreshToken = req.headers.authorization;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token recieved from cookies"
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access token Retrived Successfully",
      data: tokenInfo,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,

};
