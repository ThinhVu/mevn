import {Request, Response} from 'express'
// @ts-ignore
import packageJson from "../../package.json"
import User, {IUser} from "../db/models/user";
import jwt from 'jsonwebtoken';
import config from "../config";

export function generateRandomCode(length) {
   let output = '';
   for (let i = 0; i<length; ++i) {
      const useNumber = randomBoolean()
      if (useNumber) {
         output += String.fromCharCode(randomNumberInRange(48, 57))
      } else {
         output += String.fromCharCode(randomNumberInRange(65, 90))
      }
   }
   return output;
}

export function randomBoolean() {
   return Math.floor(Math.random() * 5) % 2 == 0
}

export function randomNumberInRange(lower, upper) {
   return lower + Math.floor(Math.random() * (upper-lower))
}

export function apiError(e: Error | string, res: Response) {
   console.error(e)
   res.status(500).send({error: typeof(e) === 'string' ? e : e.message})
}

export function getVersion() {
   return packageJson.version
}

export function parseAuthorization(req: Request) {
   const authorization = req.headers.authorization
   if (authorization) {
      const jwtToken = req.headers.authorization.split(' ')[1];
      const data = jwt.decode(jwtToken, config.jwtSecret);
      if (data) {
         return {
            user: data.user,
            expired: Date.now() > data.exp * 1000
         }
      }
   }
   return { user: null, expired: null }
}

export async function auth(req: Request): Promise<IUser> {
   // eslint-disable-next-line prefer-const
   let {user, expired} = parseAuthorization(req);
   if (expired) {
      // jwt expired -> get user info from provided username & password
      user = await User.findOne({email: user.email, password: user.password}, {_id: 1, email: 1, password: 1, role: 1});

      // if account password has been changed -> user not found -> token failed to renew -> return error
      if (!user)
         throw new Error("Invalid user");
   }

   if (!user)
      throw new Error("Invalid user");

   return user;
}

export default {
   parseAuthorization,
   auth,
   apiError,
   randomBoolean,
   randomNumberInRange,
   generateRandomCode,
   getVersion
}
