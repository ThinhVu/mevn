import {Request} from "express";
import {IUser} from "../db/models/user";
import jwt from 'jsonwebtoken';
import config from "../config";
import {Types} from "mongoose";

export interface IAuthUser {
   _id: Types.ObjectId;
   phone: string;
   password: string;
}

export interface IAuthAdmin {
   _id: Types.ObjectId;
   email: string;
   password: string;
}

export interface IAuthData {
   user: Record<string, any>,
   expired: boolean
}

export interface UserRequest extends Request {
   user: IAuthUser
}

export function parseAuthorization(req: Request): IAuthData {
   const authorization = req.headers.authorization
   if (!authorization)
      return {user: null, expired: null}

   const jwtToken = req.headers.authorization.split(' ')[1];
   const data = jwt.decode(jwtToken, config.jwtSecret);
   if (!data)
      return {user: null, expired: null}

   return {user: data.user, expired: Date.now() > data.exp * 1000}
}

export function genToken(user: IUser) {
   const payload = {
      user: {_id: user._id, email: user.email, password: user.password, role: user.role}
   }
   return jwt.sign(payload, config.jwtSecret, {expiresIn: '7d'})
}
