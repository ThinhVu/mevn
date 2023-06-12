import {collectDefaultMetrics, register} from "prom-client"

export default function prometheusPlugin(app) {
   if (!process.env.USE_PROMETHEUS) return
   collectDefaultMetrics()
   app.get('/metrics', async (req, res) => {
      res.set('Content-Type', register.contentType)
      res.end(await register.metrics())
   })
}
