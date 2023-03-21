import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import UserModel from "../../db/models/user";
import {
   createUser,
   getAuthUserByEmail,
   getUserPublicInfoById,
   isUserWithEmailExisted,
   updatePassword,
   updateUser,
   updateUserResetPasswordToken
} from '../../business-logic/user';
import {parseAuthorization, randomNumberInRange} from "../../utils/common-util";
import {buildEmailPayload, sendEmail} from "../../utils/email-util";
import config from "../../config";
import {genToken, UserRequest} from "../../utils/auth-util";
import To from "../../utils/data-parser";
import rateLimit from "../../middlewares/rate-limit";
import $ from "../../middlewares/safe-call";
import {requireUser} from "../../middlewares/auth";

const router = express.Router()

router.post('/sign-up/0.0.1/', rateLimit, $(async (req, res) => {
   const {email, password} = req.body
   if (!email || !password)
      throw new Error('Missing field "email" or "password"')
   if (await isUserWithEmailExisted(email))
      throw new Error('Email has been used by other')
   const username = new Date().getTime().toString()
   const hashPassword = await bcrypt.hash(password, 10)
   const user = await createUser({username, email, password: hashPassword, createdAt: new Date()})
   const token = genToken(user)
   res.cookie('token', token)
   return {user, token}
}))

router.post('/sign-in/0.0.1/', rateLimit, $(async (req, res) => {
   const {email, password} = req.body
   const user = await UserModel.findOne({email})
   if (!user)
      throw new Error('User with provided email is not exists')
   const validate = await bcrypt.compare(password, user.password)
   if (!validate)
      throw new Error('Incorrect email or password')
   const token = genToken(user)
   res.cookie('token', token)
   return {user, token}
}))

router.get('/auth/0.0.1/', rateLimit, $(async (req, res) => {
   // eslint-disable-next-line prefer-const
   const authData = parseAuthorization(req)
   const {email, password} = authData.user
   const user = await UserModel.findOne({email, password})
   if (!user)
      throw new Error('Invalid user')
   const token = genToken(user)
   res.cookie('token', token)
   return {user, token}
}))

router.get('/sign-out/0.0.1/', async (req, res) => {
   if (req.cookies['token']) {
      return res.clearCookie('token').send({data: {result: true}})
   } else {
      return res.send({data: {result: true}});
   }
})

router.post('/change-password/0.0.1/', $(async (req, res) => {
   const {email, password, newPassword} = req.body
   const newPasswordHash = await bcrypt.hash(newPassword, 10)
   const user = await UserModel.findOne({email})
   if (!user)
      throw new Error('Incorrect email or password')
   const isValidPassword = await bcrypt.compare(password, user.password)
   if (!isValidPassword)
      throw new Error('Incorrect email or password');
   await UserModel.updateOne({email}, {password: newPasswordHash})
   res.status(204)
}))

router.post('/forgot-password/0.0.1/', $(async (req) => {
   const {email} = req.body
   const user = await getAuthUserByEmail(email)
   if (!user)
      throw new Error('User with provided email is not exists')
   const resetPasswordCode = randomNumberInRange(1001, 9999)
   await updateUserResetPasswordToken(user._id, resetPasswordCode)
   const greeting = `Hey "${user.fullName || user.email}"`
   const mainContent = `We received a request to reset your password. The reset password code is "${resetPasswordCode}".\r\nIf you do not make this request, you can safely ignore this message.`
   await sendEmail(buildEmailPayload({greeting, mainContent, subject: 'Reset Password Request', to: email}))
   return true
}))

router.post('/reset-password/0.0.1/', $(async (req, res) => {
   const {password, code, email} = req.body
   const user = await getAuthUserByEmail(email)
   if (!user)
      throw new Error('User not exists')
   if (user.resetPasswordToken !== code)
      throw new Error('Invalid reset code')
   const passwordHash = await bcrypt.hash(password, 10)
   await updatePassword(user._id, passwordHash)
   const body = {_id: user._id, email: user.email, password: passwordHash}
   const token = jwt.sign({user: body}, config.jwtSecret)
   res.cookie('token', token)
   return {user, token}
}))

router.get('/profile/0.0.1/:id', requireUser, $(async (req: UserRequest) => {
   let user
   if (req.params.id === 'me') {
      user = await getUserPublicInfoById(req.user._id)
   } else if (req.params.id) {
      user = await getUserPublicInfoById(To.objectId(req.params.id))
   } else {
      throw new Error("Missing :id")
   }
   return user
}))

router.put('/profile/0.1.1/', requireUser, $(async (req: UserRequest) => {
   const {avatar, fullName} = req.body;
   return updateUser(req.user._id, {avatar, fullName});
}))

export default router;
