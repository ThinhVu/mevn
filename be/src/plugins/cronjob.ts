import {CronJob} from "cron";
import {snapshot as appMetricSnapshot} from "../logic/metric/app-metric";
import {snapshot as userMetricSnapshot} from "../logic/metric/user-metric";
import appHook from "../logic/hooks";
import {getLogger} from "../utils/logger";
import {Model} from "../db/models";

// https://crontab.guru
export default async function cronjob() {
   if (!process.env.RUN_CRONJOB) return
   getLogger().info('[plugin] cronjob')
   const Tasks = Model.Tasks;

   new CronJob('*/12 * * * *' /* runEach5Minutes */, async () => {
      const tasks = await Tasks.find({completed: false, failed: false, running: false, at: {$lte: new Date()}}).toArray()
      for (const task of tasks) {
         const {_id, type, metadata} = task
         try {
            Tasks.updateOne({_id}, {$set: {running: true}})
            .then(async () => await appHook.trigger(`task:${type}`, metadata))
            .then(async () => await Tasks.updateOne({_id}, {$set: {completed: true, running: false}}))
            .catch(e => getLogger().error(e.message, {fn: 'cronjob::Tasks.updateOne:try'}))
         } catch (e) {
            Tasks.updateOne({_id}, {$set: {failed: true, error: e.message, running: false}}).catch(
               e => getLogger().error(e.message, {fn: 'cronjob::Tasks.updateOne:catch'}))
         }
      }
   }, null, true)

   // new CronJob('0 * * * *' /* runEachHour */, () => {}, null, true)
   // new CronJob('0 0 * * *' /* run at new day */, () => {}, null, true)

   const runDailyAtNight = '50 11 * * *'
   new CronJob(runDailyAtNight, () => {
      appMetricSnapshot()
      userMetricSnapshot()
   }, null, true)

   appMetricSnapshot()
   userMetricSnapshot()
}
