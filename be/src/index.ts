import dotenv from "dotenv";
dotenv.config();
import config from "./config";
import {createServer} from "http";
import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import Db from "./db";
import api from './api/index';
import {requireAdmin} from "./middlewares/auth";
import {apiError} from "./utils/common-util";
import {enableLog} from "./utils/logger-util";
import registerAppHooks from "./hooks/register-app-hooks";

process.on('uncaughtException', err => console.error((err && err.stack) ? err.stack : err))

if (config.startLogOnBoot) {
   console.log('[cfg] startLogOnBoot')
   enableLog();
}

Db.init().then(Db.migrate).then(async () => {
   const app = express();
   const httpServer = createServer(app);
   app.use(compression());
   app.use(cookieParser());
   app.use(cors());
   app.use(express.json({limit: config.requestBodyMaxSize}));
   app.use(express.urlencoded({limit: config.requestBodyMaxSize, extended: true, parameterLimit: 50000}));
   app.use('/api', api);

   if (config.useHmmAPI) {
      console.log('[cfg] useHmmAPI')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const jsonFn = require("json-fn");
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const hmm = require("./api/hmm");
      app.use('/hmm-api', requireAdmin, bodyParser.raw({limit: config.requestBodyMaxSize, type: () => true}),
         (req, res) => hmm(jsonFn.parse(req.body.toString()))
         .then(rs => res.send(rs))
         .catch(e => apiError(e, res))
      )
   }

   if (config.usePrometheus) {
      console.log('[cfg] usePrometheus');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const {collectDefaultMetrics, register} = require("prom-client");
      collectDefaultMetrics();
      app.get('/metrics', async (req, res) => {
         try {
            res.set('Content-Type', register.contentType);
            res.end(await register.metrics());
         } catch (e) {
            apiError(e, res)
         }
      })
   }

   if (config.useRabbitMQ) {
      console.log('[cfg] useRabbitMQ', config.rabbitMQConnection)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const RabbitMQ = require("./utils/rabbitmq");
      // @ts-ignore
      global.rabbitMQ = new RabbitMQ(config.rabbitMQConnection)
   }

   if (config.socketIO.enable) {
      console.log('[cfg] useSocketIO')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const createSocketServer = require("./utils/socket");
      // @ts-ignore
      global.io = createSocketServer(httpServer);
   }

   registerAppHooks();

   if (config.runCronJob) {
      console.log('[cfg] runCronJob')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cronjob = require("./cronjob");
      cronjob();
   }

   httpServer.listen({ port: config.port }, () => console.log(`httpServer ready at http://localhost:${config.port}`));
});
