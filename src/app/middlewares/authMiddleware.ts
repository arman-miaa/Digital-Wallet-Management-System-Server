import { NextFunction, Request, Response } from "express";
import AppError from "../errorhelpers/appError";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const authMiddleware =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Token Recieved");
      }
      //  const authHeader = req.headers.authorization;

      //  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      //    throw new AppError(403, "No Token Received or Invalid Format");
      //  }

      //  const token = authHeader.split(" ")[1];

      const verifiedToken = verifyToken(
        accessToken,
        // token,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      // authRotes = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
