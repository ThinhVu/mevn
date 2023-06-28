import appHooks from "./index"
import {Types} from 'mongoose'

export default function () {
   appHooks.on('user:online', async function(userId: Types.ObjectId) {
      console.log('user', userId, 'online')
   })

   appHooks.on('user:offline', async function(userId: Types.ObjectId) {
      console.log('user', userId, 'offline')
   })
}
