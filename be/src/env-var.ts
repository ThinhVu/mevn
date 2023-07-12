import {z} from "zod";
import dotenv from "dotenv";
dotenv.config();

const envVar = z.object({
   ADMIN_CODE: z.string(),
   DATABASE_URL: z.string(),
   EMAIL_HOST: z.string().optional(),
   EMAIL_PORT: z.string().optional(),
   EMAIL_USER: z.string().optional(),
   EMAIL_PASSWORD: z.string().optional(),
   FS_API_ENDPOINT: z.string().optional(),
   FS_API_KEY: z.string().optional(),
   JWT_SECRET: z.string().optional(),
   KV_SECRET: z.string().optional(),
   NODE_ENV: z.string().optional(),
   POD_NAME: z.string().optional(),
   PORT: z.string(),
   RABBITMQ_CONNECTION: z.string().optional(),
   REQUEST_BODY_MAX_SIZE: z.string().optional(),
   RUN_CRONJOB: z.string().optional(),
   RUNNING_INSTANCES: z.string().optional(),
   START_LOG_ON_BOOT: z.string().optional(),
   SOCKET_IO_CORS_ORIGIN: z.string().optional(),
   SOCKET_IO_INSTRUMENT_USERNAME: z.string().optional(),
   SOCKET_IO_INSTRUMENT_PASSWORD: z.string().optional(),
   SOCKET_IO_MONGODB_ADAPTER_COLLECTION: z.string().optional(),
   SOCKET_IO_NOTIFY: z.string().optional(),
   SOCKET_IO_REDIS_ADAPTER_URL: z.string().optional(),
   SOCKET_IO_REDIS_ADAPTER_PASSWORD: z.string().optional(),
   SOCKET_IO_TRANSPORTS_METHOD: z.string().optional(),
   USE_API_METRIC: z.string().optional(),
   USE_DEV_SERVER: z.string().optional(),
   USE_HMM_API: z.string().optional(),
   USE_LOGGER: z.string().optional(),
   USE_PROMETHEUS: z.string().optional(),
   USE_RABBIT_MQ: z.string().optional(),
   USE_SOCKET_IO: z.string().optional(),
   USE_SOCKET_IO_MONGO_ADAPTER: z.string().optional(),
   USE_SOCKET_IO_REDIS_ADAPTER: z.string().optional(),
})

envVar.parse(process.env)

declare global {
   namespace NodeJS {
      interface ProcessEnv
         extends z.infer<typeof envVar> {}
   }
}
