import File, {IFile} from '../../db/models/file-system/file';
import {Types} from "mongoose";

export const get = async (fileId: Types.ObjectId) : Promise<IFile> => File.findOne({_id: fileId});
export const create = async (payload: Partial<IFile>) : Promise<IFile> => File.create(payload);
export const update = async (fileId: Types.ObjectId, change: Partial<IFile>) : Promise<IFile> => File.findOneAndUpdate({_id: fileId}, change)
export const remove = async (fileId: Types.ObjectId) : Promise<any> => File.deleteOne({_id: fileId});
