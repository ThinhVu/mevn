// TODO:
// - api call frequency (per second, minute, hours, day, etc)
// - api call performance (how many ms, seconds took from start to end)
import _ from 'lodash';

export const apiMetric = {}

const getRoute = req => {
   const route = _.get(req, 'route.path', '')
   const baseUrl = req.baseUrl || ''
   if (route) {
      return `${req.method}:${baseUrl === '/' ? '' : baseUrl}${route}`
   } else {
      return 'unknown route'
   }
}

function apiCallPerformanceMiddleWare(req, res, next) {
   const start = Date.now();

   res.on('finish', () => {
      const end = Date.now();
      const duration = end - start;
      const route = getRoute(req);
      if (!apiMetric[route]) {
         apiMetric[route] = { n: 1, avg_ms: duration }
      } else {
         const routeAnalysis = apiMetric[route];
         const { avg_ms, n } = routeAnalysis
         routeAnalysis.avg_ms = _.round((avg_ms * n + duration) / (n + 1), 2);
         routeAnalysis.n++;
      }
   })

   next()
}

export default apiCallPerformanceMiddleWare;
