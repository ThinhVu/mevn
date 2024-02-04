import useMongoDb from "./mongodb";
import migrate from "./migration";
import useCronjob from "./cronjob";
import useSocketIO from "./socketio";

export default async function usePlugin(app: any) {
   await useMongoDb()
   if (process.env.RUN_DB_MIGRATE) await migrate()
   await useCronjob()
   if (process.env.USE_SOCKET_IO) await useSocketIO(app)
}
