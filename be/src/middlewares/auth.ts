import {handleApiError} from "../utils/common-util"
import {parseAuthorization} from "../utils/auth-util"
import {UserRole} from "../db/models/user";
import {Request} from "express";
import {Types} from "mongoose";

export interface IAuthUser {
   _id: Types.ObjectId,
   email: string,
   password: string,
   role: UserRole
}

export interface UserRequest extends Request {
   user: IAuthUser
}

export async function requireAdmin(req, res, next) {
   try {
      const {user, expired} = parseAuthorization(req)
      if (expired) throw new Error("Token expired")
      if (!user) throw new Error("Invalid user")
      if (user.role !== UserRole.Admin) throw new Error("Permission denied")
      req.user = user
      return next()
   } catch (e) {
      handleApiError(e, res)
   }
}

export async function requireUser(req, res, next) {
   try {
      const {user, expired} = parseAuthorization(req)
      if (expired) throw new Error("Token expired")
      if (!user) throw new Error("Invalid user")
      req.user = user
      return next()
   } catch (e) {
      handleApiError(e, res)
   }
}
