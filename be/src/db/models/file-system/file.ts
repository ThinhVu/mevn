import {model, Schema} from 'mongoose';
import {IFile} from "../../../types";

const File = new Schema({
   name: String,
   src: String,
   size: Number,
   type: String,
   thumbnail: String,
   createdAt: Date,
}, {versionKey: false})

export default model<IFile>('File', File);
