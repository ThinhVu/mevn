import {model, Schema} from 'mongoose';
import {INotification} from "../../types";

const Notification = new Schema({
   toUser: Schema.Types.ObjectId,
   at: Date,
   event: String,
   metadata: Object,
   seen: Boolean
}, {versionKey: false})

export default model<INotification>('Notification', Notification);
