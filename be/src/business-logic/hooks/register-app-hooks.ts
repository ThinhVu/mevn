import appHooks from "./index"
import {Types} from 'mongoose'
import * as DAULog from "../metric/DAULog";

export default function () {
   appHooks.on('user:online', async function(userId: Types.ObjectId) {
      DAULog.log(userId)
      console.log('user', userId, 'online')
   })

   appHooks.on('user:offline', async function(userId: Types.ObjectId) {
      console.log('user', userId, 'offline')
   })
}
