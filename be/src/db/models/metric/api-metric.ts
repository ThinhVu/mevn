import {model, Schema} from 'mongoose';
import {IAPIMetric} from "../../../types";

const schema = new Schema({
   metric: Object,
   at: Date
}, {versionKey: false})

export default model<IAPIMetric>('APIMetric', schema)
