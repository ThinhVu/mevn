import {model, Schema, Types} from 'mongoose';

const schema = new Schema({
   key: {
      type: String,
      required: true,
      unique: true
   },
   value: String,
   isSecret: Boolean,
}, {versionKey: false})

schema.index({ key: 'hashed' })

export interface Kv {
   _id: Types.ObjectId;
   key: string;
   value: string;
   isSecret?: boolean
}

export default model<Kv>('KV', schema)
