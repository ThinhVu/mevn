import {requireAdmin} from "../middlewares/auth";
import {apiError} from "../utils/common-util";
import bodyParser from "body-parser";
import hmmExecFactory from 'hmm/src/executor';
import SystemConfigModel from "../db/models/kv";
import UserModel from '../db/models/user';
import Announcement from "../db/models/announcement";
import TaskModel from "../db/models/tasks";
import HealthCheck from "../db/models/health-check";

export default function hmm(app) {
   if (!process.env.USE_HMM_API) return
   // eslint-disable-next-line @typescript-eslint/no-var-requires
   const jsonFn = require("json-fn");
   // eslint-disable-next-line @typescript-eslint/no-var-requires
   const hmm = hmmExecFactory({
      systemConfig: SystemConfigModel,
      user: UserModel,
      announcement: Announcement,
      task: TaskModel,
      healthCheck: HealthCheck,
      // add more models as you want
   })
   app.post('/hmm', requireAdmin, bodyParser.raw({limit: process.env.REQUEST_BODY_MAX_SIZE || '50mb', type: () => true}),
      (req, res) => hmm(jsonFn.parse(req.body.toString()))
      .then(rs => res.send(rs))
      .catch(e => apiError(e, res))
   )
}
