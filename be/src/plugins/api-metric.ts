// TODO:
// - api call frequency (per second, minute, hours, day, etc)
// - api call performance (how many ms, seconds took from start to end)
import _ from 'lodash';
import dayjs from "dayjs";
import ApiMetricModel from "../db/models/metric/api-metric";
import {requireAdmin} from "../middlewares/auth";
import $ from "../middlewares/safe-call";

export default async function (app) {
   if (!process.env.USE_API_METRIC) return

   await ApiMetricModel.deleteMany({})
   const apiMetric = {}

   function getRoute(req) {
      const route = _.get(req, 'route.path', '')
      const baseUrl = req.baseUrl || ''
      if (route) {
         return `${req.method}:${baseUrl === '/' ? '' : baseUrl}${route}`
      } else {
         return 'unknown route'
      }
   }
   function metricMiddleware(req, res, next) {
      const start = Date.now();

      res.on('finish', () => {
         const route = getRoute(req);

         if (res.__error) {
            if (!apiMetric[route]) {
               apiMetric[route] = {n: 1, s: 0, e: 1, avg_ms: 0}
            } else {
               const routeAnalysis = apiMetric[route];
               routeAnalysis.n++;
               routeAnalysis.e++;
            }
         } else {
            const end = Date.now();
            const duration = end - start;
            if (!apiMetric[route]) {
               apiMetric[route] = { n: 1, s: 1, e: 0, avg_ms: duration }
            } else {
               const routeAnalysis = apiMetric[route];
               const { avg_ms, s } = routeAnalysis
               routeAnalysis.avg_ms = _.round((avg_ms * s + duration) / (s + 1), 2);
               routeAnalysis.s++;
               routeAnalysis.n++;
            }
         }
      })

      next()
   }
   app.use(metricMiddleware)
   app.get('/api-call', {
      title: 'API Call',
      description: 'Get current API call count',
      response: {
         type: 'object',
         desc: 'metric object'
      }
   }, requireAdmin, $(async () => apiMetric))
   app.get('/api-call-history', {
      title: 'API Call History',
      description: 'Get API call history',
      response: {
         type: 'array',
         desc: 'metric array'
      }
   }, requireAdmin, $(async () => ApiMetricModel.find({}).sort({at: -1}).limit(60)))

   async function takeSnapshot() {
      try {
         const metricDoc = { metric: apiMetric, at: dayjs().toDate() }
         await ApiMetricModel.create(metricDoc)
         // @ts-ignore
         global.io.to('metric').emit('metric:update', metricDoc)
      } catch (e) {
         console.error(e)
      }
   }
   setInterval(takeSnapshot, 60000)
}
