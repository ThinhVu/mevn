import {Schema, Types, model} from 'mongoose';

const schema = new Schema({
   path: String,
   schema: Object,
   description: String
}, {versionKey: false})

export interface IRouteSchema {
   _id?: Types.ObjectId;
   path: string;
   schema?: Record<string, unknown>;
   description?: string;
}

export default model<IRouteSchema>('RouteSchema', schema)
