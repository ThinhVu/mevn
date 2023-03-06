import Folder , {IFolder} from "../../db/models/file-system/folder";
import _ from 'lodash';
import {Types} from "mongoose";

export const getFolderTree = async () => {
   const folders = (await Folder.find({}, {files: 0})).map(folder => folder.toObject());

   const folderMap = new Map<string, IFolder>();
   for (const folder of folders)
      folderMap.set(folder._id.toString(), folder);

   const folderTree = []
   for (const folder of folders) {
      if (_.isEmpty(folder.parent)) {
         folderTree.push(folder)
      } else {
         const cate = folderMap.get(folder.parent.toString());
         if (cate) {
            if (!cate.folders)
               cate.folders = []
            cate.folders.push(folder)
         }
      }
   }

   return folderTree;
}
export const getFiles = async (folderId: Types.ObjectId) => {
   const folder = await Folder.findOne({_id: folderId}).populate('files');
   if (folder)
      return folder.files;
   else
      throw `Folder with id "${folderId}" is not exists.`;
};
export const create = async (name: string, parent: Types.ObjectId): Promise<IFolder> => Folder.create({name, parent});
export const update = async (folderId: Types.ObjectId, change: Partial<IFolder>): Promise<IFolder> => Folder.findOneAndUpdate({_id: folderId}, change, {new: true});
export const remove = async (folderId: Types.ObjectId): Promise<any> => Folder.remove({_id: folderId});
export const addFileToFolder = async (folderId: Types.ObjectId, fileId: Types.ObjectId) : Promise<IFolder> => Folder.findOneAndUpdate({_id: folderId}, {$push: {files: fileId}}, {new: true});
export const removeFileFromFolder = async (folderId: Types.ObjectId, fileId: Types.ObjectId) : Promise<IFolder> => Folder.findOneAndUpdate({_id: folderId}, {$pull: {files: fileId}}, {new: true});
