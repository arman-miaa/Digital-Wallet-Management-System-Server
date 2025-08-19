import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  profile_photo?: string;
  short_bio?: string; 
  auths?: IAuthProvider[];
  is_active: IsActive;
  is_verified: boolean;
  role: Role;
}
