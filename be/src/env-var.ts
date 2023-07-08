import {z} from "zod";
import dotenv from "dotenv";
dotenv.config();

const envVar = z.object({
   ADMIN_CODE: z.string(),
   DATABASE_URL: z.string(),
   EMAIL_HOST: z.string(),
   EMAIL_PORT: z.string(),
   EMAIL_USER: z.string(),
   EMAIL_PASSWORD: z.string(),
   FS_API_ENDPOINT: z.string(),
   FS_API_KEY: z.string(),
   JWT_SECRET: z.string(),
   KV_SECRET: z.string(),
   NODE_ENV: z.string(),
   POD_NAME: z.string(),
   PORT: z.string(),
   RABBITMQ_CONNECTION: z.string(),
   REQUEST_BODY_MAX_SIZE: z.string(),
   RUN_CRONJOB: z.string(),
   START_LOG_ON_BOOT: z.string(),
   SOCKET_IO_CORS_ORIGIN: z.string(),
   SOCKET_IO_INSTRUMENT_USERNAME: z.string(),
   SOCKET_IO_INSTRUMENT_PASSWORD: z.string(),
   SOCKET_IO_MONGODB_ADAPTER_COLLECTION: z.string(),
   SOCKET_IO_REDIS_ADAPTER_URL: z.string(),
   SOCKET_IO_REDIS_ADAPTER_PASSWORD: z.string(),
   USE_API_METRIC: z.string(),
   USE_DEV_SERVER: z.string(),
   USE_HMM_API: z.string(),
   USE_PROMETHEUS: z.string(),
   USE_RABBIT_MQ: z.string(),
   USE_SOCKET_IO: z.string(),
   USE_SOCKET_IO_MONGO_ADAPTER: z.string(),
   USE_SOCKET_IO_REDIS_ADAPTER: z.string(),
})

envVar.parse(process.env)

declare global {
   namespace NodeJS {
      interface ProcessEnv
         extends z.infer<typeof envVar> {}
   }
}
