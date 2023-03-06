import UserModel from "../../db/models/user";
import AppMetric from "../../db/models/metric/app-metric";

export async function getAppMetric() {
   return {
      users: await UserModel.count(),
      at: new Date()
   }
}

export async function getAppMetricHistory(from: Date, to: Date) {
   return AppMetric.find({ $and: [{ at: { $gte: from } }, { at: { $lte: to } }] })
}

export async function snapshot() {
   try {
      const appMetric = await getAppMetric()
      await AppMetric.create(appMetric)
   } catch (e) {
      console.error(e)
   }
}
