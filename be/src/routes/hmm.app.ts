import {requireAdmin} from "../middlewares/auth";
import {handleApiError} from "../utils/common-util";
import bodyParser from "body-parser";
import hmmExecFactory from '@tvux/hmmjs';
import jsonFn from 'json-fn';
import KvModel from "../db/models/kv";
import UserModel from '../db/models/user';
import Announcement from "../db/models/announcement";
import TaskModel from "../db/models/tasks";
import HealthCheck from "../db/models/health-check";

export default function hmm(app) {
   if (!process.env.USE_HMM_API) return

   console.log('[app-route] hmm')
   const hmm = hmmExecFactory({
      kv: KvModel,
      user: UserModel,
      announcement: Announcement,
      task: TaskModel,
      healthCheck: HealthCheck,
      // add more models as you want
   })
   // json doesn't work well with date time so we use bodyParser as raw just for hmm
   app.post('/hmm', requireAdmin, bodyParser.raw({limit: process.env.REQUEST_BODY_MAX_SIZE || '50mb', type: () => true}),
      async (req, res) => {
         try {
            const qry = jsonFn.parse(req.body.toString());
            const rs = await hmm(qry)
            res.send(rs)
         } catch (e) {
            console.error(e)
            handleApiError(e, res)
         }
      }
   )
}
