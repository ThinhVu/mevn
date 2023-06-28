import useMongoDb from "./mongodb";
import useRabbitMQ from "./rabbitmq";
import useSocketIO from './socketio'
import useCronjob from "./cronjob";
import useAdmin from "./admin";

export default async function usePlugin(app) {
   console.log('---------------------------')
   await useMongoDb()
   await useAdmin()
   await useCronjob()
   await useRabbitMQ()
   await useSocketIO(app)
   console.log('---------------------------')
}
