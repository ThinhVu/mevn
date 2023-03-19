import dotenv from "dotenv";
dotenv.config({path: `.env.${process.env.NODE_ENV}`});
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
import {enableLog, _console} from "./utils/logger-util";
import registerAppHooks from "./hooks/register-app-hooks";

process.on('uncaughtException', err => console.error((err && err.stack) ? err.stack : err))

if (config.startLogOnBoot) {
   _console.log('[cfg] startLogOnBoot')
   enableLog();
}

Db.init().then(Db.migrate).then(async () => {
   const app = express();
   const httpServer = createServer(app);
   app.use(cors());
   app.use(compression());
   app.use(cookieParser());

   if (config.useHmmAPI) {
      _console.log('[cfg] useHmmAPI')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const jsonFn = require("json-fn");
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const hmm = require("./api/hmm").default;
      app.use('/hmm', requireAdmin, bodyParser.raw({limit: config.requestBodyMaxSize, type: () => true}),
         (req, res) => hmm(jsonFn.parse(req.body.toString()))
         .then(rs => res.send(rs))
         .catch(e => apiError(e, res))
      )
   }

   app.use('/', bodyParser.json({limit: config.requestBodyMaxSize}), bodyParser.urlencoded({limit: config.requestBodyMaxSize}), api);

   if (config.usePrometheus) {
      _console.log('[cfg] usePrometheus');
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
      _console.log('[cfg] useRabbitMQ', config.rabbitMQConnection)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const RabbitMQ = require("./utils/rabbitmq").default;
      // @ts-ignore
      global.rabbitMQ = new RabbitMQ(config.rabbitMQConnection)
   }

   if (config.socketIO.enable) {
      _console.log('[cfg] useSocketIO')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const createSocketServer = require("./utils/socket").default;
      // @ts-ignore
      global.io = createSocketServer(httpServer);
   }

   registerAppHooks();

   if (config.runCronJob) {
      _console.log('[cfg] runCronJob')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("./cronjob").default();
   }

   httpServer.listen({ port: config.port }, () => _console.log(`[http server] ready at http://localhost:${config.port}`));
});
