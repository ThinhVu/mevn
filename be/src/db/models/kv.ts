import {Schema, Types, model} from 'mongoose';

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

export interface ISystemConfig {
   _id: Types.ObjectId;
   key: string;
   value: string;
   isSecret?: boolean
}

export default model<ISystemConfig>('SystemConfig', schema)
