import {model, Schema} from 'mongoose';

const schema = new Schema({
   serviceName: String,
   url: String,
})

export interface IHealthCheck {
   serviceName: string;
   url: string;
}

export default model<IHealthCheck>('HealthCheck', schema)
