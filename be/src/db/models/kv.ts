import {model, Schema} from 'mongoose';
import {ISystemConfig} from "../../types";

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

export default model<ISystemConfig>('SystemConfig', schema)
