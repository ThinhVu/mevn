import {Response} from 'express'
// @ts-ignore
import packageJson from "../../package.json"
export function generateRandomCode(length) {
   let output = '';
   for (let i = 0; i < length; ++i) {
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
   return lower + Math.floor(Math.random() * (upper - lower))
}

export class ApiError extends Error {
   errorCode: string
   message: string
   __API_ERROR__: boolean

   constructor(errorCode: string, message?: string) {
      super(errorCode)
      this.__API_ERROR__ = true
      this.errorCode = errorCode
      this.message = message
   }
}

function readableResp(e) {
   if (e.data && e.data.data) {
      return e.data.data
   }
   if (e.response && e.response.data) {
      return e.response.data
   }
   return e.message
}

export function handleApiError(e: ApiError | Error | string, res: Response) {
   // for some reason, the error is not an instance of ApiError
   // @ts-ignore
   if (e.__API_ERROR__) {
      // @ts-ignore
      res.status(400).send({error: e.errorCode, message: e.message})
   } else {
      const reason = typeof (e) === 'string' ? e : readableResp(e)
      res.status(500).send({error: "E_000", reason})
   }
}

export function getVersion() {
   return packageJson.version
}
