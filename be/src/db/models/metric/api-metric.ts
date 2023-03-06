import {Schema, Types, model} from 'mongoose';

const schema = new Schema({
   metric: Object,
   at: Date
}, {versionKey: false})

export interface IAPIMetric {
   _id: Types.ObjectId;
   metric: Record<string, unknown>;
   at: Date;
}

export default model<IAPIMetric>('APIMetric', schema)
