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

export interface IFile {
   _id: Types.ObjectId;
   name: string;
   src: string;
   size: number;
   type: string;
   thumbnail: string;
   createdAt: Date;
}

export interface IFolder {
   _id: Types.ObjectId;
   name: string;
   parent?: Types.ObjectId;
   folders?: IFolder[];
   files?: Types.ObjectId[] | IFolder[];
   createdAt: Date;
}

export interface IAPIMetric {
   _id: Types.ObjectId;
   metric: Record<string, unknown>;
   at: Date;
}

export interface IAppMetric {
   _id: Types.ObjectId;
   users: number;
   // add more metric here
   at: Date;
}

export interface IDAU {
   _id: Types.ObjectId;
   activeUsers: number;
   at: Date
}

export interface IDAULog {
   _id: Types.ObjectId;
   uid: Types.ObjectId;
   at: Date
}

export interface IAnnouncement {
   _id: Types.ObjectId;
   content: string;
   at: Date;
}

export interface IDbMigrateHistory {
   _id: Types.ObjectId;
   id: string;
   success: boolean;
   date: Date;
}

export interface IHealthCheck {
   serviceName: string;
   url: string;
}

export interface ISystemConfig {
   _id: Types.ObjectId;
   key: string;
   value: string;
   isSecret?: boolean
}

export interface INotification {
   _id: Types.ObjectId;
   toUser: Types.ObjectId;
   at: Date;
   event: string;
   metadata: any;
   seen: boolean;
}

export interface ITask {
   _id: Types.ObjectId;
   type: string;
   completed: boolean;
   failed: boolean;
   error: string;
   at: Date;
   metadata: any;
}

export interface IPublicUserInfo {
   avatar?: string;
   role?: UserRole;
   fullName?: string;
   username?: string;
   email?: string;
}

export interface IUser extends IPublicUserInfo {
   _id: Types.ObjectId;
   emailVerified?: boolean;
   password: string;
   resetPasswordToken?: string;
   createdAt: Date;
}
