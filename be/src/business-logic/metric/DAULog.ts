import DAULogModel from '../../db/models/metric/DAU-log';
import dayjs from "dayjs";
import {Types} from "mongoose";

export function log(uid: Types.ObjectId) {
   DAULogModel.updateOne({ uid, at: dayjs().startOf('day').toDate() }, { v: 1 } /*we don't care about it*/, { upsert: true }).catch(console.error)
}
