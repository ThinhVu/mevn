import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';
import User, {IUser} from "../db/models/user";
import {AuthRequest, AuthUser} from "../constants/types";
import {
   createUser,
   getAuthUserByEmail,
   getUserPublicInfoById,
   isUserWithEmailExisted,
   updatePassword,
   updateUser,
   updateUserResetPasswordToken
} from '../business-logic/user';
import {apiError, parseAuthorization, randomNumberInRange} from "../utils/common-util";
import {buildEmailPayload, sendEmail} from "../utils/email-util";
import config from "../config";
import {genToken, UserRequest} from "../utils/auth-util";
import To from "../utils/data-parser";

export default {
   signUp: async (req: AuthRequest, res: Response): Promise<any> => {
      try {
         const {email, password} = req.body;
         if (!email || !password)
            return res.status(400).send({error: 'Missing field "email" or "password"'});
         if (await isUserWithEmailExisted(email))
            return res.status(400).send({error: 'Email has been used by other'});
         const username = new Date().getTime().toString();
         const hashPassword = await bcrypt.hash(password, 10)
         const user = await createUser({username, email, password: hashPassword, createdAt: new Date()});
         const token: AuthUser = genToken(user)
         res.cookie('token', token).send({data: {user, token}});
      } catch (e) {
         apiError(e, res);
      }
   },
   signIn: async (req: AuthRequest, res: Response): Promise<any> => {
      const {email, password} = req.body;
      const user = await User.findOne({email});
      if (!user)
         return res.status(400).send({error: 'User with provided email is not exists'});
      const validate = await bcrypt.compare(password, user.password);
      if (!validate)
         return res.status(400).send({error: 'Incorrect email or password'});
      const token = genToken(user)
      return res.cookie('token', token).send({data: {user, token}});
   },
   auth: async (req: AuthRequest, res: Response): Promise<any> => {
      try {
         // eslint-disable-next-line prefer-const
         const authData = parseAuthorization(req);
         const {email, password} = authData.user;
         const user = await User.findOne({email, password});
         if (!user)
            return res.status(400).send({error: 'Invalid user'})
         const token = genToken(user);
         return res.cookie('token', token).send({data: {user, token}});
      } catch (e) {
         apiError(e, res);
      }
   },
   logout: async (req: AuthRequest, res: Response): Promise<any> => {
      if (req.cookies['token']) {
         return res.clearCookie('token').send({data: {result: true}});
      } else {
         return res.send({data: {result: true}});
      }
   },
   changePassword: async (req: AuthRequest, res: Response): Promise<any> => {
      try {
         const {email, password, newPassword} = req.body;
         const newPasswordHash = await bcrypt.hash(newPassword, 10);
         const user = await User.findOne({email});
         if (!user) {
            return res.status(400).send({error: 'Incorrect email or password'});
         }
         const isValidPassword = await bcrypt.compare(password, user.password);
         if (!isValidPassword) {
            return res.status(400).send({error: 'Incorrect email or password'});
         }
         await User.updateOne({email}, {password: newPasswordHash});
         res.status(204).end();
      } catch (e) {
         apiError(e, res);
      }
   },
   forgotPassword: async (req: AuthRequest, res: Response): Promise<any> => {
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
   },
   resetPassword: async (req: AuthRequest, res: Response): Promise<any> => {
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
   },
   getAll: async (req: Request, res: Response): Promise<any> => {
      try {
         const ITEM_PER_PAGES = 20
         const skip = ((+req.query.page - 1) || 0) * ITEM_PER_PAGES
         const rs = await User.find().skip(skip).limit(ITEM_PER_PAGES)
         res.send({data: rs})
      } catch (e) {
         apiError(e, res);
      }
   },
   count: async (req: Request, res: Response): Promise<any> => {
      try {
         const rs = await User.count()
         res.send({data: rs})
      } catch (e) {
         apiError(e, res);
      }
   },
   getProfile: async (req: UserRequest, res) => {
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
   },
   updateProfile: async (req: Request, res: Response): Promise<any> => {
      try {
         const {avatar, fullName} = req.body;
         const authUser = req.user as IUser;
         const response = await updateUser(authUser._id, {avatar, fullName});
         res.send({data: response});
      } catch (e) {
         apiError(e, res);
      }
   }
}
