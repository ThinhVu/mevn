import {model, Schema} from 'mongoose';
import {IDbMigrateHistory} from "../../types";

const schema = new Schema({
   id: String,
   success: Boolean,
   date: Date,
}, {versionKey: false})

export default model<IDbMigrateHistory>('DbMigrateHistory', schema)
