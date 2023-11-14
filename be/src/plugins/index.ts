import useMongoDb from "./mongodb";
import useSocketIO from './socketio'
import useCronjob from "./cronjob";
import useAdmin from "./admin";

export default async function usePlugin(app) {
   console.log('---------------------------')
   await useMongoDb(app)
   await useAdmin()
   await useCronjob()
   await useSocketIO(app)
   console.log('---------------------------')
}
