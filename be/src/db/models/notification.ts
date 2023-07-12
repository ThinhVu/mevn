import {model, Schema, Types} from 'mongoose';

const Notification = new Schema({
   to: [Schema.Types.ObjectId],
   at: Date,
   event: String,
   data: Object,
   seen: Boolean
}, {versionKey: false})

export interface INotification {
   _id: Types.ObjectId;
   toUser: Types.ObjectId;
   at: Date;
   event: string;
   metadata: any;
   seen: boolean;
}

export default model<INotification>('Notification', Notification);
