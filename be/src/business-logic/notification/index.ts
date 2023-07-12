import _ from 'lodash';
import {Types} from 'mongoose';
import NotificationModel, {INotification} from "../../db/models/notification";
import UserModel from "../../db/models/user";
import fcm from './fcm';
import {messaging} from 'firebase-admin'
import MulticastMessage = messaging.MulticastMessage;
import Notification = messaging.Notification;
import * as process from "process";
import {Events} from "../../constants/events";

export const seenNotifies = async (userId: Types.ObjectId, notifyIds: Types.ObjectId[]) => {
   return NotificationModel.deleteMany({_id: {$in: notifyIds}, to: userId})
}

export const getUnseenNotifies = async (userId: Types.ObjectId): Promise<any> => {
   return NotificationModel.find({to: userId, seen: false}).lean()
}

export const saveNotify = async (to: Types.ObjectId[], event: string, data: any): Promise<INotification> => {
   const rs = await NotificationModel.create({to, event, data, at: new Date(), seen: false})
   return rs.toObject()
}

export const notifyUser = async (to: Types.ObjectId[], event: string, data: any) => {
   const noti = await saveNotify(to, event, data)
   const notifyId = noti._id.toString()
   return notify(notifyId, to, event, data)
}

export const volatileNotifyUser = async (to: Types.ObjectId[], event: string, data: any) => {
   return notify("", to, event, data)
}

const notificationBuilder : Record<string, (payload: any) => Promise<Notification>> = {
   [Events.SYSTEM_NOTIFICATION]: async (payload: any) => {
      return {
         title: 'System notification',
         body: 'some content'
      }
   }
}

async function buildFcmNotification(event: string, data: any) {
   if (notificationBuilder[event])
      return notificationBuilder[event](data)
   return undefined
}

async function notify(notifyId: string, to: Types.ObjectId[], event: string, data: any) {
   try {
      let response;

      if (fcm) {
         const user = await UserModel.find({_id: {$in: to}}).lean()
         const fcmTokens = _.compact(user.map(u => u.fcm))
         const notification = await buildFcmNotification(event, data)
         if (fcmTokens.length) {
            response = await sendFcm(fcmTokens, {
               notification,
               data: {
                  event,
                  notifyId,
                  data: JSON.stringify(data)
               }
            })
         } else {
            response = []
         }
      } else {
         response = []
      }

      if (process.env.SOCKET_IO_NOTIFY) {
         try {
            for (const userId of to) {
               // compatibility, delete later
               // @obsolete
               // @ts-ignore
               global.io.of('/app').toUser(userId.toString()).emit(event, notifyId, JSON.stringify(data))
            }
         } catch (e) {
            console.error(e)
         }
      }
      return response
   } catch (e) {
      console.warn(`Failed to publish notification due to error`, e.message)
      throw e
   }
}

// https://firebase.google.com/docs/cloud-messaging/send-message
async function sendFcm(tokens: string[], {notification, data}: { notification: Notification, data }) {
   if (!tokens || !tokens.length)
      return
   const message: MulticastMessage = {
      tokens,
      notification,
      data,
      apns: {
         headers: {
            "apns-priority": "5",
         },
         payload: {
            aps: {
               'content-available': 1
            }
         }
      },
      android: {
         priority: 'high'
      },
      webpush: {
         headers: {
            TTL: "86400",
            Urgency: "high"
         }
      }
   }
   const result = await fcm.messaging().sendEachForMulticast(message)
   const failedSends = result.responses.filter(r => !r.success)
   if (!_.isEmpty(failedSends)) {
      // TODO: Retry
      console.log('[app-notification]', 'failed send', failedSends.map(fe => fe.error.message).join('\n'))
   }
   return result
}
