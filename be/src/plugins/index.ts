import useMongoDb from "./mongo-db";
import useApiMetricPlugin from "./api-metric";
import usePrometheusPlugin from "./prometheus";
import useHmmPlugin from "./hmm";
import useRabbitMqPlugin from "./rabbit-mq-plugin";
import useSocketIoPlugin from './socket-io'
import useCronjobPlugin from "./cronjob";
import {enableLog} from "../utils/logger-util";

export default async function usePlugin(app) {
   if (process.env.START_LOG_ON_BOOT) {
      console.log('[cfg] startLogOnBoot')
      // enableLog();
   }
   await useMongoDb(app)
   await useApiMetricPlugin(app)
   await usePrometheusPlugin(app)
   await useHmmPlugin(app)
   await useRabbitMqPlugin(app)
   await useSocketIoPlugin(app)
   await useCronjobPlugin(app)
}
