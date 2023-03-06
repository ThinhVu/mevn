import {Schema, Types, model} from 'mongoose';

const schema = new Schema({
   content: String,
   at: Date
}, {versionKey: false})

export interface IAnnouncement {
   _id: Types.ObjectId;
   content: string;
   at: Date;
}

export default model<IAnnouncement>('Announcement', schema)
