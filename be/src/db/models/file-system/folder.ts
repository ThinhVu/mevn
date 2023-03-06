import {Schema, Types, model} from 'mongoose';

const Folder = new Schema({
   name: String,
   parent: Schema.Types.ObjectId,
   files: [{
      type: Schema.Types.ObjectId,
      ref: 'File'
   }],
   createdAt: Date,
}, {versionKey: false});

export interface IFolder {
   _id: Types.ObjectId;
   name: string;
   parent?: Types.ObjectId;
   folders?: IFolder[];
   files?: Types.ObjectId[] | IFolder[];
   createdAt: Date;
}

export default model<IFolder>('Folder', Folder);
