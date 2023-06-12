import {model, Schema} from 'mongoose';
import {IFolder} from "../../../types";

const Folder = new Schema({
   name: String,
   parent: Schema.Types.ObjectId,
   files: [{
      type: Schema.Types.ObjectId,
      ref: 'File'
   }],
   createdAt: Date,
}, {versionKey: false});

export default model<IFolder>('Folder', Folder);
