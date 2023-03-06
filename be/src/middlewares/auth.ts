import {UserRole} from "../constants/types";
import {Types} from "mongoose";
import {apiError, auth} from "../utils/common-util";

export async function requireAdmin(req, res, next){
   try {
      const user = await auth(req);
      const isAdmin = user.role === UserRole.Admin;

      if (!isAdmin) {
         return res.status(400).send({error: 'Not authorized.'});
      }

      user._id = new Types.ObjectId(user._id);
      req.user = user;

      return next();
   } catch (e) {
      apiError(e, res);
   }
}

export async function requireUser(req, res, next) {
   try {
      const user = await auth(req);
      user._id = new Types.ObjectId(user._id);
      req.user = user;
      return next();
   } catch (e) {
      apiError(e, res);
   }
}
