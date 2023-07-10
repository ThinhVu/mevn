import {Request} from "express";
import jwt from 'jsonwebtoken';
// @ts-ignore
import CryptoJS from 'crypto-js';
import {IUser} from "../db/models/user";

export interface IAuthData {
   user: Record<string, any>,
   expired: boolean
}

export function parseAuthorization(req: Request): IAuthData {
   const authorization = req.headers.authorization
   if (!authorization)
      return {user: null, expired: null}

   const jwtToken = req.headers.authorization.split(' ')[1];
   const data = jwt.verify(jwtToken, process.env.JWT_SECRET) as { user: Record<string, unknown>, exp: number, iat: number }
   if (!data)
      return {user: null, expired: null}

   return {user: data.user, expired: Date.now() > data.exp * 1000}
}

export function genToken(user: IUser) {
   const payload = {
      user: {
         _id: user._id,
         email: user.email,
         role: user.role,
         password: user.password
      }
   }
   return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})
}
