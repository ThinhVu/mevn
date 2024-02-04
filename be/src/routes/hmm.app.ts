import {requireAdmin} from "../middlewares/auth";
import hmmExecFactory from '@tvux/hmmjs';
import jsonFn from 'json-fn';
import {Request, Response} from "hyper-express"
import {Model} from "../db/models";

export default async function hmm(app) {
   if (!process.env.USE_HMM_API) return

   console.log('[app-route] hmm')
   const hmm = hmmExecFactory({
      announcement: Model.Announcements,
      dau: Model.DailyActiveUsers,
      healthCheck: Model.HealthChecks,
      kv: Model.KVs,
      mau: Model.MonthlyActiveUsers,
      task: Model.Tasks,
      user: Model.Users,
      userMetric: Model.UserMetrics,
      wau: Model.WeeklyActiveUsers,
      // add more models as you want
   })
   // json doesn't work well with date time, so we use bodyParser as raw just for hmm
   app.post('/hmm', {middlewares: [requireAdmin]}, async (req: Request, res: Response) => {
      const str = await req.text();
      const qry = jsonFn.parse(str, true);
      const rs = await hmm(qry)
      res.json(rs)
   })
}
