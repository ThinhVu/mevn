import {Schema, Types, model} from 'mongoose';
import {UserRole} from '../../constants/types';

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
   }
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
}

export default model<IUser>('User', UserSchema);
