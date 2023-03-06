// daily active user
import {Schema, Types, model} from 'mongoose';

const DAULogSchema = new Schema({
  uid: Schema.Types.ObjectId,
  at: Date
}, {versionKey: false})

export interface IDAULog {
   _id: Types.ObjectId;
   uid: Types.ObjectId;
   at: Date
}

export default model<IDAULog>("DAULog", DAULogSchema)
