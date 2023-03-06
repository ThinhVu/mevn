import {Schema, Types, model} from 'mongoose';

const schema = new Schema({
   id: String,
   success: Boolean,
   date: Date,
}, {versionKey: false})

export interface IDbMigrateHistory {
   _id: Types.ObjectId;
   id: string;
   success: boolean;
   date: Date;
}

export default model<IDbMigrateHistory>('DbMigrateHistory', schema)
