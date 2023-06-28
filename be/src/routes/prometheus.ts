import {collectDefaultMetrics, register} from "prom-client"
import Routerex from '@tvux/routerex'

export default function usePrometheus(parentRouter) {
   if (!process.env.USE_PROMETHEUS) return
   console.log('[route] usePrometheus')
   collectDefaultMetrics()

   const router = Routerex()

   router.get('/', async (req, res) => {
      res.set('Content-Type', register.contentType)
      res.end(await register.metrics())
   })

   parentRouter.use('/metrics', router)
}
