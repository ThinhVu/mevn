import Routerex from '@tvux/routerex'

export default function useHealthCheck(parentRouter) {
   console.log('[route] useHealthCheck')

   const router = Routerex()
   router.get('/', {
      title: 'Health check',
      desc: 'Server health monitor provides built-in capacity forecast charts and metrics designed to help you more easily identify when server resources reach warning',
      response: {200: {type: 'string', desc: 'The server is live'}, 408: {type: 'string', desc: 'The server is down'}}
   }, (_, res) => res.status(200).end())

   parentRouter.use('/health-check', router)
}
