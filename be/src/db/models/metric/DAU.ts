// daily active user
import {model, Schema} from 'mongoose';
import {IDAU} from "../../../types";

const DAUSchema = new Schema({
   activeUsers: Number,
   at: Date
}, {versionKey: false})

export default model<IDAU>("DAU", DAUSchema)
