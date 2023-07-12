export default function useDefault(app) {
   console.log('[route] useDefault')
   app.use('/', (_, res) => res.status(200).send(process.env.POD_NAME))
}
