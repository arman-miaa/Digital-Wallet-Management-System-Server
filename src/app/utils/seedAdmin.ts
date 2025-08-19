/* eslint-disable no-console */
import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import {
  IAuthProvider,
  IsActive,
  IUser,
  Role,
} from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isAdminExist = await UserModel.findOne({
      email: envVars.ADMIN_EMAIL,
    });

    if (isAdminExist) {
      console.log("Admin Already Exists!");
      return;
    }

    console.log("Trying to create  Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Admin",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
      phone: "01910203040",
      address: "Dhaka",
      is_verified: true,
      is_active: IsActive.ACTIVE,
      password: hashedPassword,
      auths: [authProvider],
    };
    const admin = await UserModel.create(payload);
    console.log("Admin Created Successfully! \n");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};
