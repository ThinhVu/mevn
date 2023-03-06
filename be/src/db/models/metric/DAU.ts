// daily active user
import {Schema, Types, model} from 'mongoose';

const DAUSchema = new Schema({
   activeUsers: Number,
   at: Date
}, {versionKey: false})

export interface IDAU {
   _id: Types.ObjectId;
   activeUsers: number;
   at: Date
}

export default model<IDAU>("DAU", DAUSchema)
