import {Request} from "express";
import jwt from 'jsonwebtoken';
import {IAuthData, IUser} from "../types";

export function parseAuthorization(req: Request): IAuthData {
   const authorization = req.headers.authorization
   if (!authorization)
      return {user: null, expired: null}

   const jwtToken = req.headers.authorization.split(' ')[1];
   const data = jwt.decode(jwtToken, process.env.JWT_SECRET);
   if (!data)
      return {user: null, expired: null}

   return {user: data.user, expired: Date.now() > data.exp * 1000}
}

export function genToken(user: IUser) {
   const payload = {
      user: {_id: user._id, email: user.email, password: user.password, role: user.role}
   }
   return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})
}
