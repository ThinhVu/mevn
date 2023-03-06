import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Types} from "mongoose";
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
import {apiError, generateRandomCode, parseAuthorization} from "../utils/common-util";
import {sendEmail} from "../utils/email-util";
import config from "../config";

export default {
   signUp: async (req: AuthRequest, res: Response): Promise<any> => {
      try {
         const {email, password} = req.body;

         if (!email || !password) {
            return res.status(400).send({error: 'Missing field "email" or "password"'});
         }

         if (await isUserWithEmailExisted(email)) {
            return res.status(400).send({error: 'Email has been used by other'});
         }

         const username = new Date().getTime().toString();
         const hashPassword = await bcrypt.hash(password, 10)
         const user = await createUser({username, email, password: hashPassword, createdAt: new Date()});
         const authUser: AuthUser = {_id: user._id, email: user.email, password: user.password, role: user.role}
         const token = jwt.sign({user: authUser}, config.jwtSecret, {expiresIn: '7d'});
         res.cookie('token', token).send({data: {user, token}});
      } catch (e) {
         apiError(e, res);
      }
   },
   signIn: async (req: AuthRequest, res: Response): Promise<any> => {
      const {email, password} = req.body;
      const user = await User.findOne({email});

      if (!user) {
         return res.status(400).send({error: 'User with provided email is not exists'});
      }

      const validate = await bcrypt.compare(password, user.password);
      if (!validate) {
         return res.status(400).send({error: 'Incorrect email or password'});
      }

      const body = {_id: user._id, email: user.email, password: user.password, role: user.role}
      const token = jwt.sign({user: body}, config.jwtSecret, {expiresIn: '7d'});

      return res.cookie('token', token).send({data: {user: body, token}});
   },
   auth: async (req: AuthRequest, res: Response): Promise<any> => {
      try {
         // eslint-disable-next-line prefer-const
         let {user, expired} = parseAuthorization(req);

         if (expired) {
            // jwt expired -> get user info from provided username & password
            user = await User.findOne({email: user.email, password: user.password}, {_id: 1, email: 1, password: 1, role: 1});

            // if account password has been changed -> user not found -> token failed to renew -> return error
            if (!user)
               return res.status(400).send({error: 'Invalid user'})
         }

         if (!user)
            return res.status(400).send({error: 'Invalid user'})

         const body = {_id: user._id, email: user.email, password: user.password, role: user.role}
         const token = jwt.sign({user: body}, config.jwtSecret, {expiresIn: '7d'});
         return res.cookie('token', token).send({data: {user: body, token}});
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
      const {email} = req.body;

      const user = await getAuthUserByEmail(email);
      if (!user) {
         return res.status(400).send({error: 'User with provided email is not exists'});
      }

      const resetPasswordCode = generateRandomCode(6);
      await updateUserResetPasswordToken(user._id, resetPasswordCode);

      const greeting = `Hey "${user.fullName || user.email}"`;
      const description = `We received a request to reset your password. The reset password code is "${resetPasswordCode}".\r\nIf you do not make this request, you can safely ignore this message.`;

      try {
         await sendEmail({
            to: email,
            subject: 'Reset Password Request',
            html: `
<!doctype html>
<html>
   <head>
      <meta name="viewport" content="width=device-width">
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <title>Reset password code</title>
   </head>
   <body>
    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px; Margin-top: 20px;">${greeting},</p>
    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${description}</p>
    </body>
</html>
`,
         });
         return res.send({data: true});
      } catch (e) {
         apiError(e, res);
      }
   },
   resetPassword: async (req: AuthRequest, res: Response): Promise<any> => {
      try {
         const {password, code, email} = req.body;
         const user = await getAuthUserByEmail(email);

         if (!user) {
            return res.status(400).send({error: 'USER_WITH_EMAIL_NOT_FOUND'});
         }

         if (user.resetPasswordToken !== code) {
            return res.status(400).send({error: 'Invalid reset code.'});
         }

         const passwordHash = await bcrypt.hash(password, 10);
         await updatePassword(user._id, passwordHash);

         const body = {_id: user._id, email: user.email, password: passwordHash};
         const authToken = jwt.sign({user: body}, config.jwtSecret);
         return res.cookie('token', authToken).send({data: {user, token: authToken}});
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
   getUser: async (req: Request, res: Response): Promise<any> => {
      try {
         let user;
         if (req.params.id === 'me') {
            const authUser = req.user as IUser;
            user = await getUserPublicInfoById(authUser._id);
         } else if (req.params.id) {
            user = await getUserPublicInfoById(new Types.ObjectId(req.params.id));
         } else {
            throw "Missing :id";
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
