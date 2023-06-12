import {model, Schema} from 'mongoose';
import {IHealthCheck} from "../../types";

const schema = new Schema({
   serviceName: String,
   url: String,
})

export default model<IHealthCheck>('HealthCheck', schema)
