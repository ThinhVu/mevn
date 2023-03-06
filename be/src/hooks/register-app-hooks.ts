import appHooks from "./index"
import {Types} from 'mongoose';

export default function () {
   appHooks.on('user:online', async function(uid: Types.ObjectId) {
      console.log('user', uid, 'online');
   });

   appHooks.on('user:offline', async function(uid: Types.ObjectId) {
      console.log('user', uid, 'offline');
   });
}
