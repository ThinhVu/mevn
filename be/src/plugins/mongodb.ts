import mongoose from 'mongoose';
import DbMigrateHistoryModel from '../db/models/db-migrate-history';
import patches from '../db/patches';

import {getVersion} from "../utils/common-util";

async function connect() {
   try {
      console.log('[mongodb] Connecting to server...')
      await mongoose.connect(process.env.MONGO_URL, {connectTimeoutMS: 10000})
      console.log('[mongodb] Connected to server!')
   } catch (error) {
      console.error('[mongodb] Failed to connect. Reason:', error)
      process.exit(1)
   }
}
async function migrate() {
   console.log('[mongodb] [migrate] Migrate database')
   async function patchIsNotApplied(patch) {
      return (await DbMigrateHistoryModel.count({id: patch.patchId, success: true})) === 0
   }
   if (patches.length) {
      console.log('[mongodb] [migrate] Found patches')
      const currentVersion = getVersion()
      console.log('[mongodb] [migrate] Patch begin')
      for (const patch of patches) {
         if (patch.shouldRun(currentVersion)) {
            if (await patchIsNotApplied(patch)) {
               try {
                  console.log(`[mongodb] [migrate] Applying patch: ${patch.patchId}`)
                  await patch.run()
                  await DbMigrateHistoryModel.create({id: patch.patchId, success: true, date: new Date()})
                  console.log(`[mongodb] [migrate] Patch ${patch.patchId} success.`)
               } catch (e) {
                  console.log(`[mongodb] [migrate] Patch failed with reason: ${e.message}`)
                  await DbMigrateHistoryModel.create({id: patch.patchId, success: false, date: new Date(), reason: e.message})
               }
            } else {
               console.log(`[mongodb] [migrate] Patch ${patch.patchId} is applied. Skip`)
            }
         } else {
            console.log(`[mongodb] [migrate] Patch ${patch.patchId} doesn't need to upgrade. Skip`)
         }
      }
      console.log('[mongodb] [migrate] Patch end!')
   } else {
      console.log('[mongodb] [migrate] No patches found')
   }
}

export default async function mongodb() {
   console.log('[plugin] mongodb')
   await connect()
   await migrate()
}
