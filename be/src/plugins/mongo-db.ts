import mongoose from 'mongoose';
import DbMigrateHistoryModel from '../db/models/db-migrate-history';
import patches from '../db/patches';
import Util from '../utils/common-util';
import UserModel from '../db/models/user';
import {createUser} from "../business-logic/user";
import {UserRole} from "../types";
import bcrypt from 'bcrypt';

async function connect(app) {
   try {
      console.log('[mongo-db] connecting to server...')
      app.db = await mongoose.connect(process.env.MONGO_URL, {connectTimeoutMS: 10000})
   } catch (error) {
      console.error('[mongo-db] Failed to connect. Reason:', error)
      process.exit(1)
   }
}

async function migrate() {
   async function patchIsNotApplied(patch) {
      return (await DbMigrateHistoryModel.count({id: patch.patchId, success: true})) === 0
   }

   const currentVersion = Util.getVersion()
   console.log('[mongo-db] Patch begin')
   for (const patch of patches) {
      if (patch.shouldRun(currentVersion)) {
         if (await patchIsNotApplied(patch)) {
            try {
               console.log(`[mongo-db] Applying patch: ${patch.patchId}`)
               await patch.run()
               await DbMigrateHistoryModel.create({id: patch.patchId, success: true, date: new Date()})
               console.log(`[mongo-db] Patch ${patch.patchId} success.`)
            } catch (e) {
               console.log(`[mongo-db] Patch failed with reason: ${e.message}`)
               await DbMigrateHistoryModel.create({id: patch.patchId, success: false, date: new Date(), reason: e.message})
            }
         } else {
            console.log(`[mongo-db] Patch ${patch.patchId} is applied. Skip`)
         }
      } else {
         console.log(`[mongo-db] Patch ${patch.patchId} doesn't need to upgrade. Skip`)
      }
   }

   console.log('[mongo-db] Patch end!')
}

async function ensureAdminUserExists() {
   console.log('[mongo-db] Connected to db. Checking if admin user existed...')
   const adminUser = await UserModel.findOne({email: 'admin'})
   if (!adminUser) {
      console.log('[mongo-db] Admin user not exists. Create new!')
      const hashPassword = await bcrypt.hash(process.env.ADMIN_CODE, 10)
      await createUser({
         username: "admin",
         email: "admin",
         password: hashPassword,
         createdAt: new Date(),
         role: UserRole.Admin
      })
      console.log('[mongo-db] Admin user created!')
   }
}

export default async function mongoDb(app) {
   console.log('[plugin] mongo-db')
   await connect(app)
   await migrate()
   await ensureAdminUserExists()
}
