// @ts-nocheck
import UserModel, {IPublicUserInfo, IUser} from '../db/models/user';
import _ from 'lodash'
import {Types} from "mongoose";

// Note: This method is only invoked by auth, not for public use
export const getAuthUser = async (_id: Types.ObjectId): Promise<IUser> => UserModel.findOneAndUpdate({_id}).select('-password');
export const getAuthUserByEmail = async (email: string): Promise<IUser> => UserModel.findOne({email}).select('-password')


const userPublicInfoFields = {_id: 1, avatar: 1, role: 1, fullName: 1, username: 1, email: 1};
export const getUserPublicInfo = (userInfo: IUser): IPublicUserInfo => _.pick(userInfo, Object.keys(userPublicInfoFields));
export const getUserPublicInfoById = async (_id: Types.ObjectId): Promise<IPublicUserInfo> => UserModel.findOne({_id}, userPublicInfoFields);
export const getUserPublicInfoByIds = async (ids: Types.ObjectId[]): Promise<IPublicUserInfo[]> => UserModel.find({_id: {$in: ids}}, userPublicInfoFields)
export const isUserWithEmailExisted = async (email: string): Promise<boolean> => await UserModel.count({email}) > 0

export const createUser = async (data: Partial<IUser>) : Promise<IUser> => {
   return await UserModel.create(data);
};
// update
export const updatePassword = async (_id: Types.ObjectId, password: string): Promise<void> => {
   return UserModel.updateOne({_id}, {password, resetPasswordToken: ''});
};
export const updateUserResetPasswordToken = async (_id: Types.ObjectId, resetPasswordToken: string): Promise<void> => {
   return UserModel.updateOne({_id}, {resetPasswordToken})
}
export const updateUser = async (_id: Types.ObjectId, fieldsToUpdate: Partial<IUser>): Promise<IUser> => {
   return UserModel.findOneAndUpdate({_id}, {...fieldsToUpdate}, {new: true});
};
