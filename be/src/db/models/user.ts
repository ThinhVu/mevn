import {model, Schema} from 'mongoose';
import {IUser, UserRole} from '../../types';

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

export default model<IUser>('User', UserSchema);
