import {Schema, Types, model} from 'mongoose';

const TaskSchema = new Schema({
   type: {type: String},
   at: Date,
   completed: Boolean,
   failed: Boolean,
   error: String,
   metadata: Object
}, {versionKey: false})

export interface ITask {
   _id: Types.ObjectId;
   type: string;
   completed: boolean;
   failed: boolean;
   error: string;
   at: Date;
   metadata: any;
}

export default model<ITask>('Task', TaskSchema)
