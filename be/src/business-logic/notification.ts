import _ from 'lodash';
import UserModel from "../db/models/user";
import NotificationModel from "../db/models/notification";
import * as UserDb from './user';
import {Types} from 'mongoose';

export interface NotificationMetadata {
   publisher: string,
   data?: any
}

async function populatePublisher(notifies){
   const publisherIds = notifies.map(notify => notify.publisher)
   const publishers = await UserModel.find({_id: { $in: publisherIds }})

   const publisherMap = _.reduce(publishers, (output, publisher) => {
      if (publisher) {
         const publisherId = String(publisher._id);
         if (!output[publisherId])
            output[publisherId] = UserDb.getUserPublicInfo(publisher);
      }
      return output;
   }, {});

   for (const notify of notifies) {
      notify.publisher = publisherMap[String(notify.publisher)]
   }
}

export const getUnseenNotifies = async (userId: Types.ObjectId) : Promise<any> => {
   const notifies = await NotificationModel.find({toUser: userId, seen: false})
   const notifyIds = notifies.map(notify => notify._id);
   NotificationModel.updateMany({ _id: {$in: notifyIds }}, { seen: true }).then()
   const output = notifies.map(({_id, event, at, metadata: { publisher, data }}) => ({_id, event, at, publisher, data}))
   await populatePublisher(output);
   return output;
}

export const notifyUser = (toUserId: string, event: string, metadata: NotificationMetadata, notiId?: string) : void => {
   try {
      // @ts-ignore
      global.io.toUser(toUserId).emit(event, JSON.stringify({...metadata, notificationId: notiId}));
   } catch (e) {
      console.warn(`Failed to publish notification due to error`, e.message)
   }
}
