import {CronJob} from "cron";
import * as AppMetric from "../business-logic/metric/app-metric";
import APIMetric from "../business-logic/metric/api-metric";
import * as DAU from "../business-logic/metric/DAU";
import Tasks from "../db/models/tasks";
import appHooks from "../hooks";

// https://crontab.guru/
export default async function cronjob(app) {
   if (!process.env.RUN_CRONJOB) return
   console.log('[plugin] cronjob')

   // TODO: time zone
   const timeZone = 'America/Los_Angeles'

   const runDailyAtNight = '50 11 * * *'
   new CronJob(runDailyAtNight, () => {
      AppMetric.snapshot().catch(console.error)
      DAU.snapshot().catch(console.error)
   }, null, true, timeZone)

   const runEach5Minutes = '*/12 * * * *';
   new CronJob(runEach5Minutes, async () => {
      const tasks = await Tasks.find({completed: false, failed: false, running: false, at: {$lte: new Date()}})
      for (const task of tasks) {
         const {_id, type, metadata} = task
         try {
            Tasks.updateOne({_id}, {running: true})
            .then(async () => await appHooks.trigger(`task:${type}`, metadata))
            .then(async () => await Tasks.updateOne({_id}, {completed: true, running: false}))
            .catch(console.error)
         } catch (e) {
            Tasks.updateOne({_id}, {failed: true, error: e.message, running: false}).catch(console.error)
         }
      }
   }, null, true, timeZone)

   if (process.env.USE_API_METRIC) {
      await APIMetric.clearMetric()
      setInterval(() => APIMetric.create().catch(console.error), 60000)
   }
}
