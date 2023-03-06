import {model, Schema, Types} from 'mongoose';

const AppMetricSchema = new Schema({
   users: Number,
   // add more metric here
   at: Date
}, {versionKey: false})

export interface IAppMetric {
   _id: Types.ObjectId;
   users: number;
   // add more metric here
   at: Date;
}

export default model<IAppMetric>('AppMetric', AppMetricSchema);
