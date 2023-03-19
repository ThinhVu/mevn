import mongoose from 'mongoose';
import DbMigrateHistoryModel from '../db/models/db-migrate-history';
import patches from './patches';
import Util from '../utils/common-util';
import config from '../config';
import UserModel from './models/user';
import {createUser} from "../business-logic/user";
import {UserRole} from "../constants/types";
import bcrypt from 'bcrypt';

async function init() {
   try {
      const db = await mongoose.connect(config.mongoDBConn, {
         useCreateIndex: true,
         useNewUrlParser: true,
         useFindAndModify: false,
         useUnifiedTopology: true,
      });
      const adminUser = await UserModel.findOne({email: 'admin'})
      if (!adminUser) {
         console.log('[Db::init] Create admin user')
         const hashPassword = await bcrypt.hash(config.adminCode, 10)
         await createUser({
            username: "admin",
            email: "admin",
            password: hashPassword,
            createdAt: new Date(),
            role: UserRole.Admin
         })
      }

      console.log('[Db::init] DB connected');
      return db;
   } catch (error) {
      console.error('[Db::init] Failed to connect', error);
      process.exit(1);
   }
}

async function patchIsNotApplied(patch) {
   return (await DbMigrateHistoryModel.count({id: patch.patchId, success: true})) === 0
}

async function migrate() {
   const currentVersion = Util.getVersion();
   console.log('[Db::migrate] Patch begin');
   for (const patch of patches) {
      if (patch.shouldRun(currentVersion)) {
         if (await patchIsNotApplied(patch)) {
            try {
               console.log(`[Db::migrate] Applying patch: ${patch.patchId}`)
               await patch.run()
               await DbMigrateHistoryModel.create({id: patch.patchId, success: true, date: new Date()})
               console.log(`[Db::migrate] Patch ${patch.patchId} success.`)
            } catch (e) {
               console.log(`[Db::migrate] Patch failed with reason: ${e.message}`)
               await DbMigrateHistoryModel.create({id: patch.patchId, success: false, date: new Date(), reason: e.message})
            }
         } else {
            console.log(`[Db::migrate] Patch ${patch.patchId} is applied. Skip`)
         }
      } else {
         console.log(`[Db::migrate] Patch ${patch.patchId} doesn't need to upgrade. Skip`)
      }
   }

   console.log('[Db::migrate] Patch end!');
}

export default {init, migrate}
