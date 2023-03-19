import mongoose, {Document} from 'mongoose';

const schema = new mongoose.Schema({
   serviceName: String,
   url: String,
})

export interface IHealthCheck extends Document {
   serviceName: string;
   url: string;
}

export default mongoose.model<IHealthCheck>('HealthCheck', schema)
