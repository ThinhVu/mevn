import useHealthCheck from "./health-check.route";
import useApiMetricPlugin from "./metrics.route";
import usePrometheusPlugin from "./prometheus.route";
import useDevServer from "./dev-server.route";
import useUser from "./user.route";
import useKv from "./kv.route";
import useFile from "./file.route";
import useFolder from "./folder.route";
import useHmmApp from './hmm.app'
import Routerex from '@tvux/routerex';
import generateApiDocument from '@tvux/exdogen';
import express from "express";
import mongoSanitize from "express-mongo-sanitize"

export default async function useRoutes(app) {
   await useHmmApp(app)

   const router = Routerex()
   await useDevServer(router)
   await useApiMetricPlugin(router)
   await useHealthCheck(router)
   await usePrometheusPlugin(router)
   await useUser(router)
   await useKv(router)
   await useFile(router)
   await useFolder(router)
   app.use(express.json({limit: process.env.REQUEST_BODY_MAX_SIZE || '50mb'}))
   app.use(express.urlencoded({limit: process.env.REQUEST_BODY_MAX_SIZE || '50mb', extended: true}))
   app.use(mongoSanitize())
   const apiPath = '/api'
   app.use(apiPath, router)
   console.log('[route] useDocumentGenerator')
   console.log('[useDocumentGenerator] document generating...')
   const document = await generateApiDocument(apiPath, router)
   app.get('/docs', (req, res) => res.send(document.html))
   app.get('/docs/index.html', (req, res) => res.send(document.html))
   app.get('/docs/postman.json', (req, res) => res.send(document.postman))
   console.log('[useDocumentGenerator] document generated!')
}
