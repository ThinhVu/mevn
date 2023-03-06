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
