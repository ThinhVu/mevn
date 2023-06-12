// daily active user
import {model, Schema} from 'mongoose';
import {IDAULog} from "../../../types";

const DAULogSchema = new Schema({
  uid: Schema.Types.ObjectId,
  at: Date
}, {versionKey: false})

export default model<IDAULog>("DAULog", DAULogSchema)
