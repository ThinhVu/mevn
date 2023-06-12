import {Request} from "express";
import {Types} from "mongoose";

export enum UserRole {
  Regular = 'Regular',
  Admin = 'Admin'
}

export interface AuthUser {
  _id: Types.ObjectId,
  email: string,
  password: string,
  role: UserRole
}

export interface AuthRequest extends Request {
  user: AuthUser
}

export interface IAuthUser {
   _id: Types.ObjectId;
   phone: string;
   password: string;
}

export interface IAuthAdmin {
   _id: Types.ObjectId;
   email: string;
   password: string;
}

export interface IAuthData {
   user: Record<string, any>,
   expired: boolean
}

export interface UserRequest extends Request {
   user: IAuthUser
}
