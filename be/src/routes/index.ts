import useHealthCheck from "./health-check";
import useApiMetricPlugin from "./metrics";
import usePrometheusPlugin from "./prometheus";
import useDevServer from "./dev-server";
import useLog from './log';
import useUser from "./user";
import useKv from "./kv";
import useFile from "./file";
import useFolder from "./folder";
import useHmmApp from './hmm.app'
import Routerex from '@tvux/routerex';
import generateApiDocument from '@tvux/exdogen';
import express from "express";

export default async function useRoutes(app) {
   const router = Routerex()
   await useDevServer(router)
   await useApiMetricPlugin(router)
   await useHealthCheck(router)
   await usePrometheusPlugin(router)
   await useLog(router)
   await useUser(router)
   await useKv(router)
   await useFile(router)
   await useFolder(router)
   console.log('[useDocumentGenerator] generating document...')
   const apiPath = '/api'
   app.use(apiPath,
      express.json({limit: process.env.REQUEST_BODY_MAX_SIZE || '50mb'}),
      express.urlencoded({limit: process.env.REQUEST_BODY_MAX_SIZE || '50mb'}),
      router)
   const document = await generateApiDocument(apiPath, router)
   console.log('[useDocumentGenerator] document generated!')
   app.get('/docs', (req, res) => res.send(document.html))
   app.get('/docs/index.html', (req, res) => res.send(document.html))
   app.get('/docs/postman.json', (req, res) => res.send(document.postman))

   await useHmmApp(app)
}
