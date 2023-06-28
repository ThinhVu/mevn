import UserModel, {UserRole} from "../db/models/user";
import {createUser} from "../business-logic/user";
import bcrypt from 'bcrypt';

export default async function useAdmin() {
   console.log('[plugin] useAdmin')
   async function ensureAdminUserExists() {
      console.log('[useAdmin] Checking if admin user existed...')
      const adminUser = await UserModel.findOne({email: 'admin'})
      if (adminUser) {
         console.log('[useAdmin] Admin user existed!')
      } else {
         console.log('[useAdmin] Admin user not exists. Create new!')
         const hashPassword = await bcrypt.hash(process.env.ADMIN_CODE, 10)
         await createUser({
            username: "admin",
            email: "admin",
            password: hashPassword,
            createdAt: new Date(),
            role: UserRole.Admin
         })
         console.log('[useAdmin] Admin user created!')
      }
   }
   await ensureAdminUserExists()
}
