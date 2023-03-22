import {Schema, Types, model} from 'mongoose'

const schema = new Schema({
   path: String,
   methods: Object,
   metadata: {
      type: Object,
      default: {}
   },
}, {versionKey: false, minimize: false})

export interface IRouteMetadata {
   _id?: Types.ObjectId;
   path: string;
   methods: Record<string, boolean>,
   metadata?: Record<string, unknown>;
}

export default model<IRouteMetadata>('RouteMetadata', schema)
