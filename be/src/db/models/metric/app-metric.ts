import {model, Schema} from 'mongoose';
import {IAppMetric} from "../../../types";

const AppMetricSchema = new Schema({
   users: Number,
   // add more metric here
   at: Date
}, {versionKey: false})

export default model<IAppMetric>('AppMetric', AppMetricSchema);
