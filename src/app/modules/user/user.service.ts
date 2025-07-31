import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
import { IUser } from "./user.interface";
import { envVars } from "../../config/env";
import AppError from "../../errorhelpers/appError";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;



  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );



  const user = await User.create({
    email,
    password: hashedPassword,

    ...rest,
  });

  await Wallet.create({
    user: user._id,
    balance: 50, 
    role: user.role === "agent" ? "agent" : "user", 
  });


  return user;
};



export const UserServices = {
  createUser,
 
};