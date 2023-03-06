import {Schema, Types, model} from 'mongoose';

const schema = new Schema({
   key: String,
   value: String
}, {versionKey: false})

export interface ISystemConfig {
   _id: Types.ObjectId;
   key: string;
   value: string
}

export default model<ISystemConfig>('SystemConfig', schema)
