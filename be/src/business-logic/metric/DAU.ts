import DAUModel from '../../db/models/metric/DAU'
import DAULogModel from '../../db/models/metric/DAU-log'
import dayjs from 'dayjs'

export async function snapshot() {
   const todayActiveUsers = await DAULogModel.count({
      $and: [
         {at: {$gte: dayjs().startOf('day').toDate()}},
         {at: {$lte: dayjs().endOf('day').toDate()}},
      ]
   })
   DAUModel.create({
      activeUsers: todayActiveUsers,
      at: new Date()
   }).catch(console.error)
}

export async function getDAUs(from: Date, to: Date) {
   // @ts-ignore
   return DAUModel.find({ $and: [{ at: { $gte: from } }, { at: { $lte: to } }] })
}
