import _ from 'lodash'
import bcrypt from 'bcrypt'
import $ from "../utils/safe-call"
import NotificationModel from "../db/models/notification"
import UserModel from "../db/models/user"
import Routerex from '@tvux/routerex';

async function initUser() {
   console.log('[dev-server] initializing...')
   console.log('[dev-server] generating user data')
   const password = await bcrypt.hash('123ASD!@#', 10)
   const testUsers =_.range(1, 100, 1).map(i => ({
      email: `${i}@x.yz`,
      password: password,
      test: true
   }))
   console.log('[dev-server] create test users')
   await UserModel.create(testUsers)
   console.log('[dev-server] test users created')
}
async function cleanup() {
   console.log('[dev-server] cleanup')
   await NotificationModel.deleteMany()
   await UserModel.deleteMany({test: true})
}

export default async function useDevServer(parentRouter) {
   if (!process.env.USE_DEV_SERVER) return
   console.log('[route] useDevServer')

   await cleanup()
   await initUser()

   const router = Routerex()

   router.post('/reset', $(async () => {
      await cleanup()
      await initUser()
      return true
   }))

   parentRouter.use('/dev-server', router)
}
