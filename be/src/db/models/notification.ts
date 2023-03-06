import {Schema, Types, model} from 'mongoose';

const Notification = new Schema({
   toUser: Schema.Types.ObjectId,
   at: Date,
   event: String,
   metadata: Object,
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
