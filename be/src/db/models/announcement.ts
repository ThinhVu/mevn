import {model, Schema} from 'mongoose';
import {IAnnouncement} from "../../types";

const schema = new Schema({
   content: String,
   at: Date
}, {versionKey: false})

export default model<IAnnouncement>('Announcement', schema)
