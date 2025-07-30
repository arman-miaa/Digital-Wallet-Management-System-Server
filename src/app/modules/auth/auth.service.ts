/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";



import {  IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errorhelpers/appError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userTokens";


const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  console.log('loign data',email,password);

 const isUserExist = await User.findOne({ email });



  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const userTokens = createUserToken(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};




export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
 
};
