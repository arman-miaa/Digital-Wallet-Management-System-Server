import { Types } from "mongoose";

export type IUserRole = "admin" | "agent" | "user";

// enum define করো
export enum IsActive {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}

// interface
export interface IUser {
  _id?: Types.ObjectId;

  name: string;
  email: string;
  phone?: string;
  password: string;

  role?: IUserRole;
  isActive?: IsActive;

  status?: "approved" | "suspended";

  wallet?: Types.ObjectId;
  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
