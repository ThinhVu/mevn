import {model, Schema, Types} from 'mongoose';

export enum UserRole {
   Regular = 'Regular',
   Admin = 'Admin'
}

const UserSchema = new Schema({
   avatar: String,
   // access info
   email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
   },
   emailVerified: {
      type: Boolean,
      default: false,
   },
   password: {
      type: String,
   },
   resetPasswordToken: String,
   createdAt: Date,
   fcm: String,
   // profile info
   username: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
   },
   role: {
      type: String,
      required: true,
      default: UserRole.Regular,
      enum: Object.values(UserRole),
   },
   fullName: {
      type: String,
   },
   test: Boolean,
}, {versionKey: false});

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
   fcm: string;
   test: boolean;
}

export default model<IUser>('User', UserSchema);
