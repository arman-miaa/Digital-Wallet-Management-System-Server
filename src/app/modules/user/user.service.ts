import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { IAuthProvider, IUser, Role } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import { UserModel } from "./user.model";
import { WalletModel } from "../wallet/wallet.model";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, role = "USER", ...rest } = payload;

  if (!email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email and password are required."
    );
  }

  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists.");
  }

  const hashedPassword = await bcryptjs.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND) || 10
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email,
  };

  const user = await UserModel.create({
    email,
    password: hashedPassword,
    role,
    auths: [authProvider],
    is_active: "ACTIVE",
    is_verified: true,
    ...rest,
  });

  // Create wallet with initial balance ৳50
  await WalletModel.create({
    user: user._id,
    balance: 50,
    status: "ACTIVE",
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExist = await UserModel.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === Role.ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.is_active || payload.is_verified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const users = await UserModel.find({ role: "USER" });
  const totalUsers = await UserModel.countDocuments({ role: "USER" });
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};
const getAllAgents = async () => {
  const users = await UserModel.find({ role: "AGENT" });
  const totalUsers = await UserModel.countDocuments({ role: "AGENT" });
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUser,
  updateUser,
  getAllUsers,
  getAllAgents,
};
