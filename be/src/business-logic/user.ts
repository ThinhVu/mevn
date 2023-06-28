import _ from 'lodash'
import UserModel from '../db/models/user'
import {Types} from "mongoose"
import {IPublicUserInfo, IUser} from "../types"

export const getUserByEmail = async (email: string): Promise<IUser> => UserModel.findOne({email}).select('-password')
export const isUserWithEmailExisted = async (email: string): Promise<boolean> => await UserModel.count({email}) > 0
export const createUser = async (data: Partial<IUser>) : Promise<IUser> => UserModel.create(data)
const userPublicInfoFields = {_id: 1, avatar: 1, role: 1, fullName: 1, username: 1, email: 1}
export const getUserPublicInfo = (userInfo: IUser): IPublicUserInfo => _.pick(userInfo, Object.keys(userPublicInfoFields))
export const getUserPublicInfoById = async (_id: Types.ObjectId): Promise<IPublicUserInfo> => UserModel.findOne({_id}, userPublicInfoFields)
export const updatePassword = async (_id: Types.ObjectId, password: string): Promise<void> => UserModel.updateOne({_id}, {password, resetPasswordToken: ''}).then()
export const updateUserResetPasswordToken = async (_id: Types.ObjectId, resetPasswordToken: string): Promise<void> => UserModel.updateOne({_id}, {resetPasswordToken}).then()
export const updateUser = async (_id: Types.ObjectId, fieldsToUpdate: Partial<IUser>): Promise<IUser> => UserModel.findOneAndUpdate({_id}, {...fieldsToUpdate}, {new: true})
