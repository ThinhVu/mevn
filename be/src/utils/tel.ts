import {sendOTP as sendOTPStringee} from './stringee'
import {sendOTP as sendOTPTwilio} from "./twilio";

export async function sendOTP(phoneNr: string, otpCode: string | number) {
  if (process.env.STRINGEE_SID) {
    return sendOTPStringee(phoneNr, otpCode)
  } else {
    return sendOTPTwilio(phoneNr, otpCode)
  }
}