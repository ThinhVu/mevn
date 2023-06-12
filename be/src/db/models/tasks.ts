import {model, Schema} from 'mongoose';
import {ITask} from "../../types";

const TaskSchema = new Schema({
   type: {type: String},
   at: Date,
   completed: Boolean,
   failed: Boolean,
   error: String,
   metadata: Object
}, {versionKey: false})

export default model<ITask>('Task', TaskSchema)
