export default {
   // system config
   startLogOnBoot: process.env.START_LOG_ON_BOOT,
   port: process.env.PORT,

   // auth
   jwtSecret: process.env.SECRET,
   adminCode: process.env.ADMIN_CODE,

   //
   mailConfig: {
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASSWORD,
      },
      secureConnection: false,
      secure: false, // process.env.NODE_ENV === 'production',
      tls: { ciphers: 'SSLv3' },
   },

   // k8s pod name
   // name: POD_NAME
   //    valueFrom:
   //       fieldRef:
   //          apiVersion: v1
   //          fieldPath: metadata.name
   podName: process.env.POD_NAME,

   // db
   mongoDBConn: process.env.MONGO_URL,

   // cronjob
   runCronJob: process.env.RUN_CRONJOB,

   // api & metric
   requestBodyMaxSize: process.env.REQUEST_BODY_MAX_SIZE || '50mb',
   useHmmAPI: process.env.USE_HMM_API,
   usePrometheus: process.env.USE_PROMETHEUS,

   // rabbitmq
   useRabbitMQ: process.env.USE_RABBIT_MQ,
   rabbitMQConnection: process.env.RABBITMQ_CONNECTION,

   // socket io
   socketIO: {
      enable: process.env.USE_SOCKET_IO,
      corsOrigins: (process.env.SOCKET_IO__CORS_ORIGIN || '').split(','),
      instrument: {
         user: process.env.SOCKET_IO__INSTRUMENT_USERNAME,
         pass: process.env.SOCKET_IO__INSTRUMENT_PASSWORD
      },
      redisAdapter: {
         url: process.env.SOCKET_IO__REDIS_ADAPTER_URL,
         password: process.env.SOCKET_IO__REDIS_ADAPTER_PASSWORD
      }
   }
}
