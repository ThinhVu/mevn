import {Schema, Types, model} from 'mongoose';

const File = new Schema({
   name: String,
   src: String,
   size: Number,
   type: String,
   thumbnail: String,
   createdAt: Date,
}, {versionKey: false})

export interface IFile {
   _id: Types.ObjectId;
   name: string;
   src: string;
   size: number;
   type: string;
   thumbnail: string;
   createdAt: Date;
}

export default model<IFile>('File', File);
