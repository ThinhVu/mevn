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
import {apiError, parseAuthorization, randomNumberInRange} from "../../utils/common-util";
import {buildEmailPayload, sendEmail} from "../../utils/email-util";
import config from "../../config";
import {genToken, UserRequest} from "../../utils/auth-util";
import To from "../../utils/data-parser";
import rateLimit from "../../middlewares/rate-limit";
import $ from "../../middlewares/safe-call";

const router = express.Router();

router.post('/sign-up', rateLimit, $(async (req, res) => {
   const {email, password} = req.body;
   if (!email || !password)
      throw new Error('Missing field "email" or "password"');
   if (await isUserWithEmailExisted(email))
      throw new Error('Email has been used by other');
   const username = new Date().getTime().toString();
   const hashPassword = await bcrypt.hash(password, 10)
   const user = await createUser({username, email, password: hashPassword, createdAt: new Date()});
   const token = genToken(user)
   res.cookie('token', token);
   return {data: {user, token}}
}))

router.post('/sign-in', rateLimit, $(async (req, res) => {
   const {email, password} = req.body;
   const user = await UserModel.findOne({email});
   if (!user)
      throw new Error('User with provided email is not exists')
   const validate = await bcrypt.compare(password, user.password);
   if (!validate)
      throw new Error('Incorrect email or password');
   const token = genToken(user)
   res.cookie('token', token);
   return {data: {user, token}};
}))

router.get('/auth', rateLimit, async (req, res) => {
   try {
      // eslint-disable-next-line prefer-const
      const authData = parseAuthorization(req);
      const {email, password} = authData.user;
      const user = await UserModel.findOne({email, password});
      if (!user)
         return res.status(400).send({error: 'Invalid user'})
      const token = genToken(user);
      return res.cookie('token', token).send({data: {user, token}});
   } catch (e) {
      apiError(e, res);
   }
})

router.get('/sign-out', async (req, res) => {
   if (req.cookies['token']) {
      return res.clearCookie('token').send({data: {result: true}});
   } else {
      return res.send({data: {result: true}});
   }
})

router.post('/change-password', async (req, res) => {
   try {
      const {email, password, newPassword} = req.body;
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      const user = await UserModel.findOne({email});
      if (!user)
         return res.status(400).send({error: 'Incorrect email or password'});
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword)
         return res.status(400).send({error: 'Incorrect email or password'});
      await UserModel.updateOne({email}, {password: newPasswordHash});
      res.status(204).end();
   } catch (e) {
      apiError(e, res);
   }
})

router.post('/forgot-password', async (req, res) => {
   try {
      const {email} = req.body
      const user = await getAuthUserByEmail(email)
      if (!user)
         return res.status(400).send({error: 'User with provided email is not exists'})
      const resetPasswordCode = randomNumberInRange(1001, 9999)
      await updateUserResetPasswordToken(user._id, resetPasswordCode)
      const greeting = `Hey "${user.fullName || user.email}"`
      const mainContent = `We received a request to reset your password. The reset password code is "${resetPasswordCode}".\r\nIf you do not make this request, you can safely ignore this message.`
      await sendEmail(buildEmailPayload({greeting, mainContent, subject: 'Reset Password Request', to: email}))
      return res.send({data: true})
   } catch (e) {
      apiError(e, res)
   }
})

router.post('/reset-password', async (req, res) => {
   try {
      const {password, code, email} = req.body;
      const user = await getAuthUserByEmail(email);
      if (!user)
         return res.status(400).send({error: 'USER_WITH_EMAIL_NOT_FOUND'})
      if (user.resetPasswordToken !== code)
         return res.status(400).send({error: 'Invalid reset code.'})
      const passwordHash = await bcrypt.hash(password, 10)
      await updatePassword(user._id, passwordHash)
      const body = {_id: user._id, email: user.email, password: passwordHash}
      const authToken = jwt.sign({user: body}, config.jwtSecret)
      return res.cookie('token', authToken).send({data: {user, token: authToken}})
   } catch (e) {
      apiError(e, res);
   }
})

router.get('/profile/:id', async (req: UserRequest, res) => {
   try {
      let user;
      if (req.params.id === 'me') {
         user = await getUserPublicInfoById(req.user._id);
      } else if (req.params.id) {
         user = await getUserPublicInfoById(To.objectId(req.params.id));
      } else {
         throw new Error("Missing :id");
      }
      return res.send({data: user});
   } catch (e) {
      apiError(e, res);
   }
})

router.put('/profile', async (req: UserRequest, res) => {
   try {
      const {avatar, fullName} = req.body;
      const response = await updateUser(req.user._id, {avatar, fullName});
      res.send({data: response});
   } catch (e) {
      apiError(e, res);
   }
})

export default router;
