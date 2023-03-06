import {CronJob} from "cron";
import * as AppMetric from "../business-logic/metric/app-metric";
import * as DAU from "../business-logic/metric/DAU";
import Tasks from "../db/models/tasks";
import appHooks from "../hooks";

export default function () {
   // https://crontab.guru/
   const runDailyAtNight = '50 11 * * *';
   new CronJob(runDailyAtNight, () => {
      AppMetric.snapshot().catch(console.error)
      DAU.snapshot().catch(console.error)
   }, null, true, 'America/Los_Angeles');

   const runEach5Minutes = '*/12 * * * *';
   new CronJob(runEach5Minutes, async () => {
      const tasks = await Tasks.find({completed: false, failed: false, running: false, at: {$lte: new Date()}})
      for (const task of tasks) {
         const {_id, type, metadata} = task;
         try {
            Tasks.updateOne({_id}, {running: true})
            .then(async () => await appHooks.trigger(`task:${type}`, metadata))
            .then(async () => await Tasks.updateOne({_id}, {completed: true, running: false}))
            .catch(console.error);
         } catch (e) {
            Tasks.updateOne({_id}, {failed: true, error: e.message, running: false}).catch(console.error);
         }
      }
   }, null, true, 'America/Los_Angeles');
}
