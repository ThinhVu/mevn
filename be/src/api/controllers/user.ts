import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
import Router from "routerex";

const router = Router()

router.post('/sign-up/v1', {
   title: 'Sign up',
   desc: 'Using this request to create new account',
   schema: {
      body: {
         email: {
            type: 'string',
            desc: 'User email which will be used to verify ...',
            required: true
         },
         password: {
            type: 'string',
            desc: 'A strong password is: At least 12 characters long but 14 or more is better. ' +
               'A combination of uppercase letters, lowercase letters, numbers, and symbols. ' +
               'Not a word that can be found in a dictionary or the name of a person, character, product, or organization.',
            required: true
         }
      }
   },
   response: {
      user: {
         type: 'object',
         description: 'created user'
      },
      token: {
         type: 'string',
         description: 'access_token which will be use for authorization'
      }
   }
}, rateLimit(), $(async (req, res) => {
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

router.post('/sign-in/v1', {
   title: 'Sign in',
   desc: 'Using this request to sign in',
   schema: {
      body: {
         email: {
            type: 'string',
            desc: 'User email which will be used to verify ...',
            required: true
         },
         password: {
            type: 'string',
            desc: 'A strong password is: At least 12 characters long but 14 or more is better. ' +
               'A combination of uppercase letters, lowercase letters, numbers, and symbols. ' +
               'Not a word that can be found in a dictionary or the name of a person, character, product, or organization.',
            required: true
         }
      }
   },
   response: {
      user: {
         type: 'object',
         description: 'created user'
      },
      token: {
         type: 'string',
         description: 'access_token which will be use for authorization'
      }
   }
}, rateLimit(), $(async (req, res) => {
   const {email, password} = req.body
   if (!email || !password)
      throw new Error('Missing field "email" or "password"')
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

router.get('/auth/v1', {
   title: 'Auth',
   desc: 'Using this request to get user info',
   schema: {
      headers: {
         authorization: {
            type: 'string',
            desc: 'Authorization header',
         }
      }
   },
   response: {
      user: {
         type: 'object',
         description: 'created user'
      },
      token: {
         type: 'string',
         description: 'access_token which will be use for authorization'
      }
   }
}, rateLimit(), $(async (req, res) => {
   // eslint-disable-next-line prefer-const
   const authData = parseAuthorization(req)
   const {email, password} = authData.user
   if (!email || !password)
      throw new Error('Missing field "email" or "password"')
   const user = await UserModel.findOne({email, password})
   if (!user)
      throw new Error('Invalid user')
   const token = genToken(user)
   res.cookie('token', token)
   return {user, token}
}))

router.get('/sign-out/v1', {
   title: 'Sign out',
   desc: 'Using this request to sign out',
   schema: {
      headers: {
         authorization: {
            type: 'string',
            desc: 'Authorization header',
         }
      }
   },
   response: {
      result: {
         type: 'boolean',
         description: 'true if sign out successfully'
      }
   }
}, async (req, res) => {
   if (req.cookies['token']) {
      return res.clearCookie('token').send({data: {result: true}})
   } else {
      return res.send({data: {result: true}});
   }
})

router.post('/change-password/v1', {
   title: 'Change password',
   desc: 'Using this request to change password',
   schema: {
      body: {
         email: {
            type: 'string',
            desc: 'User email which will be used to verify ...',
            required: true
         },
         password: {
            type: 'string',
            desc: 'A strong password is: At least 12 characters long but 14 or more is better. ' +
               'A combination of uppercase letters, lowercase letters, numbers, and symbols. ' +
               'Not a word that can be found in a dictionary or the name of a person, character, product, or organization.',
            required: true
         }
      }
   },
   response: {
      result: {
         type: 'boolean',
         description: 'true if change password successfully'
      }
   }
}, $(async (req, res) => {
   const {email, password, newPassword} = req.body
   if (!email || !password || !newPassword)
      throw new Error('Missing field "email" or "password" or "newPassword"')
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

router.post('/forgot-password/v1', {
   title: 'Forgot password',
   desc: 'Using this request to forgot password',
   schema: {
      body: {
         email: {
            type: 'string',
            desc: 'User email which will be used to verify ...',
            required: true
         }
      }
   },
   response: {
      result: {
         type: 'boolean',
         description: 'true if forgot password successfully'
      }
   }
}, $(async (req) => {
   const {email} = req.body
   if (!email)
      throw new Error('Missing field "email"')
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

router.post('/reset-password/v1', {
   title: 'Reset password',
   desc: 'Using this request to reset password',
   schema: {
      body: {
         email: {
            type: 'string',
            desc: 'User email which will be used to verify ...',
            required: true
         },
         password: {
            type: 'string',
            desc: 'A strong password is: At least 12 characters long but 14 or more is better. ' +
               'A combination of uppercase letters, lowercase letters, numbers, and symbols. ' +
               'Not a word that can be found in a dictionary or the name of a person, character, product, or organization.',
            required: true
         },
         code: {
            type: 'string',
            desc: 'Reset password code',
            required: true
         }
      }
   },
   response: {
      user: {
         type: 'object',
         description: 'created user'
      }
   }
}, $(async (req, res) => {
   const {password, code, email} = req.body
   if (!password || !code || !email)
      throw new Error('Missing field "password" or "code" or "email"')
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

router.get('/profile/v1/:id', {
   title: 'Get user profile',
   desc: 'Using this request to get user profile',
   schema: {
      params: {
         id: {
            type: 'string',
            desc: 'User id',
            required: true
         }
      }
   },
   response: {
      user: {
         type: 'object',
         description: 'user profile'
      }
   }
}, requireUser, $(async (req: UserRequest) => {
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

router.put('/profile/v1', {
   title: 'Update user profile',
   desc: 'Using this request to update user profile',
   schema: {
      body: {
         avatar: {
            type: 'string',
            desc: 'User avatar',
            required: false
         },
         fullName: {
            type: 'string',
            desc: 'User full name',
         }
      }
   },
   response: {
      user: {
         type: 'object',
         description: 'updated user'
      }
   }
}, requireUser, $(async (req: UserRequest) => {
   const {avatar, fullName} = req.body;
   return updateUser(req.user._id, {avatar, fullName});
}))

export default router
